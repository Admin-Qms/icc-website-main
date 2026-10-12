import path from 'node:path';
import { listGuideFiles } from './guide-files';
import type { GuideBundle } from './guide-contract';

const directory = process.env.GUIDE_CONTENT_DIR || path.join(process.cwd(), 'content', 'guides');
export function getAllGuides(): GuideBundle[] { return listGuideFiles(directory); }
export function getGuide(slug: string): GuideBundle | undefined { return getAllGuides().find(g => g.manifest.slug === slug); }
export function getGuideChapter(guideSlug: string, chapterSlug: string) { return getGuide(guideSlug)?.chapters.find(c => c.slug === chapterSlug); }
