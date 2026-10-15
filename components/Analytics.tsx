import Script from "next/script";
import { GA_MEASUREMENT_ID, analyticsEnabled } from "@/lib/analytics";

/** Loads Google Analytics 4 when a measurement ID is configured (see lib/analytics.ts). */
export function Analytics() {
  if (!analyticsEnabled) return null;
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
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
