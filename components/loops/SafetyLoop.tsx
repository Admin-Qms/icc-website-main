import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Safety screen: a phone shows a no-login QR code for reporting, a near-miss report is filled in for a guard gap on a press, its severity is set from the level of harm, and the report appears on the separate Safety dashboard with the reporter shown as Anonymous.";

/** Safety: anonymous QR report, harm-based severity, then the separate dashboard. */
export function SafetyLoop() {
  return (
    <LoopFrame active="Safety" label={LABEL}>
      <div className={s.gap}>
        <div className={s.safTop}>
          <div className={`${s.card} ${s.safPhone}`}>
            <p className={s.safScan}>Scan to report · no login</p>
            <span className={s.safQr} />
          </div>

          <div className={s.card}>
            <p className={s.cardTitle}>Near-miss report</p>
            <p className={s.safLabel}>Location</p>
            <p className={s.safField}>
              <span className={s.on1}>Press line 2</span>
            </p>
            <p className={s.safLabel}>What happened</p>
            <p className={s.safField}>
              <span className={s.on1}>Guard gap on the press</span>
            </p>
            <p className={`${s.safSev} ${s.on2}`}>
              <span className={`${s.pill} ${s.ok}`}>Low · no injury</span>
            </p>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.cardTitle}>Safety dashboard</p>
          <div className={`${s.row} ${s.safNew} ${s.on3}`}>
            <span className={`${s.dot} ${s.ok}`} />
            <span className={s.safText}>
              <b>NM-0419</b> Guard gap on the press
            </span>
            <span className={`${s.pill} ${s.ok}`}>Low</span>
            <span className={`${s.pill} ${s.info} ${s.on4}`}>Anonymous</span>
          </div>
          <div className={s.row}>
            <span className={`${s.dot} ${s.warn}`} />
            <span className={s.safText}>
              <b>NM-0412</b> Wet floor at dock
            </span>
            <span className={`${s.pill} ${s.warn}`}>Medium</span>
          </div>
        </div>
      </div>
    </LoopFrame>
  );
}
