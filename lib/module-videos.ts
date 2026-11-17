export type ModuleVideo = {
  src: string;
  poster: string;
  captions: string;
  durationSeconds: number;
  illustrative?: boolean;
};

// Latest approved ICC module videos. Assets is intentionally excluded.
export const MODULE_VIDEOS: Readonly<Record<string, ModuleVideo>> = {
  "standards": {
    src: "/videos/modules/standards.mp4",
    poster: "/videos/modules/standards.webp",
    captions: "/videos/modules/standards.vtt",
    durationSeconds: 53.0,
  },
  "document-control": {
    src: "/videos/modules/document-control.mp4",
    poster: "/videos/modules/document-control.webp",
    captions: "/videos/modules/document-control.vtt",
    durationSeconds: 37.4,
  },
  "processes": {
    src: "/videos/modules/processes.mp4",
    poster: "/videos/modules/processes.webp",
    captions: "/videos/modules/processes.vtt",
    durationSeconds: 39.0,
  },
  "audits-management-review": {
    src: "/videos/modules/audits-management-review.mp4",
    poster: "/videos/modules/audits-management-review.webp",
    captions: "/videos/modules/audits-management-review.vtt",
    durationSeconds: 39.1,
  },
  "nonconformance-capa": {
    src: "/videos/modules/nonconformance-capa.mp4",
    poster: "/videos/modules/nonconformance-capa.webp",
    captions: "/videos/modules/nonconformance-capa.vtt",
    durationSeconds: 48.73,
  },
  "safety": {
    src: "/videos/modules/safety.mp4",
    poster: "/videos/modules/safety.webp",
    captions: "/videos/modules/safety.vtt",
    durationSeconds: 40.8,
  },
  "training-competence": {
    src: "/videos/modules/training-competence.mp4",
    poster: "/videos/modules/training-competence.webp",
    captions: "/videos/modules/training-competence.vtt",
    durationSeconds: 40.0,
  },
  "supplier-quality": {
    src: "/videos/modules/supplier-quality.mp4",
    poster: "/videos/modules/supplier-quality.webp",
    captions: "/videos/modules/supplier-quality.vtt",
    durationSeconds: 41.7,
  },
  "vendors": {
    src: "/videos/modules/vendors.mp4",
    poster: "/videos/modules/vendors.webp",
    captions: "/videos/modules/vendors.vtt",
    durationSeconds: 39.73,
  },
  "ai-assistant": {
    src: "/videos/modules/ai-assistant.mp4",
    poster: "/videos/modules/ai-assistant.webp",
    captions: "/videos/modules/ai-assistant.vtt",
    durationSeconds: 46.4,
    illustrative: true,
  },
};
