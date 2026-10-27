export const TABS = ["Home", "Standards", "Documents", "Audits", "Improvements", "Training"];

/** Home first, then the active tab, so the active tab stays visible on narrow screens. */
export function orderTabs(active: string): string[] {
  return [...new Set(["Home", active, ...TABS])];
}
