import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import ts from "typescript";

test("compiled chat API parses with the deployed package's module format", () => {
  const directory = mkdtempSync(join(tmpdir(), "icc-chat-module-"));
  try {
    const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
    assert.equal(config.error, undefined);
    const { options, errors } = ts.convertCompilerOptionsFromJson(config.config.compilerOptions, ".");
    assert.deepEqual(errors, []);
    const { outputText } = ts.transpileModule(readFileSync("api/chat.ts", "utf8"), {
      compilerOptions: options,
      fileName: "api/chat.ts",
    });
    copyFileSync("package.json", join(directory, "package.json"));
    const compiledPath = join(directory, "chat.js");
    writeFileSync(compiledPath, outputText);

    // Local syntax detection can hide missing ESM metadata. The deployed
    // function must parse correctly using its package metadata alone.
    const result = spawnSync(process.execPath, [
      "--no-experimental-detect-module", "--check", compiledPath,
    ], { encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "" } });
    assert.equal(result.status, 0, result.stderr || result.error?.message);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
