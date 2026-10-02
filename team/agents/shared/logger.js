const fs = require("fs");
const path = require("path");
const { REPORTS_DIR } = require("./config");

const today = () => new Date().toISOString().slice(0, 10);
const timestamp = () => new Date().toISOString();

function logFile() {
  return path.join(REPORTS_DIR, "daily", `${today()}.log`);
}

function log(agent, action, detail = "") {
  const entry = `[${timestamp()}] [${agent}] ${action}: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`;
  console.log(entry);
  try {
    fs.appendFileSync(logFile(), entry + "\n");
  } catch {
    // reports dir may not exist in CI — that's ok
  }
}

function readTodayLog() {
  try {
    return fs.readFileSync(logFile(), "utf-8");
  } catch {
    return "";
  }
}

module.exports = { log, readTodayLog, today, timestamp };
