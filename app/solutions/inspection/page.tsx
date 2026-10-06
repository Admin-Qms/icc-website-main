import type { Metadata } from "next";
import { RedirectStub } from "@/components/RedirectStub";

const TO = "/solutions/calibration-maintenance/";

export const metadata: Metadata = {
  title: "Inspection & Quality Control has moved",
  description:
    "The Inspection & Quality Control page has moved. Inspection checklists, programmes and e-signed records now live in the Assets module.",
  alternates: { canonical: TO },
};

export default function InspectionRedirect() {
  return <RedirectStub to={TO} label="Assets" />;
}
