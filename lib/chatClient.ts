import type { ChatMessage } from "./chatRequest.ts";
import { retryAfterSeconds } from "./chatRetry.ts";

export class ChatRequestError extends Error {
  retryable: boolean;
  retryAfterMs: number;

  constructor(message: string, retryable = true, retryAfterMs = 0) {
    super(message);
    this.name = "ChatRequestError";
    this.retryable = retryable;
    this.retryAfterMs = retryAfterMs;
  }
}

export async function requestChat(messages: ChatMessage[], signal?: AbortSignal): Promise<string> {
  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  if (signal?.aborted) cancel();
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 25_000);

  try {
    const response = await fetch("/api/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
    if (response.status === 429) {
      throw new ChatRequestError("Chat is busy. Your question is saved; please wait before trying again.", true, retryAfterSeconds(response.headers.get("retry-after")) * 1000);
    }
    if (response.status === 400 || response.status === 413) {
      throw new ChatRequestError("Please shorten your message or clear the chat to start a new conversation.", false);
    }
    if (!response.ok) throw new ChatRequestError("Chat is temporarily unavailable. Please try again.");
    const result: unknown = await response.json();
    const reply = result && typeof result === "object" ? (result as { reply?: unknown }).reply : undefined;
    if (typeof reply !== "string" || !reply.trim() || reply.length > 5000) {
      throw new ChatRequestError("The answer could not load. Please try again.");
    }
    return reply.trim();
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timedOut) throw new ChatRequestError("The answer took too long. Your question is saved; please try again.");
    if (error instanceof ChatRequestError) throw error;
    if (error instanceof SyntaxError) throw new ChatRequestError("The answer could not load. Please try again.");
    throw new ChatRequestError("We couldn’t connect to chat. Check your internet connection and try again.");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
}
