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
---

<style>
@import './style.css';
</style>

<div class="h-full flex flex-col justify-center">

# Hackable Tools Will Win

</div>

<div class="abs-br m-6 text-sm font-mono opacity-40">
Brett Beutell · @lastgoodhandle
</div>

---

# About Me

<div class="grid grid-cols-[1fr_auto] gap-12 items-center mt-8">

<div>

**Brett Beutell** · Developer @ Fiberplane · Amsterdam

<v-clicks>

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

<div class="mt-4 opacity-60 text-xs">
<TaskLine id="CODX-a3kf9x2z" status="in-progress">prepare this talk</TaskLine>
</div>

---

# Takeaways

<div class="mt-8 space-y-2">

<v-clicks>

- LLMs are better at reviewing code than writing code
- Unlearn your hesitation to write custom code for your tools
- Choose tools that prioritize extensibility, and don't force "one way of doing things"
- **Bonus:** try Codex TypeScript SDK and Desktop App automations

</v-clicks>

</div>

---
layout: center
---

<div class="text-4xl font-semibold tracking-tight leading-snug max-w-3xl text-center">
We are entering an era of personalized software
</div>

---

# The barrier to writing code is extremely low

<div class="mt-12 space-y-2">

<v-clicks>

- AI agents can write plugin and extension code in minutes
- This doesn't mean writing everything yourself
- It means products should support **pluggability** and **extensibility** more than ever

</v-clicks>

</div>

---

# Extensions are feature multipliers

<div class="mt-8">

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

# Why fp is building extensions

<div class="mt-12 space-y-2">

<v-clicks>

- Feedback on "batteries included" features is very workflow-specific
- People want different things — can't ship them all as core
- Solution: let people write their own extensions

</v-clicks>

</div>

---
layout: section
---

# Demo

---

<div class="h-full flex flex-col justify-center">

# Demo 1: Lifecycle extension

<div class="mt-4 text-lg opacity-60">
"Remember to do a code review" — a lifecycle hook that prompts review
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
