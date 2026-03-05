---
theme: default
title: Hackable Tools Will Win
info: |
  A short talk about extensible tools and personalized software
  in the age of AI-generated code.
favicon: https://fav.farm/🔧
drawings:
  persist: false
transition: slide-left
mdc: true
canvasWidth: 840
---

<style>
@import './style.css';
</style>

<div class="h-full flex flex-col justify-center">

# Hackable Tools Will Win

<img src="/qr-talk.svg" class="w-52 h-52 mt-6 opacity-80 ml-auto" />

</div>

<div class="abs-br m-6 text-sm font-mono opacity-60">
Brett Beutell · @lastgoodhandle
</div>

---

# tl;dr

<div class="mt-8 space-y-2">

<v-clicks>

- LLMs are better at reviewing code than writing code
- Choose tools that prioritize extensibility
- Try Codex Desktop App automations (and TypeScript SDK)
- Demos to show all of this

</v-clicks>

</div>

---

# About Me

<div class="mt-2 opacity-60 text-xs">
<TaskLine id="CODX-a3kf9x2z" status="in-progress">prepare this talk</TaskLine>
</div>

<div class="grid grid-cols-[1fr_auto] gap-12 items-center mt-2">

<div>

<v-clicks>

**Brett Beutell** · Developer @ Fiberplane · Amsterdam

- Building `fp` — a CLI task tracker for AI coding agents
- I use Codex + Claude Code together daily
- They surface different bugs, they verify each other's work

</v-clicks>

</div>

<div class="flex flex-col items-center gap-3">
<img src="/fp-logo.png" class="w-24 h-24 rounded-2xl shadow-lg" />
<a href="https://fp.dev" target="_blank" class="text-sm opacity-70 hover:opacity-100 no-underline font-mono">fp.dev</a>
</div>

</div>

---
layout: center
---

<div class="text-4xl font-semibold tracking-tight leading-snug max-w-3xl text-center">
We are entering an era of personalized software
</div>

<v-click>

<div class="mt-6 text-xl opacity-60 text-center">
Everyone is a power user now
</div>

</v-click>

---

# The barrier to writing code is extremely low

<div class="mt-12 space-y-2">

<v-clicks>

- AI agents can write plugin and extension code in minutes
- This doesn't mean replacing all SaaS (ignore the clickbait)
- It means products should support **pluggability** and **extensibility** more than ever

</v-clicks>

</div>

---

# Extensions are feature multipliers

<div class="mt-8">

A robust extension ecosystem lets small teams support a vast number of use cases.

Products that support extensions as first class citizens:

<div class="mt-6 space-y-2">

<v-clicks>

- **Obsidian** — community plugins are the product
- **Pi** — hackable agent harness competing successfully with major labs
- **fp.dev** — extensions coming soon!

</v-clicks>

</div>

</div>

---
layout: center
---

<div class="text-4xl font-semibold tracking-tight">
How this relates
</div>

---

# I can map my workflow to my tool

<div class="mt-2 text-lg opacity-60">My tool does not force me into a workflow</div>

<div class="mt-8 space-y-2">

<v-clicks>

- I use `fp` to track tasks that Codex works on
- I usually have another agent do code review
- Reviewer tracks all feedback in a separate ticket
- Later, I can look at all the code reviews we've done in a month
- Codex can find common error patterns we should fix upstream, in AGENTS.md

</v-clicks>

</div>

<v-click>

<div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-lg">
We thought of making this a feature for fp. Instead: it's an extension I can build in 5–10 minutes myself.
</div>

</v-click>

---
layout: section
---

# Demo

---

<div class="h-full flex flex-col justify-center">

# Demo 1: Always review your code

<div class="mt-4 text-lg opacity-60">
After completing a task, invoke Codex via command line to review and file findings under a new tracking ticket
</div>

</div>

---

<div class="h-full flex flex-col justify-center">

# Demo 2: Live extension

<div class="mt-4 text-lg opacity-60">
Real-time notifications or <code>say</code> — write an extension live
</div>

</div>

---

<div class="h-full flex flex-col justify-center">

# Demo 3: Codex automations

<div class="mt-4 text-lg opacity-60">
Recursively improve your setup with Codex desktop app automations
</div>

</div>

---
layout: center
---

<img src="/codex-automations-screenshot.png" class="rounded-xl w-full max-w-2xl object-contain shadow-lg" />

---
layout: center
---

# Thank You

**Brett Beutell** · Developer @ Fiberplane · Amsterdam

<div class="flex justify-center gap-6 mt-6 text-sm">

<a href="https://twitter.com/lastgoodhandle" target="_blank" class="flex items-center gap-2 opacity-70 hover:opacity-100 no-underline">
𝕏 @lastgoodhandle
</a>

<a href="https://github.com/brettimus" target="_blank" class="flex items-center gap-2 opacity-70 hover:opacity-100 no-underline">
GitHub @brettimus
</a>

</div>
