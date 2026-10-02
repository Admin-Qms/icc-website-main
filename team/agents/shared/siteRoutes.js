// The site's real URLs, derived from the app/ tree and lib/site.ts, so the
// pipeline only ever links to pages that exist.

const fs = require("fs");
const path = require("path");
const { SITE_ROOT, SITE_URL } = require("./config");
const { listPosts } = require("./contentStore");

const APP_DIR = path.join(SITE_ROOT, "app");
const SITE_DATA = path.join(SITE_ROOT, "lib", "site.ts");

// Dynamic route folder -> the lib/site.ts array whose slugs fill it.
const DYNAMIC_SOURCES = {
  "/services": "STANDARDS",
  "/industries": "INDUSTRIES",
  "/solutions": "MODULES",
};

/** Static routes: every folder under app/ with a page file and no [param] segment. */
function staticRoutes(dir = APP_DIR, prefix = "") {
  const routes = [];
  if (!fs.existsSync(dir)) return routes;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && /^page\.(tsx|jsx|ts|js)$/.test(entry.name)) routes.push(prefix || "/");
    if (!entry.isDirectory()) continue;
    if (/^[\[_@(]/.test(entry.name) || entry.name === "api") continue;
    routes.push(...staticRoutes(path.join(dir, entry.name), `${prefix}/${entry.name}`));
  }
  return routes;
}

/**
 * Entries of one `export const NAME = [ {...}, ... ]` array in lib/site.ts.
 * The file is TypeScript data, so this reads the quoted fields with a regex
 * rather than executing it; only flat string fields are returned.
 */
function readSiteArray(name) {
  if (!fs.existsSync(SITE_DATA)) return [];
  const source = fs.readFileSync(SITE_DATA, "utf-8");
  const start = source.search(new RegExp(`export const ${name}\\b`));
  if (start === -1) return [];
  const rest = source.slice(start);
  const next = rest.slice(1).search(/\nexport (const|type|function) /);
  const block = next === -1 ? rest : rest.slice(0, next + 1);

  const entries = [];
  for (const chunk of block.split(/\n {2}\{\n/).slice(1)) {
    const field = (key) => new RegExp(`\\n\\s{4}${key}:\\s*\\n?\\s*"([^"]+)"`).exec(`\n${chunk}`)?.[1];
    const slug = field("slug");
    if (slug) entries.push({ slug, code: field("code"), name: field("name"), keyword: field("keyword") });
  }
  return entries;
}

let cachedRoutes = null;

function getRoutes({ refresh = false } = {}) {
  if (cachedRoutes && !refresh) return cachedRoutes;
  const routes = new Set(staticRoutes());
  for (const [base, arrayName] of Object.entries(DYNAMIC_SOURCES)) {
    for (const entry of readSiteArray(arrayName)) routes.add(`${base}/${entry.slug}`);
  }
  for (const post of listPosts()) routes.add(`/blog/${post.slug}`);
  cachedRoutes = routes;
  return routes;
}

/** "/services/iso-9001/#faq" and "https://<site>/services/iso-9001" -> "/services/iso-9001" */
function toRoute(href) {
  let route = String(href || "").trim();
  const origin = (SITE_URL || "").replace(/\/+$/, "");
  if (origin && route.toLowerCase().startsWith(origin.toLowerCase())) route = route.slice(origin.length);
  route = route.replace(/[#?].*$/, "").replace(/\/+$/, "");
  return route || "/";
}

function resolves(href, routes = getRoutes()) {
  return routes.has(toRoute(href));
}

/** Pages a writer may link to, with titles, most specific first. */
function getLinkTargets() {
  const routes = getRoutes();
  const has = (route) => routes.has(route);
  const targets = [];

  for (const s of readSiteArray("STANDARDS")) {
    targets.push({ title: `${s.code} ${s.name}`.trim(), url: `/services/${s.slug}`, kind: "standard", match: s.code || s.slug });
  }
  for (const i of readSiteArray("INDUSTRIES")) {
    targets.push({ title: `${i.name} industry`, url: `/industries/${i.slug}`, kind: "industry", match: i.name || i.slug });
  }
  for (const m of readSiteArray("MODULES")) {
    targets.push({ title: `${m.name} module`, url: `/solutions/${m.slug}`, kind: "module", match: m.name || m.slug });
  }

  const general = [
    { title: "All ISO standards", url: "/services" },
    { title: "The six-stage certification process", url: "/process" },
    { title: "Free ISO readiness assessment", url: "/assessment" },
    { title: "QMS platform overview", url: "/platform" },
    { title: "ROI estimator", url: "/roi" },
    { title: "Book a consultation", url: "/contact" },
  ].map((t) => ({ ...t, kind: "general" }));

  return [...targets, ...general].filter((t) => has(t.url));
}

module.exports = { getRoutes, resolves, toRoute, getLinkTargets, readSiteArray };
