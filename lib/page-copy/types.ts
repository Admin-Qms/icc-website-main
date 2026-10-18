// Long-form copy for the service (/services/<slug>) and industry (/industries/<slug>)
// pages, kept out of lib/site.ts so each page's text lives in its own file.
// Strings are Markdown: inline links like [the readiness check](/assessment/) and
// **bold** render through components/Markdown.tsx.

export type CopySection = {
  heading: string;
  paragraphs: string[];
  // Optional list rendered after the paragraphs; each item is a short title and a full sentence.
  points?: { title: string; detail: string }[];
};

export type PageFaq = { question: string; answer: string };

export type PageCopy = {
  slug: string;
  // Date (YYYY-MM-DD) this copy last changed in substance; used as the sitemap lastmod.
  // Update it whenever the text is revised.
  updated: string;
  // Two or three opening paragraphs: what this is and why it matters to a Canadian business.
  overview: string[];
  // Three or four sections, each under its own H2.
  sections: CopySection[];
  // Five questions, rendered as an accordion and as FAQPage structured data.
  faqs: PageFaq[];
};
