const https = require("https");
const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN } = require("./config");

const API_VERSION = "2024-01-01";
const BASE = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${API_VERSION}`;
const QUERY_URL = `${BASE}/data/query/${SANITY_DATASET}`;
const MUTATE_URL = `${BASE}/data/mutate/${SANITY_DATASET}`;

function headers() {
  return {
    Authorization: `Bearer ${SANITY_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: options.method || "GET",
        headers: options.headers || {},
        timeout: 120000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function sanityQuery(groq, params = {}) {
  const qs = new URLSearchParams({ query: groq, ...params });
  const url = `${QUERY_URL}?${qs}`;
  const res = await fetchJSON(url, { headers: headers() });
  if (res.status !== 200) throw new Error(`Sanity query failed: ${res.status}`);
  return res.body.result;
}

async function sanityMutate(mutations) {
  const res = await fetchJSON(MUTATE_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ mutations }),
  });
  return res;
}

async function fetchAllSanity(docType) {
  return sanityQuery(`*[_type == "${docType}"]{ _id, title, slug, metaDescription, excerpt }`);
}

async function countDocuments() {
  const posts = await sanityQuery('count(*[_type == "blogPost"])');
  const services = await sanityQuery('count(*[_type == "servicePage"])');
  return { blogPosts: posts, servicePages: services };
}

module.exports = { sanityQuery, sanityMutate, fetchAllSanity, countDocuments };
