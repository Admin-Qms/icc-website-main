export { PlatformLoop } from "./PlatformLoop";

/**
 * Module page loops, keyed by `MODULES[].slug` in lib/site.ts. A module with no
 * entry renders its header without a visual.
 */
export const MODULE_LOOPS: Record<string, () => JSX.Element> = {
  // Task 2: standards, document-control, processes, audits
  // Task 3: improvements, safety, training, supplier quality
  // Task 4: assets, vendors, AI Assistant
};
