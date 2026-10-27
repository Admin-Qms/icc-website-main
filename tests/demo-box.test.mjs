import assert from "node:assert/strict";
import test from "node:test";
import { demoBoxHeading } from "../lib/demo-box.ts";

const GENERIC = "Meeting your compliance requirements?";

test("names the standard when the category is a standard code", () => {
  assert.equal(demoBoxHeading("ISO 9001"), "Meeting ISO 9001?");
  assert.equal(demoBoxHeading(" iso 9001 "), "Meeting ISO 9001?");
  assert.equal(demoBoxHeading("IATF 16949"), "Meeting IATF 16949?");
});

test("falls back to the generic heading", () => {
  for (const c of ["Auditing", "ISO Certification", "", undefined]) {
    assert.equal(demoBoxHeading(c), GENERIC);
  }
});
