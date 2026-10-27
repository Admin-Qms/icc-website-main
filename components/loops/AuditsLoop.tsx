import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Audits screen for an internal audit of Production against ISO 9001: checklist items are ticked, a photo is attached as evidence, the auditor records a minor finding, and the audit closes with a PDF report ready.";

function Box({ at }: { at?: "on1" | "on2" }) {
  return (
    <span className={s.audBox}>
      {at && <span className={`${s.audTick} ${s[at]}`}>✓</span>}
    </span>
  );
}

/** Audits: checklist, evidence and a finding recorded by the auditor, then the report. */
export function AuditsLoop() {
  return (
    <LoopFrame active="Audits" label={LABEL}>
      <div className={s.card}>
        <p className={s.cardTitle}>Internal audit · Production · ISO 9001</p>

        <div className={s.audRow}>
          <Box at="on1" />
          <span>
            <span className={s.audCode}>8.5.1</span> Control of production and service provision
          </span>
        </div>

        <div className={s.audRow}>
          <Box at="on2" />
          <span>
            <span className={s.audCode}>7.5</span> Documented information
          </span>
        </div>

        <div className={s.audRow}>
          <Box />
          <span>
            <span className={s.audCode}>8.7</span> Control of nonconforming outputs
          </span>
          <span className={s.audExtra}>
            <span className={`${s.audThumb} ${s.on3}`}>Photo</span>
            <span className={`${s.pill} ${s.warn} ${s.on4}`}>
              Finding · Minor · recorded by auditor
            </span>
          </span>
        </div>
      </div>

      <div className={s.audDone}>
        <span className={`${s.chip} ${s.ok} ${s.on5}`}>Audit closed · PDF report ready</span>
      </div>
    </LoopFrame>
  );
}
