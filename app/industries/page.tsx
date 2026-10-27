import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, IndustryCard, CTASection } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { ArrowRight } from "@/components/Icons";
import { INDUSTRIES } from "@/lib/site";
import { pageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("ISO Certification by Industry"),
  description:
    "ISO certification consultants by industry across Canada, plus compliance management software for automotive, aerospace, food safety, medical devices and more.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="By industry"
        title={<>Depth where <span className="text-teal-700">it counts</span></>}
        intro="Generic quality advice does not survive an automotive PPAP submission or an aerospace configuration audit. Pick your sector to see the compliance pressures and the software that answers them."
      >
        <Link href="/contact" className="btn-primary">
          Book a demo <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <StaggerItem key={i.slug}>
                <IndustryCard i={i} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection />
    </>
  );
}
