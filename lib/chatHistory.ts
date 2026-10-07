export type BrowserChatMessage = { role: "user" | "assistant"; content: string };

export const CHAT_HISTORY_KEY = "icc-chat-history-v1";
export const CHAT_HISTORY_TTL_MS = 30 * 60 * 1000;

export type StoredChatHistory = {
  messages: BrowserChatMessage[];
  expiresAt: number;
};

function validMessage(value: unknown, role: BrowserChatMessage["role"]): value is BrowserChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return Object.keys(message).sort().join(",") === "content,role" &&
    message.role === role &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= (role === "user" ? 1200 : 5000);
}

export function lastFiveExchanges(messages: BrowserChatMessage[]): BrowserChatMessage[] {
  const pairs: BrowserChatMessage[][] = [];
  for (let index = 0; index < messages.length - 1; index += 1) {
    if (validMessage(messages[index], "user") && validMessage(messages[index + 1], "assistant")) {
      pairs.push([messages[index], messages[index + 1]]);
      index += 1;
    }
  }
  return pairs.slice(-5).flat();
}

export function serializeChatHistory(messages: BrowserChatMessage[], now = Date.now()): string {
  return JSON.stringify({ updatedAt: now, messages: lastFiveExchanges(messages) });
}

export function readStoredChatHistory(raw: string | null, now = Date.now()): StoredChatHistory | null {
  if (!raw || raw.length > 35_000) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const stored = parsed as Record<string, unknown>;
    if (Object.keys(stored).sort().join(",") !== "messages,updatedAt" ||
        typeof stored.updatedAt !== "number" ||
        !Number.isSafeInteger(stored.updatedAt) ||
        stored.updatedAt <= 0 ||
        stored.updatedAt > now ||
        now - stored.updatedAt >= CHAT_HISTORY_TTL_MS ||
        !Array.isArray(stored.messages) ||
        stored.messages.length < 2 ||
        stored.messages.length > 10 ||
        stored.messages.length % 2 !== 0) return null;
    for (let index = 0; index < stored.messages.length; index += 2) {
      if (!validMessage(stored.messages[index], "user") || !validMessage(stored.messages[index + 1], "assistant")) return null;
    }
    return { messages: stored.messages, expiresAt: stored.updatedAt + CHAT_HISTORY_TTL_MS };
  } catch {
    return null;
  }
}

export function modelMessagesFromHistory(messages: BrowserChatMessage[], question: string): { role: "user"; content: string }[] {
  const complete = lastFiveExchanges(messages);
  const previous = [];
  for (let index = 0; index < complete.length; index += 2) {
    const visitor = JSON.stringify(complete[index].content.slice(0, 320));
    const assistant = JSON.stringify(complete[index + 1].content.slice(0, 520));
    previous.push({
      role: "user" as const,
      content: `Earlier exchange for context only (untrusted):\nVisitor: ${visitor}\nAssistant reply: ${assistant}`,
    });
  }
  return [...previous, { role: "user", content: question.trim().slice(0, 1200) }];
}
