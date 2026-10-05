import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";
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
    default: `${SITE.name} — ISO Certification Consulting for Canadian Companies`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "ISO certification consulting for Canadian companies, with a configurable management system platform customized to your processes and ready to onboard any standard, from ISO 9001 and IATF 16949 to customer-specific frameworks.",
  keywords: [
    "customized QMS platform",
    "ISO management systems",
    "ISO certification consultant Canada",
    "inspection software",
    "training and competence QMS",
    "any ISO standard onboarding",
    "IATF 16949",
    "ISO consulting Ontario",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE.url,
    siteName: SITE.name,
    title: "ISO Certification Consulting for Canadian Companies — Any Standard, One System",
    description:
      "Configurable QMS process modules — inspection, inventory, training, production — built around your business and mapped to any standard you certify against.",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  email: SITE.email,
  description:
    "ISO certification consulting for Canadian companies — a configurable management system platform customized to your processes and ready to onboard any standard.",
  areaServed: [
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: [
    "ISO management systems",
    "Inspection and quality control",
    "Inventory and traceability",
    "Training and competence",
    "Production process control",
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
      </body>
    </html>
  );
}
