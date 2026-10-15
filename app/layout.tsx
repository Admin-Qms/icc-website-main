import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { Analytics } from "@/components/Analytics";
import { PEOPLE, personId, personPath } from "@/lib/people";
import { SITE, OG_IMAGE } from "@/lib/site";
import { serializeJsonLd } from "@/lib/blog";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} in Canada | ISO 9001, IATF 16949`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "ISO certification consulting for Canadian companies, with compliance management software configured to your processes and mapped to any standard.",
  keywords: [
    "compliance management software",
    "ISO management systems",
    "ISO certification consultant Canada",
    "document control software",
    "compliance management system software",
    "any ISO standard onboarding",
    "IATF 16949",
    "ISO consulting Ontario",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE.url,
    siteName: SITE.name,
    title:
      "ISO Certification Consulting for Canadian Companies — Any Standard, One System",
    description:
      "Certified consultants plus compliance management software: eleven modules configured around your business and mapped to any standard you certify against.",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  image: `${SITE.url}${SITE.logo}`,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  sameAs: [SITE.bbb.profileUrl, ...SITE.profiles],
  employee: PEOPLE.map((p) => ({
    "@type": "Person",
    "@id": personId(p),
    name: p.name,
    jobTitle: p.jobTitle,
    url: `${SITE.url}${personPath(p)}`,
  })),
  description:
    "ISO certification consulting for Canadian companies, with compliance management software configured to your processes and ready to onboard any standard.",
  areaServed: [
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: [
    "ISO management systems",
    "Document control",
    "Internal audits",
    "Training and competence",
    "Supplier quality (APQP, PPAP, SCAR)",
    "Corrective and preventive action (CAPA)",
    "Supplier quality management",
    "ISO 9001",
    "IATF 16949",
    "AS9100",
    "ISO 13485",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="bg-white text-slate-700 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgJsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
