"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowRight, ChevronDown, Phone } from "./Icons";
import { SITE } from "@/lib/site";
import { chatReplyMarkdown, safeSiteHref } from "@/lib/chatLinks";
import { CHAT_HISTORY_KEY, CHAT_HISTORY_TTL_MS, lastFiveExchanges, modelMessagesFromHistory, readStoredChatHistory, serializeChatHistory } from "@/lib/chatHistory";

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
      className={`block shrink-0 overflow-hidden rounded-full border-2 border-white bg-teal-100 shadow-sm ${small ? "h-9 w-9" : "h-12 w-12"}`}
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
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
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
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const expiresAtRef = useRef<number | null>(null);
  const sendingRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [open, messages, busy, error]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function send(value: string) {
    const content = value.trim();
    if (!content || sendingRef.current) return;
    sendingRef.current = true;
    const activeMessages = expiresAtRef.current !== null && Date.now() < expiresAtRef.current ? messages : [];
    if (activeMessages.length === 0) {
      expiresAtRef.current = null;
      setExpiresAt(null);
      try { window.localStorage.removeItem(CHAT_HISTORY_KEY); } catch { /* Storage may be unavailable. */ }
    }
    const next: Message[] = [...lastFiveExchanges(activeMessages), { role: "user", content }];
    setMessages(next);
    setDraft("");
    setError("");
    setBusy(true);

    const history = modelMessagesFromHistory(activeMessages, content);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const result = (await response.json().catch(() => ({ error: "Chat is unavailable on this host." }))) as { reply?: string; error?: string };
      if (!response.ok || !result.reply) {
        throw new Error(result.error || "Chat is temporarily unavailable.");
      }
      const complete = lastFiveExchanges([...next, { role: "assistant", content: result.reply }]);
      const savedAt = Date.now();
      setMessages(complete);
      expiresAtRef.current = savedAt + CHAT_HISTORY_TTL_MS;
      setExpiresAt(expiresAtRef.current);
      try {
        window.localStorage.setItem(CHAT_HISTORY_KEY, serializeChatHistory(complete, savedAt));
      } catch {
        // The chat still works when browser storage is unavailable.
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Chat is temporarily unavailable.");
    } finally {
      sendingRef.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      {!open && (
        <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-white p-2 shadow-[0_14px_38px_-14px_rgba(22,43,77,0.55)]">
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
          id="website-chat-panel"
          role="dialog"
          aria-label="Chat with ISO Consultant"
          className="flex h-[min(620px,calc(100dvh-2rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_-22px_rgba(22,43,77,0.6)] max-sm:fixed max-sm:inset-0 max-sm:h-[100dvh] max-sm:w-full max-sm:rounded-none"
        >
          <div className="flex items-center bg-navy-900 text-white">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Collapse chat"
              className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <AssistantAvatar />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-base font-semibold text-white">ISO Consultant</span>
                <span className="block truncate text-xs text-teal-200">ISO Certification Consultants</span>
              </span>
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setMessages([]);
                  setDraft("");
                  setError("");
                  expiresAtRef.current = null;
                  setExpiresAt(null);
                  try { window.localStorage.removeItem(CHAT_HISTORY_KEY); } catch { /* Storage may be unavailable. */ }
                }}
                className="rounded px-2 py-1 text-xs text-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
              >
                Clear chat
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Collapse chat"
              className="mr-4 grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-5" aria-live="polite" aria-relevant="additions text">
            <div className="flex items-start gap-2">
              <AssistantAvatar small />
              <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm">
                Hello. Ask about certification consulting, supported standards, or the software modules. For advice about your own operation, the team can help directly.
              </div>
            </div>

            {messages.length === 0 && (
              <div className="ml-11 space-y-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="block rounded-full border border-teal-200 bg-white px-3 py-2 text-left text-xs font-medium text-teal-800 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && <AssistantAvatar small />}
                <div className={`max-w-[82%] break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "whitespace-pre-wrap rounded-tr-sm bg-navy-900 text-white" : "rounded-tl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>
                  {message.role === "assistant" ? <ReplyText content={message.content} /> : message.content}
                </div>
              </div>
            ))}

            {busy && (
              <div className="ml-11 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm" role="status">
                Thinking…
              </div>
            )}

            {error && (
              <div role="alert" className="ml-11 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                {error} You can also email <a href={`mailto:${SITE.email}`} className="font-semibold underline">{SITE.email}</a> or call <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`} className="font-semibold underline">{SITE.phone}</a>.
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white p-2 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
                aria-label="Your message"
                placeholder="Ask a question…"
                rows={1}
                maxLength={1200}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-navy-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!draft.trim() || busy}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
