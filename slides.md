---
theme: default
title: Hackable Tools Win
info: |
  A short talk about extensible tools and personalized software
  in the age of AI-generated code.
favicon: https://fav.farm/🔧
drawings:
  persist: false
transition: slide-left
mdc: true
---

<style>
@import './style.css';
</style>

# Hackable Tools Win

The era of personalized software

<div class="abs-br m-6 text-sm">
Brett Beutell · @lastgoodhandle
</div>

---

# About Me

**Brett Beutell** · Developer @ Fiberplane · Amsterdam

- Building `fp` — a CLI task tracker for AI coding agents
- I use Codex + Claude Code together daily
- They surface different bugs, they verify each other's work

---
layout: section
---

# We are entering an era of personalized software

---

# The barrier to writing code is extremely low

- AI agents can write plugin and extension code in minutes
- This doesn't mean writing everything yourself
- It means products should support **pluggability** and **extensibility** more than ever

---

# Hackable tools and harnesses will win

Products that support extensions as first class citizens:

- **Obsidian** — community plugins are the product
- **Pi** — hackable AI assistant
- **fp** — about to release an extension system

---
layout: section
---

# How this relates to Codex

---

# Codex extensibility today

- Extensions protocol WIP — absorbed into MCP and TypeScript SDK
- Hooks still maturing (RFC)
- Current path: expose Codex as MCP + general scripting

---
layout: section
---

# How this relates to me

---

# Why fp is building extensions

- Feedback on "batteries included" features is very workflow-specific
- People want different things — can't ship them all as core
- Solution: let people write their own extensions

---
layout: section
---

# Demo

---

# Demo 1: Lifecycle extension

"Remember to do a code review" — a lifecycle hook that prompts review

---

# Demo 2: Live extension

Real-time notifications or `say` — write an extension live

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
