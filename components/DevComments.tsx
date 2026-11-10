"use client";

// Local review tool: pin comments to any element on the dev server. Comments are
// stored by scripts/dev-with-chat.mjs in .dev-comments.json (git-ignored) so they
// can be read back and acted on. Mounted only when NODE_ENV is "development".

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type DevComment = {
  id: string;
  createdAt: string;
  status: "open";
  page: string;
  selector: string;
  tag: string;
  text: string;
  ox: number;
  oy: number;
  x: number;
  y: number;
  viewport: number;
  comment: string;
};

type Draft = Omit<DevComment, "id" | "createdAt" | "status" | "comment">;

const ENDPOINT = "/__dev/comments";
const OWN = "data-dev-comments";

function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body && parts.length < 8) {
    if (node.id) {
      parts.unshift(`#${CSS.escape(node.id)}`);
      break;
    }
    const tag = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    const same = parent ? Array.from(parent.children).filter((c) => c.tagName === node!.tagName) : [];
    parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
    node = parent;
  }
  return parts.join(" > ");
}

function pinPosition(c: DevComment) {
  let el: Element | null = null;
  try {
    el = document.querySelector(c.selector);
  } catch {
    el = null;
  }
  if (el) {
    const r = el.getBoundingClientRect();
    return { left: r.left + r.width * c.ox, top: r.top + r.height * c.oy };
  }
  return { left: c.x - window.scrollX, top: c.y - window.scrollY };
}

export function DevComments() {
  const page = usePathname() || "/";
  const [all, setAll] = useState<DevComment[]>([]);
  const [active, setActive] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [hover, setHover] = useState<DOMRect | null>(null);
  const [draft, setDraft] = useState<(Draft & { left: number; top: number }) | null>(null);
  const [text, setText] = useState("");
  const [, setTick] = useState(0);
  const hoverEl = useRef<Element | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
      if (res.ok) setAll(await res.json());
    } catch {
      /* dev server without the comments route */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Keep pins attached to their elements while scrolling and resizing.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTick((t) => t + 1));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const isOwn = (t: EventTarget | null) => t instanceof Element && !!t.closest(`[${OWN}]`);
    const onMove = (e: MouseEvent) => {
      if (isOwn(e.target) || !(e.target instanceof Element)) return setHover(null);
      hoverEl.current = e.target;
      setHover(e.target.getBoundingClientRect());
    };
    const onClick = (e: MouseEvent) => {
      if (isOwn(e.target) || !(e.target instanceof Element)) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.target;
      const r = el.getBoundingClientRect();
      setDraft({
        page,
        selector: cssPath(el),
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 200),
        ox: r.width ? (e.clientX - r.left) / r.width : 0,
        oy: r.height ? (e.clientY - r.top) / r.height : 0,
        x: e.pageX,
        y: e.pageY,
        viewport: window.innerWidth,
        left: Math.min(e.clientX, window.innerWidth - 340),
        top: Math.min(e.clientY + 12, window.innerHeight - 220),
      });
      setText("");
      setActive(false);
      setHover(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(false);
        setHover(null);
      }
    };
    // Capture phase, so links and buttons do not act on the comment click.
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    document.body.style.cursor = "crosshair";
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
      document.body.style.cursor = "";
    };
  }, [active, page]);

  async function save() {
    if (!draft || !text.trim()) return;
    const { left: _l, top: _t, ...body } = draft;
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, comment: text.trim() }),
    });
    if (res.ok) {
      setDraft(null);
      setText("");
      load();
    }
  }

  async function remove(id: string) {
    await fetch(`${ENDPOINT}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    load();
  }

  const here = all.filter((c) => c.page === page);

  return (
    <div {...{ [OWN]: "" }} className="font-sans">
      {active && hover && (
        <div
          className="pointer-events-none fixed z-[70] rounded border-2 border-amber-500 bg-amber-400/10"
          style={{ left: hover.left, top: hover.top, width: hover.width, height: hover.height }}
        />
      )}

      {here.map((c, i) => {
        const pos = pinPosition(c);
        return (
          <button
            key={c.id}
            type="button"
            title={c.comment}
            onClick={() => setListOpen(true)}
            className="fixed z-[71] grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-amber-500 text-xs font-bold text-white shadow-lg"
            style={pos}
          >
            {i + 1}
          </button>
        );
      })}

      {draft && (
        <div
          className="fixed z-[72] w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl"
          style={{ left: draft.left, top: draft.top }}
        >
          <p className="truncate text-xs text-slate-500">
            &lt;{draft.tag}&gt; {draft.text || "(no text)"}
          </p>
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
              if (e.key === "Escape") setDraft(null);
            }}
            rows={4}
            placeholder="What should change here?"
            className="mt-2 w-full resize-none rounded-lg border border-slate-300 p-2 text-sm text-slate-900 outline-none focus:border-amber-500"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setDraft(null)} className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button type="button" onClick={save} className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-600">
              Save (⌘↵)
            </button>
          </div>
        </div>
      )}

      {listOpen && (
        <div className="fixed bottom-20 left-4 z-[72] max-h-[60vh] w-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Comments on this page ({here.length})</p>
            <button type="button" onClick={() => setListOpen(false)} className="text-sm text-slate-500 hover:text-slate-900">
              Close
            </button>
          </div>
          {here.length === 0 && <p className="mt-2 text-sm text-slate-500">None yet.</p>}
          <ol className="mt-2 space-y-2">
            {here.map((c, i) => (
              <li key={c.id} className="rounded-lg border border-slate-200 p-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-bold text-amber-600">{i + 1}.</span>
                  <p className="flex-1 whitespace-pre-wrap text-slate-800">{c.comment}</p>
                  <button type="button" onClick={() => remove(c.id)} className="text-xs text-slate-400 hover:text-red-600">
                    Delete
                  </button>
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">{c.text}</p>
              </li>
            ))}
          </ol>
          {all.length > here.length && (
            <p className="mt-2 text-xs text-slate-500">{all.length - here.length} more on other pages.</p>
          )}
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-[72] flex gap-2">
        <button
          type="button"
          onClick={() => {
            setDraft(null);
            setActive((v) => !v);
          }}
          className={`rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg ${active ? "bg-slate-900 text-white" : "bg-amber-500 text-white hover:bg-amber-600"}`}
        >
          {active ? "Click an element… (Esc)" : "+ Comment"}
        </button>
        <button
          type="button"
          onClick={() => setListOpen((v) => !v)}
          className="rounded-full bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-lg ring-1 ring-slate-200"
        >
          {here.length} here · {all.length} total
        </button>
      </div>
    </div>
  );
}
