export const OUT_OF_SCOPE_REPLY =
  "This assistant can help with ISO Certification Consultants, its services, software, and QMS topics. For other questions, please use a general assistant.";

export function acceptScopedAnswer(raw: string): string {
  const result: unknown = JSON.parse(raw);
  if (!result || typeof result !== "object") throw new Error("Invalid model response.");
  const { in_scope, answer } = result as Record<string, unknown>;
  if (typeof in_scope !== "boolean" || typeof answer !== "string") {
    throw new Error("Invalid model response.");
  }
  if (!in_scope) return OUT_OF_SCOPE_REPLY;
  const reply = answer.trim();
  if (!reply || reply.length > 5000) throw new Error("Invalid model response.");
  return reply;
}
