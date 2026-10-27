import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Processes screen: a Level-1 map with four lanes, Management, Customer-facing, Core and Support, opens the Production process into a Level-2 flowchart (Plan, Set up, Run, Inspect), showing its owner and its linked documents and clauses.";

const LANES: { name: string; boxes: string[] }[] = [
  { name: "Management", boxes: ["Strategy", "Management review"] },
  { name: "Customer-facing", boxes: ["Quoting", "Order entry", "Delivery"] },
  { name: "Core", boxes: ["Planning", "Production", "Inspection"] },
  { name: "Support", boxes: ["Purchasing", "Maintenance", "Training"] },
];

/** Processes: Level-1 map, a process opened into its Level-2 flowchart, owner and links. */
export function ProcessesLoop() {
  return (
    <LoopFrame active="Processes" label={LABEL}>
      <div className={s.card}>
        <div className={s.swap}>
          <div className={s.until2}>
            {LANES.map((lane) => (
              <div key={lane.name} className={s.procLane}>
                <span className={s.procLabel}>{lane.name}</span>
                <div className={s.procBoxes}>
                  {lane.boxes.map((b) => (
                    <span key={b} className={s.procBox}>
                      {b}
                      {b === "Production" && <i className={`${s.procHi} ${s.on1}`} />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`${s.procFlow} ${s.on2}`}>
            <p className={s.cardTitle}>Production · Level 2</p>
            <div className={s.procNodes}>
              <span className={s.procNode}>Plan</span>
              <span className={`${s.procArrow} ${s.on2}`}>→</span>
              <span className={s.procNode}>Set up</span>
              <span className={`${s.procArrow} ${s.on3}`}>→</span>
              <span className={s.procNode}>Run</span>
              <span className={`${s.procArrow} ${s.on4}`}>→</span>
              <span className={s.procNode}>Inspect</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.procChips}>
        <span className={`${s.chip} ${s.on4}`}>Owner: Production manager</span>
        <span className={`${s.chip} ${s.on5}`}>2 documents · 3 clauses linked</span>
      </div>
    </LoopFrame>
  );
}
