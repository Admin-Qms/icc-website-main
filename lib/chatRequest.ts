export type ChatMessage = { role: "user"; content: string };

export function normalizeChatMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input) || input.length < 1 || input.length > 12) {
    throw new Error("Send between 1 and 12 messages.");
  }

  let totalLength = 0;
  const messages: ChatMessage[] = input.map((item: unknown): ChatMessage => {
    if (!item || typeof item !== "object") {
      throw new Error("Invalid message.");
    }
    const { role, content } = item as Record<string, unknown>;
    if (Object.keys(item).sort().join(",") !== "content,role") {
      throw new Error("Invalid message fields.");
    }
    if (role !== "user" || typeof content !== "string") {
      throw new Error("Invalid message.");
    }
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 1200) {
      throw new Error("Messages must contain 1 to 1200 characters.");
    }
    totalLength += trimmed.length;
    return { role, content: trimmed };
  });

  if (totalLength > 6000) {
    throw new Error("Invalid conversation.");
  }
  return messages;
}
