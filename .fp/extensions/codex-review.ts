import type { FpExtensionContext } from "@fiberplane/fp-core";
import { spawn } from "child_process";

export default function codexReview(fp: FpExtensionContext) {
  fp.log.info("[codex-review] loaded");

  fp.on("issue:status:changed", async ({ issue, from, to }) => {
    if (to !== "done") return;

    fp.log.info(`[codex-review] ${issue.id} marked done — triggering review`);

    // Gather the diff for this issue
    const diff = await runCommand("fp", ["issue", "diff", issue.id]);
    if (!diff.trim()) {
      fp.log.info(`[codex-review] no diff found for ${issue.id}, skipping`);
      return;
    }

    // Gather comments for context
    const comments = await fp.comments.list(issue.id);
    const commentLog = comments
      .map((c) => `[${c.author}]: ${c.content}`)
      .join("\n");

    // Create a parent issue for follow-ups
    const reviewParent = await fp.issues.create({
      title: `Review follow-ups: ${issue.title}`,
      status: "todo",
      description: `Auto-generated review of ${issue.id} by codex-review extension.`,
    });

    fp.log.info(
      `[codex-review] created follow-up parent ${reviewParent.id}`
    );

    // Build the prompt for codex
    const prompt = buildReviewPrompt(issue, diff, commentLog, reviewParent.id);

    // Run codex CLI to do the review
    try {
      const result = await runCommand("codex", [
        "--approval-mode",
        "full-auto",
        "--full-stdout",
        prompt,
      ]);

      // Log the review as a comment on the original issue
      const summary =
        result.trim().slice(0, 2000) || "Codex review completed (no output).";
      await fp.comments.create(
        issue.id,
        `**Codex Review**\n\n${summary}\n\nFollow-up issues filed under ${reviewParent.id}.`
      );

      fp.log.info(`[codex-review] review complete for ${issue.id}`);
    } catch (err) {
      fp.log.error(
        `[codex-review] codex failed: ${err instanceof Error ? err.message : String(err)}`
      );
      await fp.comments.create(
        issue.id,
        `**Codex Review** failed to run. Error: ${err instanceof Error ? err.message : String(err)}`
      );
    }
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
4. Output a brief summary of your findings.`;
}

function runCommand(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
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
