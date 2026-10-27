import { AssetsLoop } from "./AssetsLoop";
import { AssistantLoop } from "./AssistantLoop";
import { AuditsLoop } from "./AuditsLoop";
import { DocumentsLoop } from "./DocumentsLoop";
import { ImprovementsLoop } from "./ImprovementsLoop";
import { ProcessesLoop } from "./ProcessesLoop";
import { SafetyLoop } from "./SafetyLoop";
import { StandardsLoop } from "./StandardsLoop";
import { SupplierQualityLoop } from "./SupplierQualityLoop";
import { TrainingLoop } from "./TrainingLoop";
import { VendorsLoop } from "./VendorsLoop";

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
  "nonconformance-capa": ImprovementsLoop,
  safety: SafetyLoop,
  "training-competence": TrainingLoop,
  "supplier-quality": SupplierQualityLoop,
  "calibration-maintenance": AssetsLoop,
  vendors: VendorsLoop,
  "ai-assistant": AssistantLoop,
};
