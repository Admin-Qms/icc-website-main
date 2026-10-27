import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { DEMO_BOX_IMAGE, demoBoxHeading } from "@/lib/demo-box";

export function SoftwareDemoBox({ category }: { category?: string }) {
  return (
    <aside
      aria-labelledby="software-demo-box-heading"
      className="mt-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className={DEMO_BOX_IMAGE ? "grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_200px]" : undefined}>
        <div>
          <h2 id="software-demo-box-heading" className="font-heading text-xl font-bold text-slate-900">
            {demoBoxHeading(category)} Stop managing compliance. Start automating it.
          </h2>
          <p className="mt-3 text-slate-600">
            Documents, audits, training, suppliers and corrective actions in one place. AI does the paperwork; your team
            signs off.
          </p>
          <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link href="/contact/" className="btn-primary">
              Book a demo
            </Link>
            <Link href="/assessment/" className="link-arrow">
              Take the free assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {DEMO_BOX_IMAGE && (
          <Image
            src={DEMO_BOX_IMAGE.src}
            alt={DEMO_BOX_IMAGE.alt}
            width={600}
            height={600}
            className="h-auto w-full max-w-[220px] rounded-lg"
          />
        )}
      </div>
    </aside>
  );
}
