import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { chatReplyMarkdown, linkifyChatReply, safeSiteHref } from "../lib/chatLinks.ts";

const site = "https://isocertificationconsultants.ca";

test("accepts only real links to the website", () => {
  assert.equal(safeSiteHref("https://isocertificationconsultants.ca/services/", site), "https://isocertificationconsultants.ca/services/");
  assert.equal(safeSiteHref("/services/", site), "https://isocertificationconsultants.ca/services/");
  assert.equal(safeSiteHref("/solutions/supplier-quality/", site), "https://isocertificationconsultants.ca/solutions/supplier-quality/");
  assert.equal(safeSiteHref("/PPAP/", site), null);
  assert.equal(safeSiteHref("https://isocertificationconsultants.ca.evil.example/", site), null);
  assert.equal(safeSiteHref("javascript:alert(1)", site), null);
});

test("does not turn an invented PPAP page into a clickable reference", () => {
  const reply = "- **Supplier Quality** – Supplier approval gates, APQP[**PPAP page**](/PPAP/)FAI packages, and linked PFMEA.";
  const html = renderToStaticMarkup(createElement(ReactMarkdown, null, chatReplyMarkdown(reply, site)));
  assert.doesNotMatch(html, /href="\/PPAP\/"/);
  assert.match(html, /APQP PPAP FAI packages/);
  assert.equal(safeSiteHref("http://localhost:3002/PPAP/", site), null);
});

test("does not repeat the page name before a valid link", () => {
  const reply = "For full details, see the Supplier Quality page: [Supplier Quality page](/solutions/supplier-quality/).";
  const html = renderToStaticMarkup(createElement(ReactMarkdown, null, chatReplyMarkdown(reply, site)));
  assert.match(html, /see the <a href="\/solutions\/supplier-quality\/">Supplier Quality page<\/a>\./);
});

test("turns named parenthetical routes into readable links", () => {
  const reply = "For more details, visit the Services page (/services/), the Standards workspace page (/solutions/standards/), or contact the team.";
  const parts = linkifyChatReply(reply, site);
  assert.equal(parts.map((part) => part.text).join(""), "For more details, visit the Services page, the Standards workspace page, or contact the team.");
  assert.deepEqual(parts.filter((part) => part.href), [
    { text: "Services page", href: "/services/" },
    { text: "Standards workspace page", href: "/solutions/standards/" },
  ]);
});

test("renders named Markdown links without exposing route syntax", () => {
  const parts = linkifyChatReply("See [Services](/services/) and [Standards workspace](/solutions/standards/).", site);
  assert.equal(parts.map((part) => part.text).join(""), "See Services and Standards workspace.");
  assert.deepEqual(parts.filter((part) => part.href), [
    { text: "Services", href: "/services/" },
    { text: "Standards workspace", href: "/solutions/standards/" },
  ]);
});

test("links only to this site, including bare absolute URLs", () => {
  const parts = linkifyChatReply("See [external](https://evil.example/) or https://isocertificationconsultants.ca/contact/.", site);
  assert.deepEqual(parts.filter((part) => part.href), [{ text: "Contact page", href: "/contact/" }]);
});

test("keeps paragraphs, bold labels, and lists while making page references clickable", () => {
  const reply = "The platform covers several areas.\n\n- **Standards:** Track clauses.\n- **Audits:** Plan reviews.\n\nRead the Services page (/services/).";
  const markdown = chatReplyMarkdown(reply, site);
  const html = renderToStaticMarkup(createElement(ReactMarkdown, null, markdown));
  assert.match(html, /<p>The platform covers several areas\.<\/p>/);
  assert.match(html, /<ul>\s*<li><strong>Standards:<\/strong> Track clauses\.<\/li>/);
  assert.match(html, /<li><strong>Audits:<\/strong> Plan reviews\.<\/li>\s*<\/ul>/);
  assert.match(html, /<a href="\/services\/">Services page<\/a>/);
  assert.doesNotMatch(html, /\(\/services\/\)/);
});
