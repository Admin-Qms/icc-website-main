import { LoopFrame } from "./LoopFrame";
import s from "./loops.module.css";

const LABEL =
  "Sample dashboard: ISO 9001 clause coverage rises from 72 to 94 percent, due items appear, a corrective action moves from Open to Verified after its effectiveness check, and a daily summary notification arrives.";

const COVERAGE = { "--from": "0.72", "--to": "0.94" } as React.CSSProperties;

function Task({ done }: { done?: boolean }) {
  return (
    <div className={s.task}>
      <b>CAPA-0142</b>
      <div>Burr on bracket edge</div>
      <div className={s.sub}>Owner: Quality engineer</div>
      {done && <span className={`${s.pill} ${s.ok}`}>Effectiveness checked</span>}
    </div>
  );
}

/** Platform overview: the Home dashboard over one 12 s cycle. */
export function PlatformLoop() {
  return (
    <LoopFrame active="Home" label={LABEL}>
      <div className={s.dash}>
        <div className={s.card}>
          <p className={s.cardTitle}>ISO 9001 clause coverage</p>
          <div className={`${s.big} font-heading`}>
            <span className={s.stack}>
              <span className={s.until3}>72%</span>
              <span className={s.on3}>
                <span className={s.until4}>88%</span>
              </span>
              <span className={s.on4}>94%</span>
            </span>
          </div>
          <div className={s.meter}>
            <span className={s.fill} style={COVERAGE} />
          </div>
          <div className={s.meta}>
            <span>Target 95%</span>
            <span>Clauses 4–10</span>
          </div>
        </div>

        <div className={s.card}>
          <p className={s.cardTitle}>Needs attention</p>
          <ul className={s.list}>
            <li className={`${s.row} ${s.on1}`}>
              <span className={`${s.dot} ${s.warn}`} />
              CAPA-0142 due in 3 days
            </li>
            <li className={`${s.row} ${s.on2}`}>
              <span className={`${s.dot} ${s.info}`} />
              Caliper C-17 calibration due Fri
            </li>
            <li className={`${s.row} ${s.on3}`}>
              <span className={`${s.dot} ${s.muted}`} />
              2 training sign-offs pending
            </li>
          </ul>
        </div>

        <p className={`${s.cardTitle} ${s.boardTitle}`}>Corrective actions</p>
        <div className={s.board}>
          <div className={s.col}>
            <span className={s.colTitle}>Open</span>
            <div className={s.until2}>
              <Task />
            </div>
          </div>
          <div className={s.col}>
            <span className={s.colTitle}>In progress</span>
            <div className={s.on2}>
              <div className={s.until4}>
                <Task />
              </div>
            </div>
          </div>
          <div className={s.col}>
            <span className={s.colTitle}>Verified</span>
            <div className={s.on4}>
              <Task done />
            </div>
          </div>
        </div>
      </div>

      <div className={`${s.toast} ${s.on5}`}>
        <b className="block">Daily summary</b>3 items need you this week
      </div>
    </LoopFrame>
  );
}
