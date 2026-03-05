---
theme: default
title: Claude Really Wants a Task Manager
info: |
  A talk about agent-native task management tools
  and how they improve AI coding workflows.
favicon: https://fav.farm/🤖
drawings:
  persist: false
transition: slide-left
mdc: true
---

<style>
@import './style.css';
</style>

# Claude *Really* Wants a Task Manager

<div class="abs-br m-6 text-sm">
Brett Beutell · @lastgoodhandle
</div>

<!--
Welcome everyone! Today I want to show you something a bit different...
-->

---

# What Would Claude Build?

<div class="text-center mt-12">

<div class="text-xl opacity-80 leading-relaxed max-w-2xl mx-auto">

If you ask Claude to build a tool for itself to be more effective,

you will end up with a **task manager**.

</div>

</div>

<v-click>

<div class="mt-12 text-center opacity-60">

Let's find out why.

</div>

</v-click>

<!--
What would Claude build for itself? Task management. Every time.
It's not a coincidence - it's a necessity.
-->

---

# About Me

<div class="grid grid-cols-2 gap-8 mt-6">

<div class="flex flex-col justify-center">

<div class="text-2xl font-semibold mb-2">Brett Beutell</div>

<div class="text-lg opacity-80 mb-6">Developer @ Fiberplane · Amsterdam</div>

<div class="space-y-3 text-sm">

<div class="flex items-center gap-3">
<span class="text-lg">𝕏</span>
<a href="https://twitter.com/lastgoodhandle" target="_blank">@lastgoodhandle</a>
</div>

<div class="flex items-center gap-3">
<mdi-github class="text-lg" />
<a href="https://github.com/brettimus" target="_blank">@brettimus</a>
</div>

<div class="flex items-center gap-3">
<span class="text-lg">in</span>
<a href="https://linkedin.com/in/brettbeutell" target="_blank">in/brettbeutell</a>
</div>

</div>

</div>

<div class="flex items-center justify-center">

<div class="p-6 bg-neutral-800 rounded-xl text-center">
<div class="text-4xl mb-3">⚡</div>
<div class="text-xl font-semibold mb-1">Fiberplane</div>
<div class="text-sm opacity-70">fp.dev</div>
</div>

</div>

</div>

<!--
I'm Brett, I work at Fiberplane. We built fp, the task manager I'll be showing you today.
-->

---

# Meta Demo

<div class="mt-8">

**A Claude Code agent built this presentation, tracking its work with `fp`**

</div>

<v-click>

<TerminalOutput title="fp tree">
  <TaskLine id="CCTA-vojsagkz" status="in-progress">Meta demo opening</TaskLine>
  <TaskLine id="CCTA-fogpceik" status="todo">Plan → Execute → Review slides</TaskLine>
  <TaskLine id="CCTA-pqcfzgfs" status="todo">Agent-native task managers</TaskLine>
  <TaskLine id="CCTA-bulmdiry" status="done">Initialize Slidev + Bun</TaskLine>
</TerminalOutput>

</v-click>

<!--
This is actual output from fp tree, right now.
I'm not just talking about task managers - I'm using one to build this talk.
-->

---
layout: section
---

# Pain Point 1

Ambitious work requires multiple Claude Code sessions

<!--
Let's start with the first problem you'll hit when doing real work with Claude Code.
-->

---

# Why Multiple Sessions?

<div class="grid grid-cols-3 gap-4 mt-6">

<v-click>

<div class="p-4 bg-neutral-800 rounded-lg text-center">

**Context is finite**

Performance degrades as you add more

</div>

</v-click>

<v-click>

<div class="p-4 bg-neutral-800 rounded-lg text-center">

**Compaction isn't great**

Getting better, but lossy

</div>

</v-click>

<v-click>

<div class="p-4 bg-neutral-800 rounded-lg text-center">

**Wrong turns happen**

Dead ends deserve documentation

</div>

</v-click>

</div>

<v-click>

<div class="mt-8 p-4 bg-orange-500/10 rounded-lg text-center">

**Any ambitious project spans multiple sessions**

</div>

</v-click>

<!--
Context windows are finite. Eventually you need to start fresh.
But how do you carry forward what you learned?
-->

---

# Current Solutions

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="p-4 bg-neutral-800 rounded-lg">

### SPEC files

Track goals across sessions

```
SPEC.md
├── Goals
├── Architecture decisions
└── Current status
```

