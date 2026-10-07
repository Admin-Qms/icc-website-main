import { INDUSTRIES, MODULES, STANDARDS } from "./site.ts";

export const CHAT_LINKABLE_PATHS = [
  "/",
  "/about/",
  "/assessment/",
  "/blog/",
  "/contact/",
  "/custom-solutions/",
  "/industries/",
  "/platform/",
  "/process/",
  "/roi/",
  "/services/",
  "/solutions/",
  ...STANDARDS.map((standard) => `/services/${standard.slug}/`),
  ...INDUSTRIES.map((industry) => `/industries/${industry.slug}/`),
  ...MODULES.map((module) => `/solutions/${module.slug}/`),
];

const linkablePaths = new Set(CHAT_LINKABLE_PATHS);

export function safeSiteHref(raw: string, siteUrl: string): string | null {
  try {
    if ((!raw.startsWith("/") && !raw.startsWith("https://")) || raw.startsWith("//")) {
      return null;
    }
    const parsed = new URL(raw, siteUrl);
    if (
      parsed.protocol !== "https:" ||
      parsed.origin !== new URL(siteUrl).origin ||
      !/^\/(?:[a-z0-9-]+\/)*$/i.test(parsed.pathname) ||
      !linkablePaths.has(parsed.pathname) ||
      parsed.search ||
      parsed.hash
    ) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

export type ChatReplyPart = { text: string; href?: string };

const PAGE_LABELS: Record<string, string> = {
  "/services/": "Services page",
  "/solutions/standards/": "Standards workspace page",
  "/contact/": "Contact page",
  "/solutions/": "Software modules page",
  "/platform/": "Platform page",
  "/process/": "Our process page",
  "/industries/": "Industries page",
  "/assessment/": "Readiness assessment",
  "/roi/": "ROI page",
  "/blog/": "Blog",
};

function pageLabel(path: string): string {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  const last = path.split("/").filter(Boolean).at(-1) || "Home";
  return `${last.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())} page`;
}

export function linkifyChatReply(content: string, siteUrl: string): ChatReplyPart[] {
  const parts: ChatReplyPart[] = [];
  const pattern = /\[([^\]\n]{1,80})\]\((https?:\/\/[^\s)]+|\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)\)|\((\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)\)|(https?:\/\/[^\s)]+|\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)/gi;
  let cursor = 0;

  function addText(text: string) {
    if (!text) return;
    const last = parts.at(-1);
    if (last && !last.href) last.text += text;
    else parts.push({ text });
  }

  for (const match of content.matchAll(pattern)) {
    const index = match.index;
    let between = content.slice(cursor, index);
    const raw = match[2] || match[3] || match[4];
    const trimmed = raw.replace(/[.,;!?]+$/, "");
    const suffix = raw.slice(trimmed.length);
    const absoluteHref = safeSiteHref(trimmed, siteUrl);
    if (!absoluteHref) {
      const label = match[1]
        ? match[1].replace(/[*_`]/g, "").replace(/\s+page$/i, "").trim()
        : match[3] ? "" : "the website";
      const next = content[index + match[0].length] || "";
      addText(
        between +
        (label && /[a-z0-9]$/i.test(between) ? " " : "") +
        label +
        (label && /^[a-z0-9]/i.test(next) ? " " : "")
      );
      cursor = index + match[0].length;
      continue;
    }

    const href = new URL(absoluteHref).pathname;
    const label = match[1]?.trim() || pageLabel(href);
    const beforeLink = between.trimEnd().replace(/:$/, "");
    const repeatedLabelPrefix = label ? beforeLink.slice(0, -label.length) : beforeLink;
    if (
      label &&
      beforeLink.toLowerCase().endsWith(label.toLowerCase()) &&
      (repeatedLabelPrefix === "" || /\s$/.test(repeatedLabelPrefix))
    ) {
      between = repeatedLabelPrefix;
    }
    addText(between);
    parts.push({ text: label, href });
    addText(suffix);
    cursor = index + match[0].length;
  }

  addText(content.slice(cursor));
  return parts;
}

export function chatReplyMarkdown(content: string, siteUrl: string): string {
  return linkifyChatReply(content, siteUrl)
    .map((part) =>
      part.href
        ? `[${part.text.replace(/[\\[\]]/g, "\\$&")}](${part.href})`
        : part.text,
    )
    .join("");
}
