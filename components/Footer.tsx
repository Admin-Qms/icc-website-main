import Link from "next/link";
import { ArrowRight, Phone } from "./Icons";
import { Logo } from "./Logo";
import { BbbSeal } from "./BbbSeal";
import { STANDARDS, INDUSTRIES, MODULES, SITE, ADDRESS_LINE } from "@/lib/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="container-page">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 border-b border-white/10 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div className="min-w-0 max-w-sm">
            <Link href="/">
              <Logo variant="light" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              AI-powered compliance management software that keeps quality,
              compliance, people, suppliers and operations audit-ready every
              day, with certified consultants when you want them.
            </p>
            <a
              href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
              className="mt-6 inline-flex items-center gap-2 font-heading text-lg font-bold text-white hover:text-teal-300"
            >
              <Phone className="h-5 w-5 text-teal-400" />
              {SITE.phone}
            </a>
            <p className="mt-2 text-sm text-slate-400">
              <a
                href={`mailto:${SITE.email}`}
                className="break-all hover:text-teal-300"
              >
                {SITE.email}
              </a>
            </p>
            <address className="mt-2 text-sm not-italic text-slate-400">
              {ADDRESS_LINE}
            </address>
            <BbbSeal className="mt-6" />
          </div>

          <FooterCol title="Software modules">
            {MODULES.slice(0, 6).map((m) => (
              <FooterLink key={m.slug} href={`/solutions/${m.slug}`}>
                {m.name}
              </FooterLink>
            ))}
            <FooterLink href="/solutions">All software modules →</FooterLink>
          </FooterCol>

          <FooterCol title="Standards">
            {STANDARDS.slice(0, 5).map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.code}
              </FooterLink>
            ))}
            <FooterLink href="/services">Any standard →</FooterLink>
          </FooterCol>

          <FooterCol title="Industries">
            {INDUSTRIES.slice(0, 6).map((i) => (
              <FooterLink key={i.slug} href={`/industries/${i.slug}`}>
                {i.name}
              </FooterLink>
            ))}
            <FooterLink href="/industries">All industries →</FooterLink>
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink href="/roi">ROI estimator</FooterLink>
            <FooterLink href="/custom-solutions">
              Custom-built solutions
            </FooterLink>
            <FooterLink href="/process">How it works</FooterLink>
            <FooterLink href="/assessment">Free assessment</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/guides">Software guides</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterCol>
        </div>

        <div className="flex flex-col gap-4 py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}. Serving companies across Canada &amp; the
            USA.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <span>{SITE.region}</span>
          </div>
        </div>
      </div>

      {/* bottom CTA line */}
      <div className="border-t border-white/10 bg-navy-950">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-sm sm:flex-row">
          <p className="text-slate-300">Ready to find out where you stand?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 font-semibold text-teal-300 hover:text-teal-200"
          >
            Book a demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-400 transition-colors hover:text-teal-300"
      >
        {children}
      </Link>
    </li>
  );
}
