// Serve out/ and set CHAT_TEST_URL. Use an existing Playwright installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = process.env.CHAT_TEST_URL || 'http://127.0.0.1:3506';
const profiles = [[320, 568], [390, 844], [768, 1024], [1440, 900]];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHAT_BROWSER_PATH ? { executablePath: process.env.CHAT_BROWSER_PATH } : {}),
  });
  const errors = [];
  try {
    for (const [width, height] of profiles) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      try {
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        let pending;
        await page.route('**/api/chat{,/**}', route => { pending = route; });
        await page.route('**/api/contact{,/**}', route => route.abort());
        await page.goto(base, { waitUntil: 'networkidle' });
        await page.getByRole('button', { name: 'Chat with ISO Consultant', exact: true }).click();

        const dialog = page.getByRole('dialog', { name: 'Chat with ISO Consultant' });
        const chip = dialog.getByRole('link', { name: 'Speak to us', exact: true });
        assert.equal(await chip.count(), 1, 'The chatbot must offer a direct human-contact link');
        assert.equal(await chip.getAttribute('href'), '/contact/');
        assert.ok(await chip.isVisible());
        assert.equal(await chip.evaluate(e => getComputedStyle(e.parentElement).borderTopWidth), '0px');
        const bounds = await chip.boundingBox();
        const composer = await dialog.locator('form').boundingBox();
        assert.ok(bounds.y + bounds.height <= composer.y, 'The chip must stay above the message box');
        if (width < 640) assert.ok(bounds.height >= 44, 'The mobile contact target must be easy to tap');

        if (process.env.CHAT_SCREENSHOT_DIR && [390, 1440].includes(width)) {
          fs.mkdirSync(process.env.CHAT_SCREENSHOT_DIR, { recursive: true });
          await dialog.screenshot({ path: `${process.env.CHAT_SCREENSHOT_DIR}/speak-to-us-implemented-${width}.png` });
        }

        const input = dialog.getByRole('textbox', { name: 'Your message' });
        await input.fill('Explain document control');
        await input.press('Enter');
        await dialog.getByText('Thinking…', { exact: true }).waitFor();
        assert.ok(await chip.isVisible(), 'Human contact must remain available during a request');
        await pending.fulfill({ json: { reply: 'This is a hypothetical response used only for browser testing.' } });
        await dialog.getByText('This is a hypothetical response used only for browser testing.', { exact: true }).waitFor();
        assert.ok(await chip.isVisible(), 'Human contact must remain available after messages');
        assert.equal(await dialog.getByRole('button', { name: 'Which standards do you support?', exact: true }).count(), 0);

        await input.fill('A second test question');
        await input.press('Enter');
        await dialog.getByText('Thinking…', { exact: true }).waitFor();
        await pending.fulfill({ status: 429, headers: { 'Retry-After': '60' }, json: { error: 'Test rate limit' } });
        await dialog.getByRole('alert').waitFor();
        assert.ok(await chip.isVisible(), 'A chat failure must not block contacting the team');
        await chip.focus();
        await page.keyboard.press('Enter');
        await page.waitForURL('**/contact/');
        await page.getByLabel('Full name', { exact: true }).waitFor({ state: 'visible' });
        assert.equal(await page.getByRole('dialog').count(), 0);
        assert.ok(await page.getByRole('button', { name: 'Chat with ISO Consultant', exact: true }).isVisible());
        assert.equal(await page.locator('main').evaluate(e => e.inert), false);
        await page.waitForFunction(() => document.body.style.overflow !== 'hidden' && document.documentElement.style.overflow !== 'hidden');
        console.log(`PASS: human-contact handoff at ${width}×${height}`);
      } finally {
        await context.close();
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: all contact, persistence, keyboard and layout checks; no live API calls');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
