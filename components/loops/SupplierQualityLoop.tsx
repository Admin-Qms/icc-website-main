import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Supplier Quality screen: SCAR-031 for porosity on a housing is sent to Northline Castings Ltd., the supplier answers in a portal that shows only their own tasks, the response is received on the record, the supplier scorecard updates, and the PFMEA, Process Flow and Control Plan stay linked.";

/** Supplier Quality: a SCAR answered in the supplier portal, then the scorecard. */
export function SupplierQualityLoop() {
  return (
    <LoopFrame active="Supplier Quality" label={LABEL}>
      <div className={s.gap}>
        <div className={s.supTop}>
          <div className={s.card}>
            <span className={s.docName}>SCAR-031</span>
            <p className={s.supStatus}>
              <span className={s.stack}>
                <span className={`${s.pill} ${s.info} ${s.until3}`}>Sent</span>
                <span className={`${s.pill} ${s.ok} ${s.on3}`}>Response received</span>
              </span>
            </p>
            <p className={s.supLine}>Porosity on housing</p>
            <p className={s.sub}>Sent to Northline Castings Ltd.</p>
          </div>

          <div className={`${s.card} ${s.supPortal}`}>
            <p className={s.cardTitle}>Supplier portal · your tasks only</p>
            <p className={`${s.supLine} ${s.on1}`}>
              <b>SCAR-031</b> · respond
            </p>
            <div className={s.supChips}>
              <span className={`${s.pill} ${s.ok} ${s.on2}`}>Containment ✓</span>
              <span className={`${s.pill} ${s.ok} ${s.on2}`}>Root cause ✓</span>
            </div>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.cardTitle}>Scorecard · Northline Castings Ltd.</p>
          <div className={s.supMarks}>
            <span className={s.supMark}>
              Delivery{" "}
              <span className={s.stack}>
                <b className={s.until4}>96%</b>
                <b className={`${s.supNew} ${s.on4}`}>94%</b>
              </span>
            </span>
            <span className={s.supMark}>
              Quality{" "}
              <span className={s.stack}>
                <b className={s.until4}>97%</b>
                <b className={`${s.supNew} ${s.on4}`}>93%</b>
              </span>
            </span>
          </div>
        </div>

        <div className={s.supLinked}>
          <span className={`${s.chip} ${s.ok} ${s.on5}`}>
            PFMEA · Process Flow · Control Plan linked
          </span>
        </div>
      </div>
    </LoopFrame>
  );
}
