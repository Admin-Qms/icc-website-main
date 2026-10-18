import Script from "next/script";
import { GA_MEASUREMENT_ID, loadAnalytics } from "@/lib/analytics";
import { SITE } from "@/lib/site";

/**
 * Loads Google Analytics 4 in production builds (see lib/analytics.ts). Data is only
 * sent from the live domain, so local previews and preview deployments are not counted.
 */
export function Analytics() {
  if (!loadAnalytics) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
var host = location.hostname.replace(/^www\\./, '');
if (host === '${SITE.domain}') gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
