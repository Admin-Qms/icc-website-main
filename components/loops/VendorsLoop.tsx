import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Vendors screen: a vendor's insurance certificate is about to expire, the new document is uploaded and shows a new expiry date, an evaluation is saved, and the vendor's qualification status moves from Pending to Approved in the directory.";

/** Vendors: a compliance document renewed, an evaluation saved, a vendor approved. */
export function VendorsLoop() {
  return (
    <LoopFrame active="Vendors" label={LABEL}>
      <div className={s.gap}>
        <div className={s.card}>
          <p className={s.cardTitle}>Vendor directory</p>
          <div className={s.row}>
            <span className={s.astName}>Northline Castings Ltd.</span>
            <span className={`${s.pill} ${s.ok} ${s.astState}`}>Approved</span>
          </div>
          <div className={s.row}>
            <span className={s.astName}>Harbour Fasteners Ltd.</span>
            <span className={`${s.pill} ${s.ok} ${s.astState}`}>Approved</span>
          </div>
          <div className={s.row}>
            <span className={s.astName}>Eastgate Plating Ltd.</span>
            <span className={`${s.stack} ${s.astState}`}>
              <span className={`${s.pill} ${s.warn} ${s.until5}`}>Pending</span>
              <span className={`${s.pill} ${s.ok} ${s.on5}`}>Approved</span>
            </span>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.cardTitle}>Eastgate Plating Ltd. · compliance</p>
          <div className={s.on1}>
            <div className={s.venDoc}>
              <span className={s.astName}>Insurance certificate</span>
              <span className={`${s.stack} ${s.venWhen}`}>
                <span className={`${s.pill} ${s.warn} ${s.until3}`}>Expires in 14 days</span>
                <span className={`${s.pill} ${s.ok} ${s.on3}`}>Valid to Oct 2027</span>
              </span>
            </div>
          </div>
          <div className={s.astChips}>
            <span className={`${s.pill} ${s.info} ${s.on2}`}>New document uploaded</span>
          </div>
        </div>

        <div className={s.venEval}>
          <span className={`${s.chip} ${s.ok} ${s.on4}`}>Evaluation · Score 4.2 / 5 saved</span>
        </div>
      </div>
    </LoopFrame>
  );
}
