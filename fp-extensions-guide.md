# Writing Custom FP Extensions

FP extensions are user-defined automation plugins that hook into the issue and comment lifecycle. They work across both the `fp` CLI (Bun runtime) and the Desktop app (Electron utility process), sharing the same Promise-based API.

## Key Concepts

- Extensions are plain `.ts` / `.js` files — no manifest or `package.json` required
- Export a default `init` function that receives `FpExtensionContext`
- Write normal async/await code — you never interact with Effect directly
- All writes flow through the command layer (validation, activity logging, sync)
- Currently **experimental** — must be enabled via feature flag

## Getting Started

### 1. Enable the feature flag

```bash
fp feature enable experimental_extensions
```

### 2. Create an extension file

Extensions are discovered from two locations:

| Location | Scope |
|----------|-------|
| `~/.fiberplane/extensions/` | Global — available in all projects |
| `<repo>/.fp/extensions/` | Project-local — overrides global by name |

Supported formats:
- Single file: `.ts`, `.js`, `.mts`, `.mjs`
- Directory with index: `my-extension/index.ts`

The extension **name** comes from the filename (e.g., `hello-hooks.ts` → `hello-hooks`).

### 3. Write the extension

```typescript
import type { FpExtensionContext } from "@fiberplane/fp-core";

export default function myExtension(fp: FpExtensionContext) {
  fp.log.info(`[my-extension] loaded on ${fp.runtime}`);

  fp.on("issue:created", ({ issue }) => {
    fp.log.info(`New issue: ${issue.id} — ${issue.title}`);
  });
}
```

That's the entire contract. Save the file and `fp` loads it on next run.

## The Extension API

Every extension receives a single `FpExtensionContext` object:

```typescript
interface FpExtensionContext {
  readonly runtime: "cli" | "desktop";
  readonly projectDir: string;
  readonly on: (event, handler) => void;          // Hook registration
  readonly issues: ExtensionIssueAccessPromise;    // Issue CRUD
  readonly comments: ExtensionCommentAccessPromise; // Comment CRUD
  readonly secrets: ExtensionSecretsAccessPromise;  // OS keychain
  readonly ui: ExtensionUiAccessPromise;            // Desktop actions & toasts
  readonly config: ExtensionConfigAccess;           // Read config.toml
  readonly log: ExtensionLogger;                    // debug/info/warn/error
}
```

### `fp.issues` — Issue CRUD

```typescript
// Create
const issue = await fp.issues.create({
  title: "Follow-up task",
  status: "todo",
  parent: parentIssueId,    // optional
  description: "Details...", // optional
  priority: "high",         // optional
});

// Read
const found = await fp.issues.get("PROJ-42");       // null if not found
const open = await fp.issues.list({ status: "in-progress" });
const children = await fp.issues.list({ parent: issue.id });

// Update
await fp.issues.update(issue.id, { status: "done", title: "New title" });

// Delete
await fp.issues.delete(issue.id);
```

**`ExtensionIssue` shape:**

```typescript
interface ExtensionIssue {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "todo" | "in-progress" | "done";
  priority: "urgent" | "high" | "medium" | "low" | null;
  parent: string | null;
  dependencies: string[];
  author?: string;
  createdAt: string;
  updatedAt: string;
}
```

### `fp.comments` — Comment CRUD

```typescript
await fp.comments.create(issueId, "Auto-generated note");
const comments = await fp.comments.list(issueId);
await fp.comments.delete(comments[0].id);
```

**`ExtensionComment` shape:**

```typescript
interface ExtensionComment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  createdAt: string;
}
```

### `fp.config` — Read config.toml

```typescript
const model = fp.config.get("model", "gpt-4");    // with default
const apiKey = fp.config.get("api_key");           // undefined if not set
```

### `fp.secrets` — OS Keychain

Backed by macOS Keychain / Linux libsecret. No native dependencies.

```typescript
await fp.secrets.set("api-key", "sk-abc123...");
const key = await fp.secrets.get("api-key");       // undefined if not stored
await fp.secrets.delete("api-key");
```

### `fp.ui` — Desktop Actions & Notifications

These are **no-ops in the CLI** — only functional in the Desktop app.

```typescript
// Command palette action
fp.ui.registerAction({
  id: "my-ext:greet",
  label: "Say Hello",
  icon: "hand",                         // Lucide icon name
  keywords: ["hello", "greet"],
  when: (ctx) => !!ctx.issue,           // conditional visibility
  onExecute: async (ctx) => {
    await fp.ui.notify("Hello!", { kind: "success", title: "My Extension" });
  },
});

// Toast notification
await fp.ui.notify("Operation complete", {
  title: "My Extension",               // optional
  kind: "success",                      // "info" | "success" | "warning" | "error"
});
```

