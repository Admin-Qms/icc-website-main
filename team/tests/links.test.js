require("./helpers/env");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const routes = require("../agents/shared/siteRoutes");
const { removeInvalidLinks } = require("../agents/seo/linkBuilder");
const { patchBannedPhrases } = require("../agents/content/rewritePatcher");
const { loadLinkBankUrls, loadContext } = require("../agents/content/contextLoader");

test("siteRoutes knows the real pages and rejects pages that do not exist", () => {
  for (const href of ["/", "/contact", "/process", "/blog", "/services/iso-9001", "/industries/automotive", "/solutions/document-control"]) {
    assert.ok(routes.resolves(href), href);
  }
  assert.ok(routes.resolves("/services/iso-9001/#faq"));
  assert.ok(routes.resolves("https://isocertificationconsultants.ca/contact"));
  for (const href of ["/privacy", "/terms", "/resources", "/services/iso-99999", "/blog/not-a-post"]) {
    assert.ok(!routes.resolves(href), href);
  }
});

test("every link target offered to the writer resolves", () => {
  const targets = routes.getLinkTargets();
  assert.ok(targets.length > 20);
  for (const t of targets) assert.ok(routes.resolves(t.url), t.url);
});

test("removeInvalidLinks drops dead internal links and off-bank external links", () => {
  const bank = new Set(["https://www.iso.org/standard/9001"]);
  const { body, removed } = removeInvalidLinks(
    "[ok](/contact) [dead](/resources) [bank](https://www.iso.org/standard/9001/) [other](https://example.org/x) ![img](/images/blog/a/hero.webp)",
    bank
  );
  assert.equal(body, "[ok](/contact) dead [bank](https://www.iso.org/standard/9001/) other ![img](/images/blog/a/hero.webp)");
  assert.deepEqual(removed, ["/resources", "https://example.org/x"]);
});

test("the link bank loads and the writer is always offered enough sources", async () => {
  assert.ok(loadLinkBankUrls().size >= 40);
  for (const primaryKeyword of ["iso 9001 internal audit checklist", "iatf 16949 control plan requirements", "iso 22000 hazard analysis steps", "iso 17025 measurement uncertainty requirements"]) {
    const context = await loadContext({ primaryKeyword });
    assert.ok(context.externalLinks.length >= 4, `${primaryKeyword}: ${context.externalLinks.length} external links`);
    assert.ok(context.internalLinks.servicePages.some((p) => p.url === "/contact"), "contact is always offered");
    assert.match(context.standardsFacts, /ISO 9001:2026/);
  }
});

test("banned phrases are replaced in prose but never inside a URL", () => {
  const out = patchBannedPhrases("Crucial steps to [navigate](https://example.org/navigate-the-landscape) the landscape.");
  assert.equal(out, "Critical steps to [manage](https://example.org/navigate-the-landscape) the environment.");
});
