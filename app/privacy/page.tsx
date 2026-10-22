import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import { SITE, ADDRESS_LINE } from "@/lib/site";
import { analyticsEnabled } from "@/lib/analytics";

// Describes what the site actually does with personal information. Keep it in step
// with the code: the contact form (api/contact.ts, sent through Resend), the chat
// assistant (api/chat.ts, answered through Groq, history in localStorage for 30
// minutes), and Google Analytics when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
const UPDATED = "October 15, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ISO Certification Consultants Inc. collects, uses and protects personal information from its website contact form, chat assistant and site visits.",
  alternates: { canonical: "/privacy" },
};

const analyticsSection = analyticsEnabled
  ? `## Website analytics

We use Google Analytics to understand how visitors find and use the site, for example which pages are read and whether an enquiry was sent. Google Analytics sets cookies in your browser and receives information such as the pages you visit, your approximate location, your device and browser type, and the website that referred you. We do not send your name, email address or message to Google Analytics. You can block these cookies in your browser settings or with Google's [opt-out browser add-on](https://tools.google.com/dlpage/gaoptout).`
  : `## Website analytics and cookies

The site does not currently use analytics or advertising cookies. If that changes, this policy will be updated first.`;

const body = `
${SITE.legalName} ("we", "us") provides ISO certification consulting and compliance management software to organizations in Canada and the United States. This policy explains what personal information this website collects, why, and the choices you have. It applies to ${SITE.domain}.

## Information you send us through the contact form

When you submit the contact form, we collect your name, work email address, company name, phone number (optional), the standard you are interested in and your message. We use this information to reply to your enquiry, to scope and quote a project, and to follow up about the work you asked about.

The form is delivered to our inbox by Resend, an email delivery service. We do not sell your information, and we do not add you to a marketing list unless you ask us to.

## The chat assistant

The chat assistant answers questions about our services. Your messages are sent to our server and passed to Groq, an AI service provider, which generates the reply. Please do not enter confidential, personal or sensitive information in the chat.

So that a conversation survives a page reload, the last few exchanges are kept in your own browser's local storage for 30 minutes and then discarded. You can clear them at any time by clearing the chat or your browser's site data. To limit abuse, our server briefly uses your IP address to restrict how many chat requests can be made in a short period.

## The readiness assessment and ROI estimator

The free readiness assessment and the ROI estimator run entirely in your browser. Your answers are not sent to us.

${analyticsSection}

## Information collected automatically

Our hosting provider, Vercel, processes technical information such as your IP address, browser type and the pages requested in order to deliver the site, keep it secure and diagnose errors.

## Where your information is processed

Our service providers, including Vercel, Resend and Groq${analyticsEnabled ? ", and Google" : ""}, may process and store information in the United States and other countries. Information held outside Canada is subject to the laws of those countries, and may be accessed by their courts, law enforcement and national security authorities.

## How long we keep it

We keep enquiries for as long as we need them to respond, to carry out any work that follows, and to keep reasonable business records. We then delete them.

## Your choices and rights

You can ask to see the personal information we hold about you, ask us to correct it, or withdraw your consent to our using it, subject to legal and contractual limits. Send your request to [${SITE.email}](mailto:${SITE.email}). If you are not satisfied with our response, you can contact the [Office of the Privacy Commissioner of Canada](https://www.priv.gc.ca/).

## Changes to this policy

We will update this page when our practices change. The date below shows when it was last revised.

## Contact

- ${SITE.legalName}, ${ADDRESS_LINE}
- Email: [${SITE.email}](mailto:${SITE.email})
- Phone: ${SITE.phone}

*Last updated: ${UPDATED}*
`;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        intro="What this website collects, why we collect it, and the choices you have."
      />
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page max-w-3xl break-words">
          <Markdown>{body}</Markdown>
        </div>
      </section>
    </>
  );
}
