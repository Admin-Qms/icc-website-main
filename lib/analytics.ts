// Google Analytics 4.
//
// The measurement ID is public (it appears in every page's HTML), so the site's own ID
// is kept here and every build, on Vercel or for the cPanel backup, includes analytics.
// NEXT_PUBLIC_GA_MEASUREMENT_ID overrides it at build time; set it to "off" to build
// without analytics. With no valid ID, no script loads, nothing is tracked, and the
// privacy page says so.

const SITE_GA_MEASUREMENT_ID = "G-PF6WGBM02W";

const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || SITE_GA_MEASUREMENT_ID;

/** The GA4 measurement ID, or "" when analytics is off. */
export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]{4,}$/.test(raw.trim())
  ? raw.trim()
  : "";

export const analyticsEnabled = GA_MEASUREMENT_ID !== "";

type Gtag = (
  command: "event",
  name: string,
  params?: Record<string, unknown>,
) => void;

/**
 * Records a successful enquiry as GA4's recommended `generate_lead` event, which can be
 * marked as a key event in GA4. Does nothing when analytics is off.
 */
export function trackLead(source: string) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", "generate_lead", { lead_source: source });
}
