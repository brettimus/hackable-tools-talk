# CLAUDE.md

## fp workflow

@.fp/FP_CLAUDE.md

### notifications

you have a script you can run (`bun run scripts/poke.ts`) in order to ping me with updates after finishing milestones (no need after every task - just when something big has been achieved, like a draft is done, or updates are ready for review in some capacity, or when you are proud of your work

## Visual Iteration with agent-browser

Use agent-browser to inspect and iterate on slide design visually.

### Setup

The `agent-browser` skill is installed globally. No additional setup required.

### Workflow

1. **Build slides** (required - dev server doesn't stay running in background):
   ```bash
   bun run build
   ```

2. **Serve the built slides**:
   ```bash
   cd dist && python3 -m http.server 3031 &
   ```

3. **Open in agent-browser**:
   ```bash
   agent-browser open http://localhost:3031
   ```

4. **Inspect slides**:
   ```bash
   agent-browser snapshot -i          # Get interactive elements with refs
   agent-browser screenshot slide.png # Take screenshot for visual review
   agent-browser click @e3            # Navigate (e3 = next slide button)
   ```

5. **Close when done**:
   ```bash
   agent-browser close
   ```

### Navigation Refs

- `@e1` - Enter fullscreen
- `@e2` - Previous slide
- `@e3` - Next slide
- `@e4` - Show overview
- `@e5` - Toggle dark mode