</div>

<v-click>

<div class="p-4 bg-neutral-800 rounded-lg">

### Dev logs

Record design decisions and reasoning

```
DEV_LOG.md
├── 2024-01-15: Tried X, failed
├── 2024-01-16: Approach Y works
└── 2024-01-17: Refactored Z
```

</div>

</v-click>

</div>

<v-click>

<div class="mt-6 text-center opacity-70">

These help... but they're not quite right

</div>

</v-click>

<!--
People have invented solutions. SPEC files, dev logs, context docs.
They work, to a point.
-->

---

# The Problems

<div class="grid grid-cols-2 gap-6 mt-6">

<v-click>

<div class="p-4 bg-red-500/10 rounded-lg">

### Codebase clutter

- SPEC.md, PLAN.md, TODO.md, DEV_LOG.md
- Which one is current?
- Do you commit them?

</div>

</v-click>

<v-click>

<div class="p-4 bg-red-500/10 rounded-lg">

### Lost explorations

- Failed approaches don't survive squash
- "Why didn't we do X?" - no record
- Reasoning evaporates

</div>

</v-click>

</div>

<v-click>

<div class="mt-6 p-4 bg-yellow-500/10 rounded-lg text-center">

**We need structured persistence, not scattered docs**

</div>

</v-click>

<!--
The core problem: these ad-hoc solutions don't scale.
They clutter your repo and still lose information.
-->

---
layout: section
---

# Pain Point 2

Reviewing massive Claude PRs is hard

<!--
The second problem hits when you need to verify what Claude actually built.
-->

---

# Claude Makes Mistakes

<div class="grid grid-cols-2 gap-6 mt-6">

<v-click>

<div class="p-4 bg-red-500/10 rounded-lg">

### Common issues

- Doesn't delete dead code
- Creates unnecessary abstractions
- Cheats on tests (mocks everything)
- Misunderstands requirements

</div>

</v-click>

<v-click>

<div class="p-4 bg-neutral-800 rounded-lg">

### The review wall

Most tools show a wall of diffs

```diff
+ 47 files changed
+ 2,341 insertions
+ 891 deletions
```

Good luck finding the bug.

</div>

</v-click>

</div>

<v-click>

<div class="mt-6 p-4 bg-orange-500/10 rounded-lg text-center">

**You can't trust agent code you can't review**

</div>

</v-click>

<!--
Claude is good but not perfect. The problem is validating what it produced.
When you're staring at 47 changed files, how do you know what to check?
-->

---

# An Open Problem

<div class="mt-8 text-center">

<div class="text-xl opacity-80 mb-8">

No one has cracked this yet... but progress is happening

</div>

</div>

<div class="grid grid-cols-2 gap-6">

<v-click>

<div class="p-4 bg-blue-500/10 rounded-lg">

### Narrative-based review

- Devin-style PR summaries
- Per-task diffs (fp, Vibe Kanban)
- Stories, not just code

</div>

</v-click>

<v-click>

<div class="p-4 bg-purple-500/10 rounded-lg">

### Structured commits

- Link commits to tasks
- Review by intention
- Trace reasoning

</div>

</v-click>

</div>

<v-click>

<div class="mt-6 text-center opacity-70">

This is where task managers start to help

</div>

</v-click>

<!--
This is genuinely an open problem. But the insight is: review by task, not by PR.
That's what task managers enable.
-->

---
layout: section
---

# What Task Managers Solve

The core capabilities that address these pain points

<!--
Now let's look at what task managers actually provide.
-->

---

# Four Key Capabilities

<div class="grid grid-cols-2 gap-6 mt-6">

<v-click>

<div class="p-4 bg-blue-500/10 rounded-lg">

### External plan storage

Plans and sub-tasks live outside the context window

</div>

</v-click>

<v-click>

<div class="p-4 bg-green-500/10 rounded-lg">

### Exploration docs

Document what you tried - including failures

</div>

</v-click>

<v-click>

<div class="p-4 bg-purple-500/10 rounded-lg">

### Clean context resets

Clear window, load next task's context

</div>

</v-click>

<v-click>

<div class="p-4 bg-orange-500/10 rounded-lg">

### Intent-to-code linking

Natural language intent tied to commits

</div>

</v-click>

</div>

<v-click>

<div class="mt-6 text-center text-lg">

**These capabilities work together to create persistent, structured memory**

</div>

