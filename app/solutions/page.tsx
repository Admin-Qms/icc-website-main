import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHeading, ModuleCard, CTASection } from "@/components/ui";
import { AnimatedTitle, HeaderIconsFX } from "@/components/HeaderFX";
import { ROIPanel } from "@/components/ROIPanel";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { ArrowRight } from "@/components/Icons";
import { MODULES, CUSTOMIZATION, ROI_PLATFORM } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compliance Management Software Modules — Standards, Documents, Audits & More",
  description:
    "Eleven compliance management software modules: standards, documents, processes, audits, improvements, safety, training, assets, vendors and supplier quality.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Software modules"
        title={<AnimatedTitle text="Eleven modules, one compliance management system" accent="one compliance management system" />}
        intro="These are the modules as they appear in the compliance management software: Standards, Documents, Processes, Audits, Improvements, Safety, Training, Supplier Quality, Assets, Vendors and the AI Assistant. A certified consultant configures each one to your workflow."
        fx={<HeaderIconsFX icons={["assessment", "document", "audit", "capa", "training", "supplier"]} />}
      >
        <Link href="/contact" className="btn-primary">
          Scope your configuration <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/assessment" className="btn-outline">
          Free readiness check
        </Link>
      </PageHeader>

      {/* modules */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <StaggerItem key={m.slug}>
                <ModuleCard m={m} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ROI — the software, for businesses without a large quality department */}
      <section className="bg-soft py-16 lg:py-20">
        <div className="container-page">
          <ROIPanel data={ROI_PLATFORM} showEstimatorLink />
        </div>
      </section>

      {/* configuration process */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="How configuration works"
            title="From your process to a configured, audit-ready system"
            align="center"
          />
          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent lg:block" />
            <Stagger className="grid gap-6 lg:grid-cols-4">
              {CUSTOMIZATION.map((c) => (
                <StaggerItem key={c.n}>
                  <div className="card relative h-full p-6 text-center">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-50 font-heading font-bold text-teal-700 ring-1 ring-teal-100">
                      {c.n.replace("0", "")}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-bold text-navy-900">{c.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{c.detail}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal delay={0.1} className="mt-12 text-center">
            <p className="text-slate-600">
              Facing a challenge the standard modules don&apos;t cover?
            </p>
            <Link href="/custom-solutions" className="btn-navy mt-4">
              Explore custom-built solutions <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection title="Configure a compliance management system around your processes" />
    </>
  );
}
