import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample Training screen: an on-the-job campaign for press brake setup is run, the quiz is passed with 9 out of 10, the supervisor signs off, and the competency matrix moves Operator B from In training to Competent and a certificate is issued.";

const SKILLS = ["Press brake setup", "Visual inspection", "Gauge use"];

const PEOPLE: [string, (0 | 1 | 2 | 3)[]][] = [
  ["Operator A", [3, 2, 2]],
  ["Operator B", [1, 2, 1]],
  ["Inspector", [0, 3, 3]],
  ["Setter", [3, 1, 2]],
];

function Dots({ n }: { n: number }) {
  return (
    <span className={s.trnDots}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? `${s.trnDot} ${s.trnFull}` : s.trnDot} />
      ))}
    </span>
  );
}

/** Training: an on-the-job campaign completes and the competency matrix updates. */
export function TrainingLoop() {
  return (
    <LoopFrame active="Training" label={LABEL}>
      <div className={s.gap}>
        <div className={s.card}>
          <div className={`${s.trnHead} ${s.on1}`}>
            <b>Press brake setup · on-the-job</b>
            <span className={s.sub}>Campaign · Operator B</span>
          </div>
          <div className={s.trnChips}>
            <span className={`${s.pill} ${s.ok} ${s.on2}`}>Quiz · Pass · 9/10</span>
            <span className={`${s.pill} ${s.ok} ${s.on3}`}>Supervisor sign-off ✓</span>
            <span className={`${s.pill} ${s.info} ${s.on5}`}>Certificate issued</span>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.cardTitle}>Competency matrix</p>
          <div className={s.trnGrid}>
            <span />
            {SKILLS.map((k) => (
              <span key={k} className={s.trnSkill}>
                {k}
              </span>
            ))}
            {PEOPLE.map(([who, lv], r) => [
              <span key={who} className={s.trnWho}>
                {who}
              </span>,
              ...lv.map((n, c) =>
                r === 1 && c === 0 ? (
                  <span key={c} className={`${s.trnCell} ${s.stack}`}>
                    <span className={`${s.pill} ${s.warn} ${s.until4}`}>In training</span>
                    <span className={`${s.pill} ${s.ok} ${s.on4}`}>Competent</span>
                  </span>
                ) : (
                  <span key={c} className={s.trnCell}>
                    <Dots n={n} />
                  </span>
                ),
              ),
            ])}
          </div>
        </div>
      </div>
    </LoopFrame>
  );
}
