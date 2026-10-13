import path from 'node:path';
import { listGuideFiles } from './guide-files';
import type { GuideBundle } from './guide-contract';
import { readGuidePreview } from './guide-preview';

const directory = process.env.GUIDE_CONTENT_DIR || path.join(process.cwd(), 'content', 'guides');
export function getAllGuides(): GuideBundle[] {
  if (process.env.GUIDE_PREVIEW_JOB) return [readGuidePreview({ jobId: process.env.GUIDE_PREVIEW_JOB, draftRoot: process.env.GUIDE_DRAFT_DIR || path.join(process.cwd(), 'team/drafts/guides') }).bundle];
  return listGuideFiles(directory);
}
export function getGuide(slug: string): GuideBundle | undefined { return getAllGuides().find(g => g.manifest.slug === slug); }
export function getGuideChapter(guideSlug: string, chapterSlug: string) { return getGuide(guideSlug)?.chapters.find(c => c.slug === chapterSlug); }