</v-click>

<!--
Four capabilities that matter. External storage, exploration docs, clean resets, and intent linking.
Together they give your agent a memory that survives context windows.
-->

---
layout: section
---

# What Solutions Exist

From built-in to purpose-built

<!--
Let's look at what's out there for agent-native task management.
-->

---

# The Landscape

<div class="grid grid-cols-2 gap-6 mt-4">

<div class="p-4 bg-neutral-800 rounded-lg">

### Claude Code (built-in)

<v-click>

**Pros:** Works out of the box, no plugins

</v-click>

<v-click>

**Cons:** No persistence across sessions, no visualization

</v-click>

</div>

<div class="p-4 bg-neutral-800 rounded-lg">

### Beads

<v-click>

**Pros:** External storage, sync, Claude uses it well

</v-click>

<v-click>

**Cons:** Wild west integration, bring your own review tools

</v-click>

</div>

</div>

<!--
Two ends of the spectrum: built-in TodoWrite vs external tools like Beads.
Both have tradeoffs.
-->

---

# More Options

<div class="grid grid-cols-2 gap-6 mt-4">

<div class="p-4 bg-neutral-800 rounded-lg">

### fp

<v-click>

**Pros:** External storage + integrated review tooling

</v-click>

<v-click>

**Cons:** Smaller community, cloud sync requires account

</v-click>

</div>

<div class="p-4 bg-neutral-800 rounded-lg">

### Others

<v-click>

- **Taskmaster** - PRD to tasks
- **Vibe Kanban** - Multi-agent, per-task diffs
- **Beans** - Flat-file, token-efficient

</v-click>

<v-click>

*Many more emerging weekly*

</v-click>

</div>

</div>

<v-click>

<div class="mt-6 p-4 bg-blue-500/10 rounded-lg text-center">

**No "best" tool - they all solve the core problem differently**

</div>

</v-click>

<!--
fp is what I use (disclaimer: I work on it). But there are many good options.
The space is evolving rapidly.
-->

---
layout: section
---

# Which Should You Use?

<!--
The million dollar question.
-->

---

# Explore What's Out There

<div class="mt-8 text-center">

<div class="text-xl opacity-80 mb-8">

There's no "best" tool - find what fits your workflow

</div>

</div>

<div class="grid grid-cols-3 gap-4 mt-6 text-center text-sm">

<v-click>

<div class="p-4 bg-blue-500/10 rounded-lg">

**Try a few**

Each has different strengths

</div>

</v-click>

<v-click>

<div class="p-4 bg-green-500/10 rounded-lg">

**Match your style**

CLI-first? Visual? PRD-driven?

</div>

</v-click>

<v-click>

<div class="p-4 bg-purple-500/10 rounded-lg">

**Iterate**

Switch if something isn't working

</div>

</v-click>

</div>

<v-click>

<div class="mt-8 text-center opacity-70">

The important thing is having *some* structure for your agent's memory

</div>

</v-click>

<!--
My honest advice: try a few and see what clicks.
The space is young and evolving fast.
-->

---
layout: center
---

<div class="text-center">

# Thank You

<div class="mt-6 text-lg">

**Brett Beutell** · Developer @ Fiberplane · Amsterdam

</div>

<div class="flex justify-center gap-6 mt-6 text-sm">

<a href="https://twitter.com/lastgoodhandle" target="_blank" class="flex items-center gap-2 opacity-70 hover:opacity-100 no-underline">
<span>𝕏</span> @lastgoodhandle
</a>

<a href="https://github.com/brettimus" target="_blank" class="flex items-center gap-2 opacity-70 hover:opacity-100 no-underline">
<mdi-github /> @brettimus
</a>

<a href="https://linkedin.com/in/brettbeutell" target="_blank" class="flex items-center gap-2 opacity-70 hover:opacity-100 no-underline">
<span>in</span> brettbeutell
</a>

</div>

<v-click>

<div class="mt-10 p-4 bg-neutral-800 rounded-lg inline-block text-sm opacity-80">

*Built by Claude Code, tracked with fp*

<a href="https://github.com/brettimus/cc-task-managers-talk" target="_blank" class="block mt-2 opacity-70 hover:opacity-100 no-underline">
View the code →
</a>

</div>

</v-click>

</div>

<!--
Thank you! This talk was built by Claude Code using fp.
Happy to chat about agent workflows, task managers, or how this was made.
-->
