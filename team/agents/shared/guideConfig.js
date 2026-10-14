const path = require('node:path');
const SITE_ROOT = path.resolve(__dirname, '../../..');
module.exports = Object.freeze({
  SITE_ROOT, TIMEZONE: 'America/Toronto',
  CONTENT_DIR: process.env.GUIDE_CONTENT_DIR || path.join(SITE_ROOT, 'content/guides'),
  IMAGE_DIR: process.env.GUIDE_IMAGE_DIR || path.join(SITE_ROOT, 'public/images/guides'),
  DRAFT_DIR: process.env.GUIDE_DRAFT_DIR || path.join(SITE_ROOT, 'team/drafts/guides'),
  REPORT_DIR: process.env.GUIDE_REPORT_DIR || path.join(SITE_ROOT, 'team/reports/guides'),
  QUEUE_PATH: process.env.GUIDE_QUEUE_PATH || path.join(SITE_ROOT, 'team/memory/guide-topic-queue.json'),
  CAPABILITY_PATH: process.env.GUIDE_CAPABILITY_PATH || path.join(SITE_ROOT, 'team/data/software-capabilities.json'),
  LINK_BANK_PATH: path.join(SITE_ROOT, 'team/data/external-link-bank.json'),
});
