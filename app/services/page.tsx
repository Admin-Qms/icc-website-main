import type { Metadata } from "next";
import Link from "next/link";
import {
  PageHeader,
  SectionHeading,
  StandardCard,
  AnyStandardCard,
  CTASection,
} from "@/components/ui";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { ArrowRight } from "@/components/Icons";
import { STANDARDS } from "@/lib/site";

export const metadata: Metadata = {
  title: "ISO Consulting & Certification — Any Standard, One System",
  description:
    "Certification support for ISO 9001, 14001, 45001, IATF 16949, AS9100, ISO 13485 and customer-specific or regulatory standards, for Canadian companies.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Standards & certification"
        title={<>Any standard. <span className="text-teal-700">One system.</span></>}
        intro="The standards below are the ones Canadian companies ask for most, and ten of them sit in the software catalogue. Customer-specific requirements, regulatory frameworks and internal quality standards are imported from a workbook as custom standards, so if you are audited against it, it can be tracked clause by clause."
      >
        <Link href="/assessment" className="btn-primary">
          Which standard do you need? <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/contact" className="btn-ghost">
          Onboard a custom standard
        </Link>
      </PageHeader>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.map((s) => (
              <StaggerItem key={s.slug}>
                <StandardCard s={s} />
              </StaggerItem>
            ))}
            <StaggerItem>
              <AnyStandardCard />
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="bg-soft py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Multi-standard"
            title="Integrate several standards into one system"
            intro="ISO 9001, 14001 and 45001 share the same high-level structure. We build one integrated management system — a single set of processes, one audit program, one source of truth — instead of three parallel binders."
            align="center"
          />
          <Reveal delay={0.1} className="mt-8 text-center">
            <Link href="/process" className="btn-outline">
              See the certification process <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
