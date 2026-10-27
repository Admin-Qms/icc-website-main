import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample AI Assistant screen: a user asks for a work instruction for press brake setup drafted from SOP-12, the assistant shows a three-step plan, the user approves it, a draft appears marked as needing review, the Quality manager accepts it, and a note says delete requests need extra confirmation.";

/** AI Assistant: a visible plan the user approves, then a draft a person reviews. */
export function AssistantLoop() {
  return (
    <LoopFrame active="AI Assistant" label={LABEL}>
      <div className={s.gap}>
        <p className={s.aiAsk}>Draft a work instruction for press brake setup from SOP-12</p>

        <div className={s.card}>
          <div className={s.on1}>
            <p className={s.cardTitle}>Plan · 3 steps</p>
            <ol className={s.aiPlan}>
              <li>Open SOP-12</li>
              <li>Draft the work instruction from it</li>
              <li>Save it as a draft for review</li>
            </ol>
          </div>
          <div className={s.aiAct}>
            <span className={`${s.stack}`}>
              <span className={s.on1}>
                <span className={`${s.aiBtn} ${s.until2}`}>Approve plan</span>
              </span>
              <span className={`${s.pill} ${s.ok} ${s.on2}`}>Plan approved</span>
            </span>
          </div>
        </div>

        <div className={`${s.card} ${s.on3}`}>
          <div className={s.aiDraft}>
            <b>WI-104 · Press brake setup</b>
            <span className={`${s.stack} ${s.aiState}`}>
              <span className={`${s.pill} ${s.info} ${s.until4}`}>AI draft · needs review</span>
              <span className={`${s.pill} ${s.ok} ${s.on4}`}>Accepted by Quality manager</span>
            </span>
          </div>
        </div>

        <p className={`${s.aiNote} ${s.on5}`}>Delete requests need extra confirmation</p>
      </div>
    </LoopFrame>
  );
}