### `fp.log` — Structured Logging

```typescript
fp.log.debug("verbose detail");
fp.log.info("normal output");
fp.log.warn("something unexpected");
fp.log.error("something failed");
```

Uses Effect logging internally (goes to stderr). Use `console.log` for messages you want on stdout.

## Lifecycle Hooks

Hooks fire automatically through the command layer. **Pre-hooks** run before the write and can reject. **Post-hooks** are fire-and-forget side effects.

```
Pre-hook (validation) → Write operation → Post-hook (side effects)
```

### Issue Hooks

| Event | Type | Context | Can Reject? |
|-------|------|---------|-------------|
| `issue:creating` | Pre | `{ issue }` | Yes |
| `issue:created` | Post | `{ issue }` | No |
| `issue:updating` | Pre | `{ issue, updates }` | Yes |
| `issue:updated` | Post | `{ issue, updates }` | No |
| `issue:deleting` | Pre | `{ issue }` | Yes |
| `issue:deleted` | Post | `{ issue }` | No |
| `issue:status:changing` | Pre | `{ issue, from, to }` | Yes |
| `issue:status:changed` | Post | `{ issue, from, to }` | No |

### Comment Hooks

| Event | Type | Context | Can Reject? |
|-------|------|---------|-------------|
| `comment:creating` | Pre | `{ issueId, content }` | Yes |
| `comment:created` | Post | `{ comment, issueId }` | No |
| `comment:deleting` | Pre | `{ comment, issueId }` | Yes |
| `comment:deleted` | Post | `{ comment, issueId }` | No |

### Rejecting from Pre-hooks

Return `{ code, message, details? }` to block the operation:

```typescript
fp.on("issue:status:changing", ({ from, to }) => {
  if (from === "backlog" && to === "done") {
    return {
      code: "SKIP_NOT_ALLOWED",
      message: "Cannot skip directly from backlog to done.",
    };
  }
});
```

Post-hooks cannot reject — errors are logged as warnings but don't block the operation.

## Configuration

Extensions read settings from `.fp/config.toml`:

```toml
project_id = "proj_abc123"
prefix = "MYPROJ"

# Per-extension settings
[extensions.my-extension]
model = "gpt-4"
max_retries = "3"
enabled = true              # set false to disable this extension

# Disable ALL extensions for this project
[extensions]
enabled = false
```

## Recipes

### Welcome Comment Bot

```typescript
import type { FpExtensionContext } from "@fiberplane/fp-core";

export default function welcomeBot(fp: FpExtensionContext) {
  fp.on("issue:created", async ({ issue }) => {
    await fp.comments.create(
      issue.id,
      "Thanks for opening this issue! Please add acceptance criteria.",
    );
  });
}
```

### Status Transition Guard

```typescript
import type { FpExtensionContext } from "@fiberplane/fp-core";

export default function transitionGuard(fp: FpExtensionContext) {
  const rules: Record<string, string[]> = {
    backlog: ["todo"],
    todo: ["in-progress", "backlog"],
    "in-progress": ["done", "todo"],
    done: ["todo"],
  };

  fp.on("issue:status:changing", ({ from, to }) => {
    const allowed = rules[from] ?? [];
    if (!allowed.includes(to)) {
      return {
        code: "TRANSITION_BLOCKED",
        message: `Cannot move from ${from} to ${to}. Allowed: ${allowed.join(", ")}`,
      };
    }
  });
}
```

### Slack Notification on Done

```typescript
import type { FpExtensionContext } from "@fiberplane/fp-core";

export default function slackNotify(fp: FpExtensionContext) {
  fp.on("issue:status:changed", async ({ issue, to }) => {
    if (to !== "done") return;

    const webhook = await fp.secrets.get("slack-webhook");
    if (!webhook) return;

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `Issue completed: ${issue.title}` }),
    });
  });
}
```

### Revision Reminder

```typescript
import type { FpExtensionContext } from "@fiberplane/fp-core";

export default function revisionReminder(fp: FpExtensionContext) {
  fp.on("issue:status:changed", ({ issue, to }) => {
    if (to !== "done") return;

    console.log(
      `\n  Reminder: associate a revision with ${issue.id} if you just completed work\n` +
        `  Run: fp issue assign ${issue.id} --rev <commit>\n`,
    );
  });
}
```

## Bundled Examples

The `examples/` directory in the repo contains a teaching ladder:

