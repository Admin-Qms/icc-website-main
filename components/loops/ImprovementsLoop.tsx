import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Improvements screen for nonconformance NC-0217, a burr on a bracket edge: containment is recorded, root cause is worked with 5 Whys, a corrective action gets an owner and a due date, the effectiveness check is verified, and only then is the item closed.";

const STEPS = [
  ["Containment", "on1"],
  ["Root cause", "on2"],
  ["CAPA", "on3"],
  ["Effectiveness", "on4"],
  ["Closed", "on5"],
] as const;

/** Improvements: one nonconformance from containment to a verified, closed CAPA. */
export function ImprovementsLoop() {
  return (
    <LoopFrame active="Improvements" label={LABEL}>
      <div className={s.card}>
        <div className={s.docRow}>
          <span className={s.docName}>NC-0217 · Burr on bracket edge</span>
          <span className={s.stackEnd}>
            <span className={`${s.pill} ${s.warn} ${s.until5}`}>Open</span>
            <span className={`${s.pill} ${s.ok} ${s.on5}`}>Closed</span>
          </span>
        </div>

        <div className={s.impSteps}>
          {STEPS.map(([name, at]) => (
            <span key={name} className={s.impStep}>
              <span className={s.impBase}>{name}</span>
              <span className={`${s.impDone} ${s[at]}`}>{name}</span>
            </span>
          ))}
        </div>

        <div className={s.impBody}>
          <p className={`${s.impLine} ${s.on1}`}>
            <b>Containment</b> · stock on hold · Production lead
          </p>
          <p className={`${s.impLine} ${s.on2}`}>
            <b>5 Whys</b>
          </p>
          <p className={`${s.impWhy} ${s.on2}`}>Why 1 · Burr left after the cut</p>
          <p className={`${s.impWhy} ${s.on2}`}>Why 2 · Cutting tool worn</p>
          <p className={`${s.impWhy} ${s.on2}`}>Why 3 · No tool-change interval</p>
          <p className={`${s.impLine} ${s.on3}`}>
            <b>CAPA</b> · Owner: Quality engineer · Due: 30 Nov
          </p>
          <p className={`${s.impLine} ${s.on4}`}>
            <b>Effectiveness check</b> · <span className={s.impOk}>✓ Verified</span>
          </p>
        </div>
      </div>
    </LoopFrame>
  );
}
