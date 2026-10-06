import type { Metadata } from "next";
import { RedirectStub } from "@/components/RedirectStub";

const TO = "/solutions/";

export const metadata: Metadata = {
  title: "Inventory & Traceability has moved",
  description:
    "The Inventory & Traceability page has moved. See the current list of compliance management software modules, from document control to supplier quality.",
  alternates: { canonical: TO },
};

export default function InventoryRedirect() {
  return <RedirectStub to={TO} label="all software modules" />;
}
