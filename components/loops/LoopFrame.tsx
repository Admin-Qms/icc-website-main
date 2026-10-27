import s from "./loops.module.css";

const TABS = ["Home", "Standards", "Documents", "Audits", "Improvements", "Training"];

/**
 * Unbranded app window for a product loop. The root is one image for assistive
 * technology; everything drawn inside it is hidden from the accessibility tree.
 */
export function LoopFrame({
  active,
  label,
  children,
}: {
  active: string;
  label: string;
  children: React.ReactNode;
}) {
  const tabs = TABS.includes(active) ? TABS : [...TABS, active];
  return (
    <div role="img" aria-label={label} className={`${s.window} font-sans`}>
      <div aria-hidden="true">
        <div className={s.bar}>
          <span className={s.mark} />
          <span className={`${s.title} font-heading`}>Compliance Management Software</span>
          <span className={s.search} />
          <span className={s.avatar} />
        </div>
        <div className={s.tabs}>
          <div className={s.tabList}>
            {tabs.map((t) => (
              <span key={t} className={t === active ? `${s.tab} ${s.tabOn}` : s.tab}>
                {t}
              </span>
            ))}
          </div>
          <span className={s.sample}>Sample data</span>
        </div>
        <div className={s.stage}>{children}</div>
      </div>
    </div>
  );
}
