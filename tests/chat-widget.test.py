"""Browser regressions. Serve `out/`, then run with CHAT_TEST_URL set to that URL.
Requires Python Playwright and Chrome; no paid model calls are made.
"""
import os
import unittest
from playwright.sync_api import sync_playwright, expect

URL = os.environ.get('CHAT_TEST_URL', 'http://127.0.0.1:3017')
LONG_REPLY = '**Start of answer**\n\n' + '\n\n'.join(
    f'**Step {i}** — Review your processes, document the evidence, and agree the next actions with the responsible team. Track progress before the next audit.'
    for i in range(1, 12))

class ChatWidgetTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True, channel='chrome')

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width':390, 'height':844}, is_mobile=True, has_touch=True)
        self.page = self.context.new_page()
        self.page.goto(URL, wait_until='networkidle')
        self.page.get_by_role('button', name='Chat with ISO Consultant').click()
        self.dialog = self.page.get_by_role('dialog')
        self.input = self.page.get_by_role('textbox', name='Your message')

    def tearDown(self):
        self.context.close()

    def test_failed_question_can_be_retried_without_retyping_or_duplicates(self):
        attempts=[]
        def respond(route):
            attempts.append(route.request.post_data_json)
            if len(attempts)==1: route.abort('internetdisconnected')
            else: route.fulfill(json={'reply':'A gap assessment is the first step.'})
        self.page.route('**/api/chat{,/**}', respond)
        question='How do we prepare for ISO 9001?'
        self.input.fill(question)
        self.input.press('Enter')
        alert=self.dialog.get_by_role('alert')
        expect(alert).to_be_visible()
        self.assertNotIn('Failed to fetch', alert.inner_text())
        expect(self.input).to_have_value(question)
        self.dialog.get_by_role('button', name='Try again', exact=True).click()
        expect(self.dialog.get_by_text('A gap assessment is the first step.', exact=True)).to_be_visible()
        self.assertEqual(self.dialog.get_by_text(question, exact=True).count(), 1)
        self.assertEqual(attempts[0], attempts[1])
        expect(self.input).to_have_value('')

    def test_composer_grows_and_explains_its_limit(self):
        self.input.fill('First line\nSecond line\nThird line\nFourth line')
        self.assertGreater(self.input.bounding_box()['height'], 80)
        self.input.fill('x'*1195)
        expect(self.dialog.get_by_text('1195 / 1200')).to_be_visible()
        self.assertLessEqual(self.input.bounding_box()['height'], 130)
        self.input.fill('short')
        self.assertLess(self.input.bounding_box()['height'], 65)

    def test_stalled_request_recovers_without_overwriting_a_new_draft(self):
        self.page.clock.install()
        pending=[]
        self.page.route('**/api/chat{,/**}', lambda route:pending.append(route))
        self.input.fill('How do we prepare for ISO 9001?')
        self.input.press('Enter')
        expect(self.dialog.get_by_text('Thinking…',exact=True)).to_be_visible()
        self.input.fill('A different question I am still writing')
        self.page.clock.fast_forward(26000)
        expect(self.dialog.get_by_role('alert')).to_contain_text('too long')
        expect(self.dialog.get_by_text('Thinking…',exact=True)).to_have_count(0)
        expect(self.input).to_have_value('A different question I am still writing')
        expect(self.dialog.get_by_role('button',name='Try again',exact=True)).to_be_enabled()
        for route in pending:
            route.abort()

    def test_panel_and_composer_fit_mobile_tablet_and_desktop(self):
        for width, height in [(320,568),(375,667),(390,844),(412,915),(640,600),(768,1024),(1440,900),(844,390)]:
            with self.subTest(width=width,height=height):
                self.page.set_viewport_size({'width':width,'height':height})
                self.input.fill('First line\nSecond line\nThird line\nFourth line')
                self.page.wait_for_timeout(100)
                panel=self.dialog.bounding_box()
                composer=self.page.locator('#website-chat-panel form').bounding_box()
                self.assertGreaterEqual(panel['x'],0)
                self.assertGreaterEqual(panel['y'],0)
                self.assertLessEqual(panel['x']+panel['width'],width+1)
                self.assertLessEqual(panel['y']+panel['height'],height+1)
                self.assertLessEqual(composer['y']+composer['height'],height+1)
                self.assertTrue(self.dialog.evaluate('e=>e.scrollWidth<=e.clientWidth'))
        self.input.focus()
        self.page.keyboard.press('Escape')
        expect(self.page.get_by_role('button',name='Chat with ISO Consultant')).to_be_focused()

    def test_rate_limit_waits_before_enabling_retry(self):
        self.page.clock.install()
        self.page.route('**/api/chat{,/**}', lambda route:route.fulfill(status=429,headers={'Retry-After':'3'},json={'error':'busy'}))
        self.input.fill('How do audits work?')
        self.input.press('Enter')
        retry=self.dialog.get_by_role('button',name='Try again in 3s')
        expect(retry).to_be_disabled()
        expect(self.dialog.get_by_role('button',name='Send message')).to_be_disabled()
        self.page.clock.fast_forward(4000)
        expect(self.dialog.get_by_role('button',name='Try again',exact=True)).to_be_enabled()
        expect(self.dialog.get_by_role('button',name='Send message')).to_be_enabled()

    def test_mobile_focus_stays_in_chat_and_returns_to_launcher(self):
        for _ in range(16):
            self.page.keyboard.press('Tab')
            self.assertTrue(self.page.evaluate('!!document.activeElement.closest("#website-chat-panel")'))
        self.page.keyboard.press('Escape')
        expect(self.page.get_by_role('button',name='Chat with ISO Consultant')).to_be_focused()

    def test_new_long_answer_starts_at_the_top(self):
        self.page.route('**/api/chat{,/**}', lambda route:route.fulfill(json={'reply':LONG_REPLY}))
        self.input.fill('Explain the audit steps')
        self.input.press('Enter')
        start=self.dialog.get_by_text('Start of answer', exact=True)
        expect(start).to_be_visible()
        self.page.wait_for_timeout(500)
        rect=start.bounding_box()
        viewport=self.page.locator('#website-chat-panel [aria-live]').bounding_box()
        self.assertGreaterEqual(rect['y'], viewport['y'])
        self.assertLess(rect['y'], viewport['y']+viewport['height'])

    def test_reply_does_not_interrupt_reading_older_messages(self):
        pending=[]
        def respond(route):
            if not pending:
                pending.append(None)
                route.fulfill(json={'reply':LONG_REPLY})
            else: pending.append(route)
        self.page.route('**/api/chat{,/**}', respond)
        self.input.fill('Explain the audit steps')
        self.input.press('Enter')
        expect(self.dialog.get_by_text('Start of answer',exact=True)).to_be_visible()
        self.input.fill('What about documents?')
        self.input.press('Enter')
        expect(self.dialog.get_by_text('Thinking…',exact=True)).to_be_visible()
        self.page.locator('#website-chat-panel [aria-live]').evaluate('e=>{e.scrollTop=0;e.dispatchEvent(new Event("scroll"))}')
        self.page.wait_for_timeout(100)
        pending[-1].fulfill(json={'reply':'Review and approve documents.'})
        expect(self.dialog.get_by_text('Thinking…',exact=True)).to_have_count(0)
        self.page.wait_for_timeout(500)
        self.assertLess(self.page.locator('#website-chat-panel [aria-live]').evaluate('e=>e.scrollTop'), 10)
        expect(self.dialog.get_by_role('button',name='View new reply')).to_be_visible()

    def test_reply_does_not_remove_the_exchange_being_read_at_the_history_limit(self):
        pending=[]
        attempts=[]
        def respond(route):
            attempts.append(route.request)
            if len(attempts)<=5: route.fulfill(json={'reply':LONG_REPLY})
            else: pending.append(route)
        self.page.route('**/api/chat{,/**}',respond)
        for index in range(6):
            self.input.fill(f'Question {index+1} about audits')
            self.input.press('Enter')
            if index<5:
                expect(self.dialog.get_by_text('Start of answer',exact=True)).to_have_count(index+1)
        expect(self.dialog.get_by_text('Thinking…',exact=True)).to_be_visible()
        transcript=self.page.locator('#website-chat-panel [aria-live]')
        first=self.dialog.get_by_text('Question 1 about audits',exact=True)
        transcript.evaluate('(e,y)=>{e.scrollTop+=y-e.getBoundingClientRect().top;e.dispatchEvent(new Event("scroll"))}',first.bounding_box()['y'])
        before=first.bounding_box()['y']
        pending[-1].fulfill(json={'reply':'Review and approve documents.'})
        expect(self.dialog.get_by_text('Thinking…',exact=True)).to_have_count(0)
        expect(first).to_have_count(1)
        self.assertAlmostEqual(first.bounding_box()['y'],before,delta=2)
        expect(self.dialog.get_by_role('button',name='View new reply')).to_be_visible()

if __name__=='__main__': unittest.main(verbosity=2)