| # | Example | Difficulty | What it Demonstrates |
|---|---------|-----------|---------------------|
| 1 | `hello-hooks` | Beginner | Logging, post-hooks, welcome comments, config |
| 2 | `status-transition-guard` | Beginner | Pre-hook validation, blocking transitions |
| 3 | `post-create-automation` | Beginner | Conditional automation, child issue creation |
| 4 | `quality-gate` | Intermediate | Config-driven build checks |
| 5 | `backlog-researcher` | Intermediate | Spawning external CLI (`claude`), posting research |
| 6 | `jj-workspace` | Advanced | VCS integration (jj bookmarks/workspaces) |
| 7 | `cursor-agent` | Advanced | Secrets, UI actions, custom fields, polling, notifications |

Copy files from `examples/<name>/.fp/extensions/` into your `.fp/extensions/`. Check each example's `.fp/config.toml` for required config values.

## Dependencies

Extensions can `import` npm packages. Module resolution walks upward from the extension file:

```
<repo>/.fp/extensions/node_modules/   ← checked first
<repo>/.fp/node_modules/
<repo>/node_modules/                  ← project root
```

For global extensions at `~/.fiberplane/extensions/`, resolution starts there and walks up.

To add a dependency, run `bun add <pkg>` from `.fp/extensions/` (or create a `package.json` there and `bun install`).

## Tips & Gotchas

- **Feature flag required** — `fp feature enable experimental_extensions` before anything loads
- **Runtime branching** — `fp.runtime` is `"cli"` or `"desktop"`. UI actions are no-ops in CLI
- **Pre-hook errors reject** the operation. Post-hook errors are logged but don't block
- **Names come from filenames**, not your function name. `my-hook.ts` → extension `my-hook`
- **Desktop isolation** — Extensions run in a separate utility process with crash recovery (max 3 restarts/60s)
- **Command layer safety** — All `fp.issues.*` and `fp.comments.*` calls go through validation and activity logging
- **Kill-switch** — `FP_DISABLE_EXTENSIONS=1` env var force-disables all extensions
- **Project opt-out** — `[extensions] enabled = false` in `.fp/config.toml`
- **No install command yet** — Manage extensions by placing files in the right directory
- **Type hints** — `import type { FpExtensionContext } from "@fiberplane/fp-core"` for autocomplete

## Practical Learnings (from building codex-review)

These were discovered building an extension that spawns Codex CLI to review completed work.

### Shell out for writes, use extension API for reads

`fp.issues.create()` currently has a bug where the yjs_updates table receives a null ID in extension context. `fp.comments.list()` and `fp.issues.get()` work fine. Safe pattern:

```typescript
// Reads — extension API works
const comments = await fp.comments.list(issueId);

// Writes — shell out to fp CLI
await runCommand("fp", ["issue", "create", "--title", "...", "--status", "todo"], fp.projectDir);
await runCommand("fp", ["comment", issueId, "message"], fp.projectDir);
```

### Parse CLI output carefully — log lines go to stdout

fp emits `timestamp=...` log lines on stdout alongside command output. Use specific regexes:

```typescript
// BAD — matches "03-05T08:" from the timestamp
const idMatch = output.match(/(\w+-\w+):/);

// GOOD — matches exactly the issue ID
const idMatch = output.match(/Created issue (CODEX-\w+)/);
```

### Detach long-running child processes

Post-hooks are fire-and-forget. If you spawn something slow (like an LLM CLI), fp may exit first:

```typescript
const proc = spawn("codex", [...args], {
  cwd: fp.projectDir,
  detached: true,
  stdio: "ignore",
});
proc.unref(); // let fp exit without killing the child
```

Since you can't capture stdout from a detached process, have the child self-report — e.g. instruct Codex to run `fp comment <id> "summary"` when done.

### Always set cwd

Pass `fp.projectDir` as `cwd` for all spawned processes so they resolve project-local config and .fp data correctly.

### Be explicit in LLM prompts

When instructing Codex to run fp commands, be extremely specific about argument values. Codex will improvise if given ambiguity — e.g. using `root` as a `--parent` value instead of the actual issue ID.

## Key Source Files

| File | What it contains |
|------|-----------------|
| `packages/fp-core/src/lib/extension-context.ts` | API contracts (`FpExtensionContext`, all interfaces) |
| `packages/fp-core/src/models/extension.ts` | Data models (`ExtensionIssue`, hook contexts, etc.) |
| `packages/fp-core/src/services/extension-service.ts` | Hook emission service |
| `packages/fp-core/src/lib/extension-loader.ts` | Discovery, resolution, loading, bridge layer |
| `packages/fp-core/src/lib/extension-secrets.ts` | OS keychain integration |
| `docs/architecture/extensions.md` | Architecture overview |
