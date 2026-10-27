import { AuditsLoop } from "./AuditsLoop";
import { DocumentsLoop } from "./DocumentsLoop";
import { ProcessesLoop } from "./ProcessesLoop";
import { StandardsLoop } from "./StandardsLoop";

export { PlatformLoop } from "./PlatformLoop";

/**
 * Module page loops, keyed by `MODULES[].slug` in lib/site.ts. A module with no
 * entry renders its header without a visual.
 */
export const MODULE_LOOPS: Record<string, () => JSX.Element> = {
  standards: StandardsLoop,
  "document-control": DocumentsLoop,
  processes: ProcessesLoop,
  "audits-management-review": AuditsLoop,
  // Task 3: improvements, safety, training, supplier quality
  // Task 4: assets, vendors, AI Assistant
};
