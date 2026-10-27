import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Documents screen: work instruction WI-104 moves from Draft to In review, is approved in sequence by the production lead and the quality manager, then is published as a frozen, hash-verified copy while the previous revision is marked Obsolete.";

function Approver({ role, at }: { role: string; at: "on2" | "on3" }) {
  return (
    <div className={s.row}>
      <span className={s.docTick}>
        <span className={s[at]}>
          <span className={s.docDone}>✓</span>
        </span>
      </span>
      <span>{role}</span>
    </div>
  );
}

/** Documents: one revision through the lifecycle, with its approval chain. */
export function DocumentsLoop() {
  return (
    <LoopFrame active="Documents" label={LABEL}>
      <div className={s.gap}>
        <div className={s.card}>
          <div className={s.docRow}>
            <span className={s.docName}>WI-104 Press brake setup · Rev C</span>
            <span className={s.stackEnd}>
              <span className={`${s.pill} ${s.muted} ${s.until1}`}>Draft</span>
              <span className={s.on1}>
                <span className={`${s.pill} ${s.info} ${s.until3}`}>In review</span>
              </span>
              <span className={s.on3}>
                <span className={`${s.pill} ${s.warn} ${s.until4}`}>Approved</span>
              </span>
              <span className={`${s.pill} ${s.ok} ${s.on4}`}>Published</span>
            </span>
          </div>

          <div className={`${s.docChain} ${s.on1}`}>
            <p className={s.cardTitle}>Approvers</p>
            <Approver role="Production lead" at="on2" />
            <Approver role="Quality manager" at="on3" />
          </div>

          <div className={s.docFrozen}>
            <span className={s.on4}>Approved copy frozen · hash-verified</span>
          </div>
        </div>

        <div className={`${s.card} ${s.docOld}`}>
          <div className={s.docRow}>
            <span className={s.docName}>WI-104 Press brake setup · Rev B</span>
            <span className={s.stackEnd}>
              <span className={`${s.pill} ${s.ok} ${s.until4}`}>Published</span>
              <span className={`${s.pill} ${s.muted} ${s.on4}`}>Obsolete</span>
            </span>
          </div>
        </div>
      </div>
    </LoopFrame>
  );
}
