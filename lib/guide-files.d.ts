import type { GuideBundle } from './guide-contract';
export function readInside(root: string, relative: string): string;
export function readGuideFiles(directory: string, options?: {validate?: boolean; phase?: 'draft' | 'published'}): GuideBundle;
export function listGuideFiles(root: string): GuideBundle[];
