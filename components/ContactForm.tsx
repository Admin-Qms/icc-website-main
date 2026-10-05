"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "./Icons";
import { STANDARDS, SITE } from "@/lib/site";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "submitting" | "done" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const configured = Boolean(SITE.forms.web3formsKey);

  // The site is a static export with no server, so the form posts to Web3Forms, which
  // relays it to the inbox the access key was generated for.
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting" || !configured) return;
    setStatus("submitting");

    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const payload = {
      access_key: SITE.forms.web3formsKey,
      subject: `Website enquiry — ${data.standard || "standard not chosen"} — ${data.company}`,
      from_name: `${SITE.name} website`,
      name: data.name,
      email: data.email,
      company: data.company,
      standard: data.standard,
      message: data.message,
      botcheck: data.botcheck,
    };

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as { success?: boolean };
      setStatus(res.ok && result.success ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_-40px_rgba(22,43,77,0.5)] lg:p-9">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100"
            >
              <Check className="h-8 w-8" />
            </motion.span>
            <h3 className="mt-5 font-heading text-2xl font-bold text-navy-900">
              Message received
            </h3>
            <p className="mt-3 max-w-sm text-slate-600">
              A certified consultant will be in touch within one business day. In the
              meantime, the free readiness assessment is a good next step.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* honeypot: Web3Forms discards any submission where this is filled in */}
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" required placeholder="Jordan Smith" />
              <Field label="Work email" name="email" type="email" required placeholder="jordan@company.com" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company" name="company" required placeholder="Acme Industries Ltd." />
              <div>
                <Label>Standard of interest</Label>
                <select
                  name="standard"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a standard
                  </option>
                  {STANDARDS.map((s) => (
                    <option key={s.slug} value={s.code}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
            </div>
            <div>
              <Label>How can we help?</Label>
              <textarea
                name="message"
                rows={4}
                required
                placeholder="Tell us about your operation and what you're certifying for…"
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            {status === "error" && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                The message could not be sent. Please try again, or email{" "}
                <a href={`mailto:${SITE.email}`} className="font-semibold underline">
                  {SITE.email}
                </a>
                .
              </p>
            )}
            {!configured && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Online submissions are being set up. In the meantime, email{" "}
                <a href={`mailto:${SITE.email}`} className="font-semibold underline">
                  {SITE.email}
                </a>{" "}
                and we will get back to you within one business day.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "submitting" || !configured}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : status === "error" ? "Try again" : "Send message"}
              {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
            </button>
            <p className="text-center text-xs text-slate-500">
              We reply within one business day. No spam, ever.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-700">{children}</label>;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
    </div>
  );
}
