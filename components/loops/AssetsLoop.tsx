import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Assets screen: Caliper C-17 is due for calibration, the calibration is recorded and the certificate attached, the next due date is set and the equipment turns in date, the inspection checklist carries e-signatures for performed and reviewed, and a QR label opens the record on the shop floor.";

/** Assets: a calibration recorded against an instrument, then a signed inspection. */
export function AssetsLoop() {
  return (
    <LoopFrame active="Assets" label={LABEL}>
      <div className={s.gap}>
        <div className={s.card}>
          <p className={s.cardTitle}>Equipment register</p>
          <div className={s.row}>
            <span className={s.astName}>Caliper C-17</span>
            <span className={`${s.stack} ${s.astState}`}>
              <span className={`${s.pill} ${s.warn} ${s.until3}`}>Due Fri</span>
              <span className={`${s.pill} ${s.ok} ${s.on3}`}>In date</span>
            </span>
          </div>
          <div className={s.row}>
            <span className={s.astName}>Torque wrench TW-04</span>
            <span className={`${s.pill} ${s.ok} ${s.astState}`}>In date</span>
          </div>
          <div className={s.row}>
            <span className={s.astName}>Gauge pin set GP-2</span>
            <span className={`${s.pill} ${s.ok} ${s.astState}`}>In date</span>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.cardTitle}>Caliper C-17 · calibration</p>
          <div className={s.astChips}>
            <span className={`${s.pill} ${s.ok} ${s.on1}`}>Calibration recorded</span>
            <span className={`${s.pill} ${s.info} ${s.on2}`}>Certificate attached</span>
            <span className={`${s.pill} ${s.ok} ${s.on3}`}>Next due date set</span>
          </div>
        </div>

        <div className={s.astBottom}>
          <div className={s.card}>
            <p className={s.cardTitle}>Inspection checklist</p>
            <p className={`${s.astSign} ${s.on4}`}>Performed ✓ · Reviewed ✓</p>
          </div>
          <div className={s.astQr}>
            <span className={`${s.chip} ${s.info} ${s.on5}`}>QR label · PIN access</span>
          </div>
        </div>
      </div>
    </LoopFrame>
  );
}
