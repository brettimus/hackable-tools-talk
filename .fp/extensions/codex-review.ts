import type { FpExtensionContext } from "@fiberplane/fp-core";
import { spawn } from "child_process";

export default function codexReview(fp: FpExtensionContext) {
  fp.log.info("[codex-review] loaded");

  fp.on("issue:status:changed", async ({ issue, from, to }) => {
    if (to !== "done") return;

    fp.log.info(`[codex-review] ${issue.id} marked done — triggering review`);

    // Gather the diff for this issue
    const diff = await runCommand("fp", ["issue", "diff", issue.id], fp.projectDir);
    if (!diff.trim()) {
      fp.log.info(`[codex-review] no diff found for ${issue.id}, skipping`);
      return;
    }

    // Gather comments for context via CLI (workaround: fp.comments.list
    // works but fp.issues.create has a yjs_updates null ID bug, so we
    // shell out for all writes to be safe)
    let commentLog = "";
    try {
      const commentsRaw = await runCommand("fp", ["comment", "list", issue.id, "--format", "json"], fp.projectDir);
      const comments = JSON.parse(commentsRaw);
      commentLog = comments
        .map((c: { author: string; content: string }) => `[${c.author}]: ${c.content}`)
        .join("\n");
    } catch {
      // comment list may not support --format json, fall back to plain
      commentLog = await runCommand("fp", ["comment", "list", issue.id], fp.projectDir).catch(() => "");
    }

    // Create a parent issue for follow-ups via CLI
    // (workaround for fp.issues.create() null ID bug in extension context)
    const createOutput = await runCommand("fp", [
      "issue", "create",
      "--title", `Review follow-ups: ${issue.title}`,
      "--status", "todo",
    ], fp.projectDir);

    // Parse the issue ID from output like "Created issue CODEX-abc123: ..."
    const idMatch = createOutput.match(/(\w+-\w+):/);
    if (!idMatch) {
      fp.log.error(`[codex-review] failed to parse parent issue ID from: ${createOutput}`);
      return;
    }
    const reviewParentId = idMatch[1];

    fp.log.info(`[codex-review] created follow-up parent ${reviewParentId}`);

    // Build the prompt for codex
    const prompt = buildReviewPrompt(issue, diff, commentLog, reviewParentId);

    // Notify that a review is starting
    await runCommand("fp", [
      "comment", issue.id,
      `Automatic code review kicked off by codex-review extension. Follow-ups will be filed under ${reviewParentId}.`,
    ], fp.projectDir);

    // Spawn codex detached so it survives fp exiting.
    // Codex will self-report results via `fp comment` in the prompt.
    const codexProc = spawn("codex", [
      "--approval-mode", "full-auto",
      prompt,
    ], {
      cwd: fp.projectDir,
      detached: true,
      stdio: "ignore",
      env: { ...process.env },
    });

    codexProc.unref();

    fp.log.info(
      `[codex-review] spawned codex (pid ${codexProc.pid}) detached for ${issue.id}`
    );
  });
}

function buildReviewPrompt(
  issue: { id: string; title: string; description: string },
  diff: string,
  commentLog: string,
  followUpParentId: string
): string {
  return `You are reviewing completed work on task ${issue.id}. Your job is to identify follow-up issues — bugs, missing edge cases, cleanup, or improvements.

## Completed Task
- ID: ${issue.id}
- Title: ${issue.title}
- Description: ${issue.description || "(none)"}

## Progress Notes
${commentLog || "(none)"}

## Diff (from fp issue diff ${issue.id})
\`\`\`
${diff.slice(0, 8000)}
\`\`\`

## Instructions
1. Review the diff carefully for:
   - Bugs or logic errors
   - Missing error handling
   - Dead code or unnecessary abstractions
   - Missing tests
   - Any TODO/FIXME/HACK comments that need follow-up
2. For each issue found, file it as a child of ${followUpParentId} by running EXACTLY:
   fp issue create --title "<concise title>" --parent ${followUpParentId} --status todo
   IMPORTANT: The --parent value must be exactly "${followUpParentId}" (not "root" or any other value).
3. If the work looks clean, just say so — don't create issues for the sake of it.
4. When you are done, post a summary of your findings by running:
   fp comment ${issue.id} "Review complete. <your summary here>"
   This is REQUIRED — it is how you report back.`;
}

function runCommand(cmd: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });
    proc.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`${cmd} exited with code ${code}: ${stderr}`));
      }
    });

    proc.on("error", reject);
  });
}
