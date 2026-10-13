import { FaqAccordion } from '@/components/FaqAccordion';
import { Markdown } from '@/components/Markdown';
import { splitFaq } from '@/lib/blog';

/** Use the blog FAQ convention while keeping the closing invitation outside it. */
export function GuideBody({ body }: { body: string }) {
  const faq = splitFaq(body);
  return <div className="mt-10">
    <Markdown>{faq.main}</Markdown>
    {faq.heading && <FaqAccordion heading={faq.heading} intro={faq.intro} items={faq.items} />}
    {faq.outro && <div className="mt-8"><Markdown>{faq.outro}</Markdown></div>}
    {faq.after && <div className="mt-12"><Markdown>{faq.after}</Markdown></div>}
  </div>;
}
