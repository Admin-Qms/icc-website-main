import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sourceToRegex, buildHtaccess } from "../scripts/write-htaccess.mjs";

const matches = (source, path) => new RegExp(sourceToRegex(source)).test(path);

test("literal sources match with and without the trailing slash, and nothing else", () => {
  assert.ok(matches("/cor-consultant-canada/", "/cor-consultant-canada/"));
  assert.ok(matches("/cor-consultant-canada/", "/cor-consultant-canada"));
  assert.ok(
    !matches("/cor-consultant-canada/", "/cor-consultant-canada/extra/"),
  );
  assert.ok(matches("/sitemap-pages.xml", "/sitemap-pages.xml"));
  assert.ok(!matches("/sitemap-pages.xml", "/sitemap-pagesXxml"));
});

test("wildcard sources match the prefix and anything below it", () => {
  assert.ok(matches("/tag/:path*", "/tag/iso-9001/"));
  assert.ok(matches("/tag/:path*", "/tag/iso-9001/feed/"));
  assert.ok(matches("/tag/:path*", "/tag"));
  assert.ok(!matches("/tag/:path*", "/tagged/"));
});

test("unsupported patterns are refused instead of producing a wrong rule", () => {
  assert.throws(() => sourceToRegex("/blog/:slug"));
  assert.throws(() =>
    buildHtaccess([
      { source: "/a/", destination: "/b/:slug", permanent: true },
    ]),
  );
});

test("every vercel.json redirect converts to a 301 RedirectMatch", () => {
  const { redirects } = JSON.parse(
    readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  const out = buildHtaccess(redirects);
  assert.equal(out.match(/RedirectMatch 301 /g).length, redirects.length);
});
