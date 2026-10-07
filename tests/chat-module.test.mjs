import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import ts from "typescript";

test("compiled chat API loads its dependencies and handles requests", () => {
  const directory = mkdtempSync(join(tmpdir(), "icc-chat-module-"));
  try {
    const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
    assert.equal(config.error, undefined);
    const { options, errors } = ts.convertCompilerOptionsFromJson(config.config.compilerOptions, ".");
    assert.deepEqual(errors, []);
    copyFileSync("package.json", join(directory, "package.json"));
    for (const folder of ["api", "lib"]) {
      mkdirSync(join(directory, folder));
      for (const file of readdirSync(folder).filter((file) => file.endsWith(".ts"))) {
        const fileName = join(folder, file);
        const { outputText } = ts.transpileModule(readFileSync(fileName, "utf8"), {
          compilerOptions: options,
          fileName,
        });
        writeFileSync(join(directory, folder, file.replace(/\.ts$/, ".js")), outputText);
      }
    }
    mkdirSync(join(directory, "content"));
    copyFileSync("content/chatbot-context.md", join(directory, "content/chatbot-context.md"));
    symlinkSync(resolve("node_modules"), join(directory, "node_modules"), "junction");

    // Local syntax detection can hide missing ESM metadata. The deployed
    // function must load correctly using its package metadata and emitted JS.
    const result = spawnSync(process.execPath, [
      "--no-experimental-detect-module", "--input-type=module", "-e", `
        import assert from "node:assert/strict";
        const { default: chat } = await import("./api/chat.js");
        const url = "https://isocertificationconsultants.ca/api/chat/";
        const get = await chat.fetch(new Request(url));
        assert.equal(get.status, 405);
        const post = await chat.fetch(new Request(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }),
        }));
        assert.equal(post.status, 503);
        assert.match((await post.json()).error, /contact the team/i);
      `,
    ], { cwd: directory, encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "", GROQ_API_KEY: "" } });
    assert.equal(result.status, 0, result.stderr || result.error?.message);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
