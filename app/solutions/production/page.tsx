import type { Metadata } from "next";
import { RedirectStub } from "@/components/RedirectStub";

const TO = "/solutions/processes/";

export const metadata: Metadata = {
  title: "Production & Process Control has moved",
  description:
    "The Production & Process Control page has moved. Process maps, flowcharts, owners and linked documents now live in the Processes module.",
  alternates: { canonical: TO },
};

export default function ProductionRedirect() {
  return <RedirectStub to={TO} label="Processes" />;
}
