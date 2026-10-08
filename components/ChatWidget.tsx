"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowRight, ChevronDown, Phone } from "./Icons";
import { SITE } from "@/lib/site";
import { chatReplyMarkdown, safeSiteHref } from "@/lib/chatLinks";
import { CHAT_HISTORY_KEY, CHAT_HISTORY_TTL_MS, lastFiveExchanges, modelMessagesFromHistory, readStoredChatHistory, serializeChatHistory } from "@/lib/chatHistory";
import { ChatRequestError, requestChat } from "@/lib/chatClient";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Which standards do you support?",
  "What can the software modules do?",
  "How does certification consulting work?",
];

function AssistantAvatar({ small = false }: { small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 overflow-hidden rounded-full border-2 border-white bg-teal-100 shadow-sm ${small ? "h-7 w-7 sm:h-9 sm:w-9" : "h-9 w-9 sm:h-12 sm:w-12"}`}
    >
      <Image
        src="/images/anthony-consultant.jpg"
        alt=""
        width={96}
        height={96}
        className="h-full w-full object-cover object-[center_38%]"
      />
    </span>
  );
}

function ReplyText({ content }: { content: string }) {
  return (
    <ReactMarkdown
      skipHtml
      components={{
        a: ({ href, children }) => {
          const safe = href ? safeSiteHref(href, SITE.url) : null;
          return safe ? (
            <a href={new URL(safe).pathname} className="font-semibold text-teal-800 underline underline-offset-2 hover:text-teal-950">
              {children}
            </a>
          ) : <span>{children}</span>;
        },
        p: ({ children }) => <p className="mb-2 last:mb-0 sm:mb-3">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0 sm:mb-3">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0 sm:mb-3">{children}</ol>,
        li: ({ children }) => <li className="pl-0.5">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-navy-900">{children}</strong>,
        h1: ({ children }) => <h3 className="mb-2 font-heading text-sm font-semibold text-navy-900">{children}</h3>,
        h2: ({ children }) => <h3 className="mb-2 font-heading text-sm font-semibold text-navy-900">{children}</h3>,
        h3: ({ children }) => <h3 className="mb-2 font-heading text-sm font-semibold text-navy-900">{children}</h3>,
        blockquote: ({ children }) => <blockquote className="mb-3 border-l-2 border-teal-300 pl-3 italic last:mb-0">{children}</blockquote>,
        pre: ({ children }) => <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-100 p-2 text-xs last:mb-0">{children}</pre>,
        img: ({ alt }) => <span>{alt}</span>,
      }}
    >
      {chatReplyMarkdown(content, SITE.url)}
    </ReactMarkdown>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ChatRequestError | null>(null);
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null);
  const [retryAt, setRetryAt] = useState(0);
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [mobileViewport, setMobileViewport] = useState<{ height: number; top: number } | null>(null);
  const [unreadReply, setUnreadReply] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const expiresAtRef = useRef<number | null>(null);
  const sendingRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const restoreFocusRef = useRef(false);
  const followReplyRef = useRef(true);
  const scrollActionRef = useRef<"bottom" | "reply" | "error" | null>(null);

  function closeChat() {
    restoreFocusRef.current = true;
    setOpen(false);
  }

  function showReply() {
    const transcript = transcriptRef.current;
    const reply = replyRef.current;
    if (transcript && reply) {
      const inset = parseFloat(getComputedStyle(transcript).paddingTop);
      transcript.scrollTop += reply.getBoundingClientRect().top - transcript.getBoundingClientRect().top - inset;
    }
    setUnreadReply(false);
  }

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (!retryAt) return;
    const update = () => {
      const seconds = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
      setRetrySeconds(seconds);
      if (seconds === 0) setRetryAt(0);
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [retryAt]);

  // Account for the visual viewport shrinking when a phone's keyboard opens.
  useEffect(() => {
    if (!open || !mobile) { setMobileViewport(null); return; }
    const viewport = window.visualViewport;
    const update = () => {
      if (!viewport || viewport.scale > 1) return;
      setMobileViewport({ height: viewport.height, top: viewport.offsetTop });
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
    };
  }, [open, mobile]);

  useEffect(() => {
    try {
      const stored = readStoredChatHistory(window.localStorage.getItem(CHAT_HISTORY_KEY));
      if (stored) {
        setMessages(stored.messages);
        expiresAtRef.current = stored.expiresAt;
        setExpiresAt(stored.expiresAt);
      } else {
        window.localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (expiresAt === null) return;
    const timeout = window.setTimeout(() => {
      if (expiresAtRef.current !== expiresAt || Date.now() < expiresAt) return;
      expiresAtRef.current = null;
      setExpiresAt(null);
      setMessages([]);
      try { window.localStorage.removeItem(CHAT_HISTORY_KEY); } catch { /* Storage may be unavailable. */ }
    }, Math.max(0, expiresAt - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [expiresAt]);

  useLayoutEffect(() => {
    if (!open) {
      if (restoreFocusRef.current) launcherRef.current?.focus({ preventScroll: true });
      restoreFocusRef.current = false;
      return;
    }
    // Avoid opening the software keyboard before a phone visitor chooses to type.
    const target = mobile ? panelRef.current : inputRef.current;
    target?.focus({ preventScroll: true });
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    setUnreadReply(false);
  }, [open, mobile]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const resize = () => {
      input.style.height = "0px";
      input.style.height = `${Math.min(120, Math.max(40, input.scrollHeight))}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draft, open]);

  useLayoutEffect(() => {
    if (!open || !transcriptRef.current) return;
    const action = scrollActionRef.current;
    scrollActionRef.current = null;
    if (action === "reply") showReply();
    if (action === "bottom") {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
      followReplyRef.current = true;
    }
    if (action === "error" && errorRef.current) {
      const inset = parseFloat(getComputedStyle(transcriptRef.current).paddingTop);
      transcriptRef.current.scrollTop += errorRef.current.getBoundingClientRect().top - transcriptRef.current.getBoundingClientRect().top - inset;
    }
  }, [open, messages, busy, error]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const inertElements: { element: HTMLElement; inert: boolean }[] = [];
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    if (mobile && rootRef.current) {
      let branch: HTMLElement = rootRef.current;
      while (branch.parentElement) {
        for (const sibling of Array.from(branch.parentElement.children)) {
          if (sibling !== branch && sibling instanceof HTMLElement) {
            inertElements.push({ element: sibling, inert: sibling.inert });
            sibling.inert = true;
          }
        }
        if (branch.parentElement === document.body) break;
        branch = branch.parentElement;
      }
      document.body.style.overflow = "hidden";
      // Prevent wide background decorations from scaling down a narrow phone viewport.
      document.documentElement.style.overflow = "hidden";
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (mobile || panel?.contains(document.activeElement))) {
        event.preventDefault();
        closeChat();
      }
      if (!mobile || event.key !== "Tab" || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], textarea, [tabindex="0"]'))
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      for (const { element, inert } of inertElements) element.inert = inert;
      if (mobile) {
        document.body.style.overflow = previousOverflow;
        document.documentElement.style.overflow = previousRootOverflow;
      }
    };
  }, [open, mobile]);

  async function send(value: string) {
    const content = value.trim();
    if (!content || sendingRef.current || Date.now() < retryAt) return;
    sendingRef.current = true;
    const activeMessages = expiresAtRef.current !== null && Date.now() < expiresAtRef.current ? messages : [];
    if (activeMessages.length === 0) {
      expiresAtRef.current = null;
      setExpiresAt(null);
      try { window.localStorage.removeItem(CHAT_HISTORY_KEY); } catch { /* Storage may be unavailable. */ }
    }
    const next: Message[] = [...lastFiveExchanges(activeMessages), { role: "user", content }];
    scrollActionRef.current = "bottom";
    followReplyRef.current = true;
    setMessages(next);
    setDraft((current) => current.trim() === content ? "" : current);
    setError(null);
    setFailedQuestion(null);
    setUnreadReply(false);
    setRetryAt(0);
    setRetrySeconds(0);
    setBusy(true);

    const history = modelMessagesFromHistory(activeMessages, content);

    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const reply = await requestChat(history, controller.signal);
      // Trim visible history on the next send, not while a visitor is reading it.
      // Storage and model context still retain only the last five exchanges.
      const complete: Message[] = [...next, { role: "assistant", content: reply }];
      const savedAt = Date.now();
      if (followReplyRef.current) scrollActionRef.current = "reply";
      else setUnreadReply(true);
      setMessages(complete);
      expiresAtRef.current = savedAt + CHAT_HISTORY_TTL_MS;
      setExpiresAt(expiresAtRef.current);
      try {
        window.localStorage.setItem(CHAT_HISTORY_KEY, serializeChatHistory(complete, savedAt));
      } catch {
        // The chat still works when browser storage is unavailable.
      }
    } catch (cause) {
      if (controller.signal.aborted) return;
      const failure = cause instanceof ChatRequestError ? cause : new ChatRequestError("Chat is temporarily unavailable. Please try again.");
      setError(failure);
      setFailedQuestion(content);
      setDraft((current) => current || content);
      setRetryAt(failure.retryAfterMs ? Date.now() + failure.retryAfterMs : 0);
      setRetrySeconds(Math.ceil(failure.retryAfterMs / 1000));
      scrollActionRef.current = "error";
    } finally {
      requestRef.current = null;
      sendingRef.current = false;
      setBusy(false);
    }
  }

  return (
    <div ref={rootRef} className="fixed bottom-3 right-3 z-[60] sm:bottom-6 sm:right-6">
      {!open && (
        <div className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-white p-1.5 shadow-[0_14px_38px_-14px_rgba(22,43,77,0.55)] sm:gap-2 sm:p-2">
          <AssistantAvatar small />
          <span className="mr-1 text-xs font-semibold text-navy-900">ISO Consultant</span>
          <a
            href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
            aria-label={`Call Anthony at ${SITE.phone}`}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-teal-300 px-3 text-xs font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call
          </a>
          <button
            ref={launcherRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Chat with ISO Consultant"
            aria-expanded={false}
            aria-controls="website-chat-panel"
            className="min-h-10 rounded-full bg-teal-700 px-3.5 text-xs font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Chat
          </button>
        </div>
      )}

      {open && (
        <section
          ref={panelRef}
          tabIndex={-1}
          id="website-chat-panel"
          role="dialog"
          aria-modal={mobile || undefined}
          aria-label="Chat with ISO Consultant"
          style={mobile && mobileViewport ? { height: mobileViewport.height, top: mobileViewport.top } : undefined}
          className="flex h-[min(620px,calc(100dvh-2rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white outline-none shadow-[0_28px_80px_-22px_rgba(22,43,77,0.6)] max-sm:fixed max-sm:inset-x-0 max-sm:top-0 max-sm:h-[100dvh] max-sm:w-screen max-sm:rounded-none"
        >
          <div className="flex shrink-0 items-center bg-navy-900 text-white max-sm:pt-[env(safe-area-inset-top)]">
            <button
              type="button"
              onClick={closeChat}
              aria-label="Collapse chat"
              className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:gap-3 sm:px-4 sm:py-4"
            >
              <AssistantAvatar />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-sm font-semibold text-white sm:text-base">ISO Consultant</span>
                <span className="block truncate text-[11px] text-teal-200 sm:text-xs">ISO Certification Consultants</span>
              </span>
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setMessages([]);
                  setDraft("");
                  setError(null);
                  setFailedQuestion(null);
                  setUnreadReply(false);
                  inputRef.current?.focus({ preventScroll: true });
                  expiresAtRef.current = null;
                  setExpiresAt(null);
                  try { window.localStorage.removeItem(CHAT_HISTORY_KEY); } catch { /* Storage may be unavailable. */ }
                }}
                className="min-h-11 shrink-0 rounded px-2 py-1 text-xs text-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50 sm:min-h-0"
              >
                Clear chat
              </button>
            )}
            <button
              type="button"
              onClick={closeChat}
              aria-label="Collapse chat"
              className="mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:mr-4 sm:h-9 sm:w-9"
            >
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div ref={transcriptRef} onScroll={() => {
            const element = transcriptRef.current;
            if (busy && element) followReplyRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
          }} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50 px-3 py-3 [overflow-anchor:none] sm:space-y-4 sm:px-4 sm:py-5" aria-live="polite" aria-relevant="additions text">
            <div className="flex items-start gap-2">
              <AssistantAvatar small />
              <div className="max-w-[calc(100%-2.25rem)] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2 text-sm leading-5 text-slate-700 shadow-sm sm:max-w-[82%] sm:px-4 sm:py-3 sm:leading-relaxed">
                Hello. Ask about certification consulting, supported standards, or the software modules. For advice about your own operation, the team can help directly.
              </div>
            </div>

            {messages.length === 0 && (
              <div className="ml-9 space-y-1.5 sm:ml-11 sm:space-y-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="block min-h-10 rounded-xl border border-teal-200 bg-white px-3 py-2 text-left text-xs font-medium text-teal-800 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 sm:min-h-0 sm:rounded-full"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} ref={message.role === "assistant" && index === messages.length - 1 ? replyRef : undefined} className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && <AssistantAvatar small />}
                <div className={`break-words rounded-2xl px-3 py-2 text-sm leading-5 sm:max-w-[82%] sm:px-4 sm:py-3 sm:leading-relaxed ${message.role === "user" ? "max-w-[90%] whitespace-pre-wrap rounded-tr-sm bg-navy-900 text-white" : "max-w-[calc(100%-2.25rem)] rounded-tl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>
                  {message.role === "assistant" ? <ReplyText content={message.content} /> : message.content}
                </div>
              </div>
            ))}

            {busy && (
              <div className="ml-9 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm sm:ml-11 sm:px-4 sm:py-3" role="status">
                Thinking…
              </div>
            )}

            {error && (
              <div ref={errorRef} className="ml-9 break-words rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-900 sm:ml-11 sm:p-3">
                <p role="alert">{error.message} You can also email <a href={`mailto:${SITE.email}`} className="font-semibold underline">{SITE.email}</a> or call <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`} className="font-semibold underline">{SITE.phone}</a>.</p>
                {error.retryable && failedQuestion && (
                  <button type="button" disabled={busy || retrySeconds > 0} onClick={() => send(failedQuestion)} className="mt-2 block min-h-11 rounded-lg border border-amber-400 px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60">
                    {retrySeconds > 0 ? `Try again in ${retrySeconds}s` : "Try again"}
                  </button>
                )}
              </div>
            )}
          </div>

          {unreadReply && <button type="button" onClick={showReply} className="min-h-11 shrink-0 border-t border-teal-200 bg-teal-50 px-3 text-sm font-semibold text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700">View new reply</button>}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
            className="shrink-0 border-t border-slate-200 bg-white p-2 max-sm:pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-3"
          >
            <div className="flex items-end gap-1 rounded-xl border border-slate-300 bg-white p-1 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 sm:gap-2 sm:p-2">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
                aria-label="Your message"
                aria-describedby={draft.length >= 1000 ? "chat-message-limit" : undefined}
                placeholder="Ask a question…"
                rows={1}
                maxLength={1200}
                className="min-h-10 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-base leading-6 text-navy-900 outline-none placeholder:text-slate-400 sm:text-sm sm:leading-6"
              />
              <button
                type="submit"
                disabled={!draft.trim() || busy || retrySeconds > 0}
                aria-label="Send message"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:h-10 sm:w-10"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            {draft.length >= 1000 && <p id="chat-message-limit" className="mt-1 text-right text-xs text-slate-500">{draft.length} / 1200</p>}
          </form>
        </section>
      )}
    </div>
  );
}
