export function GuideDraftBanner() {
  return process.env.GUIDE_PREVIEW_JOB ? <div role="status" className="border-b border-amber-200 bg-amber-50 px-5 pt-28 pb-4 text-center text-sm font-semibold text-amber-900">Draft guide preview · Not published</div> : null;
}
