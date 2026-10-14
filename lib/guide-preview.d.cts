import type { GuideBundle } from './guide-contract.cjs';
export type GuidePreview = {jobId: string; directory: string; bundle: GuideBundle};
export function readGuidePreview(options: {jobId: string; draftRoot: string; mode?: string}): GuidePreview;
export function previewImageFile(preview: GuidePreview, url: string): string | null;
