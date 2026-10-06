import Link from "next/link";

/**
 * Static-export redirect for a retired URL. next.config redirects do not apply
 * to `output: "export"`, so the page itself carries a 0-second meta refresh and
 * a visible fallback link. The page module sets the canonical to the target.
 */
export function RedirectStub({ to, label }: { to: string; label: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <section className="container-page py-32 text-center">
        <h1 className="font-heading text-2xl font-bold text-navy-900">This page has moved</h1>
        <p className="mt-3 text-slate-600">
          If you are not redirected automatically, continue to{" "}
          <Link href={to} className="font-semibold text-teal-700 hover:text-teal-800">
            {label}
          </Link>
          .
        </p>
      </section>
    </>
  );
}
