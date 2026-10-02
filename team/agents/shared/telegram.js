/**
 * Telegram Notification Utility
 * Send messages to the Owner from any agent or pipeline
 *
 * Usage:
 *   const telegram = require('./telegram');
 *   await telegram.notify('Blog published: "Article Title"');
 *   await telegram.notifySuccess('Blog', 'Published "Title" — 95/100 QA');
 *   await telegram.notifyError('Blog', 'QA failed at 82/100');
 *   await telegram.askApproval('Push to production?');
 */

const { log } = require("./logger");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_ID || "";

async function sendTelegram(text) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    log("telegram", "skip", "No bot token or admin ID configured");
    return false;
  }

  try {
    // Split long messages (Telegram 4096 char limit)
    const chunks = [];
    for (let i = 0; i < text.length; i += 4000) {
      chunks.push(text.slice(i, i + 4000));
    }

    for (const chunk of chunks) {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: chunk,
            disable_web_page_preview: true,
          }),
        }
      );
      if (!res.ok) {
        log("telegram", "error", `Failed to send: ${res.status}`);
        return false;
      }
    }
    log("telegram", "sent", text.slice(0, 80) + (text.length > 80 ? "..." : ""));
    return true;
  } catch (err) {
    log("telegram", "error", err.message);
    return false;
  }
}

// Simple notification
async function notify(message) {
  return sendTelegram(message);
}

// Success notification with emoji
async function notifySuccess(pipeline, details) {
  return sendTelegram(`${pipeline} completed successfully\n\n${details}`);
}

// Error notification
async function notifyError(pipeline, details) {
  return sendTelegram(`${pipeline} FAILED\n\n${details}`);
}

// Ask for approval (informational — the Owner responds in Claude Code or Telegram)
async function askApproval(question) {
  return sendTelegram(`Approval needed:\n\n${question}\n\nReply here or approve in Claude Code.`);
}

// Send a formatted report
async function sendReport(title, sections) {
  let msg = `${title}\n${"=".repeat(30)}\n\n`;
  for (const [heading, content] of Object.entries(sections)) {
    msg += `${heading}:\n${content}\n\n`;
  }
  return sendTelegram(msg.trim());
}

module.exports = { notify, notifySuccess, notifyError, askApproval, sendReport, sendTelegram };
