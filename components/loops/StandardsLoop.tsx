import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Standards screen for ISO 9001: an evidence record and a certificate are linked to clause 7.1.5, which moves from No evidence to Partial to Compliant, clause coverage rises from 86 to 92 percent against a 95 percent target, and the statement of applicability export is ready.";

const COVERAGE = { "--from": "0.86", "--to": "0.92" } as React.CSSProperties;

/** Standards: clause list, evidence linking and coverage against a target. */
export function StandardsLoop() {
  return (
    <LoopFrame active="Standards" label={LABEL}>
      <div className={s.gap}>
        <div className={s.card}>
          <div className={s.head}>
            <span>ISO 9001 clause coverage</span>
            <span className={`${s.big} font-heading`}>
              <span className={s.stack}>
                <span className={s.until3}>86%</span>
                <span className={s.on3}>92%</span>
              </span>
            </span>
          </div>
          <div className={`${s.meter} ${s.stdMeter}`}>
            <span className={s.fill} style={COVERAGE} />
            <span className={s.stdTarget} />
          </div>
          <div className={s.meta}>
            <span>Target 95%</span>
            <span>Clauses 4–10</span>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.stdRow}>
            <span className={s.stdCode}>7.1.5</span>
            <span>Monitoring and measuring resources</span>
            <span className={s.stackEnd}>
              <span className={`${s.pill} ${s.muted} ${s.until1}`}>No evidence</span>
              <span className={s.on1}>
                <span className={`${s.pill} ${s.warn} ${s.until2}`}>Partial</span>
              </span>
              <span className={`${s.pill} ${s.ok} ${s.on2}`}>Compliant</span>
            </span>
            <span className={s.stdEvid}>
              <span className={`${s.chip} ${s.on1}`}>Calibration register</span>
              <span className={`${s.chip} ${s.on2}`}>C-17 certificate</span>
            </span>
          </div>
          <div className={s.stdRow}>
            <span className={s.stdCode}>7.5</span>
            <span>Documented information</span>
            <span className={`${s.pill} ${s.ok}`}>Compliant</span>
          </div>
          <div className={s.stdRow}>
            <span className={s.stdCode}>9.3</span>
            <span>Management review</span>
            <span className={`${s.pill} ${s.warn}`}>Review overdue</span>
          </div>
        </div>

        <div>
          <span className={`${s.stdExport} ${s.pulse}`}>Statement of applicability (.xlsx)</span>
        </div>
      </div>
    </LoopFrame>
  );
}
