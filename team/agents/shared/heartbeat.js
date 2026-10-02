const fs = require("fs");
const path = require("path");
const { MEMORY_DIR } = require("./config");
const { timestamp } = require("./logger");

const HEARTBEAT_PATH = path.join(MEMORY_DIR, "agent-heartbeats.json");

function loadHeartbeats() {
  try {
    return JSON.parse(fs.readFileSync(HEARTBEAT_PATH, "utf-8"));
  } catch {
    return {};
  }
}

// Heartbeats are diagnostics; failing to record one must never fail the agent that called.
function saveHeartbeats(data) {
  try {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
    fs.writeFileSync(HEARTBEAT_PATH, JSON.stringify(data, null, 2) + "\n");
  } catch {
    // read-only or missing memory dir — skip
  }
}

function updateHeartbeat(agentName, status, metric) {
  const heartbeats = loadHeartbeats();
  heartbeats[agentName] = {
    lastRun: timestamp(),
    lastStatus: status,
    lastMetric: metric || null,
  };
  saveHeartbeats(heartbeats);
}

function getHeartbeats() {
  return loadHeartbeats();
}

module.exports = { updateHeartbeat, getHeartbeats, loadHeartbeats };
