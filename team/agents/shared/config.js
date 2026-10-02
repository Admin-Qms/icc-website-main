const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const TEAM_ROOT = path.resolve(__dirname, "../..");
const SITE_ROOT = path.resolve(TEAM_ROOT, "..");
const MEMORY_DIR = path.join(TEAM_ROOT, "memory");
const REPORTS_DIR = path.join(TEAM_ROOT, "reports");

module.exports = {
  TEAM_ROOT,
  SITE_ROOT,
  MEMORY_DIR,
  REPORTS_DIR,

  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || "",
  CLAUDE_MODEL: "claude-sonnet-4-6",
  CLAUDE_MODEL_FAST: "claude-haiku-4-5-20251001",

  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || "uakgkw7x",
  SANITY_DATASET: process.env.SANITY_DATASET || "production",
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN || "",

  SITE_URL: process.env.SITE_URL || "https://isocertificationconsultant.ca",

  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  REPORT_EMAIL: process.env.REPORT_EMAIL || "info@isocertificationconsultant.ca",

  PEXELS_API_KEY: process.env.PEXELS_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

  LEADFEEDER_API_KEY: process.env.LEADFEEDER_API_KEY || "",
  LEADFEEDER_ID: process.env.LEADFEEDER_ID || "",
  RB2B_PIXEL_ID: process.env.RB2B_PIXEL_ID || "",
  RB2B_WEBHOOK_SECRET: process.env.RB2B_WEBHOOK_SECRET || "",
  SERPAPI_KEY: process.env.SERPAPI_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",

  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || "",
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || "",
  LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN || "",
  LINKEDIN_PERSON_ID: process.env.LINKEDIN_PERSON_ID || "",

  GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || "",

  PAGES: [
    "/",
    "/about",
    "/services",
    "/services/iso-9001",
    "/services/iso-14001",
    "/services/iso-45001",
    "/services/iso-13485",
    "/services/iso-27001",
    "/services/iso-22000",
    "/services/iatf-16949",
    "/services/as9100",
    "/services/iso-22301",
    "/services/iso-17025",
    "/industries",
    "/industries/manufacturing",
    "/industries/construction",
    "/industries/healthcare-medical-devices",
    "/industries/food-beverage",
    "/industries/oil-gas-energy",
    "/industries/mining-natural-resources",
    "/industries/aerospace-defence",
    "/industries/automotive",
    "/process",
    "/blog",
    "/contact",
  ],
};
