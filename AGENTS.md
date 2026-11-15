# Antigravity Agent Directives: LeadintelAI Project

> **PERMANENT RULES & DESIGN STANDARDS**  
> Reference: [PROJECT_RULES.md](file:///Users/gauravyadav/Project's/Webpage%20LeadintelAI/leadintelai-main/PROJECT_RULES.md)

## 1. Permanent Visual Ban List
Never use or introduce any of the following patterns:
1. **No Neon / Glowing Indicators**: Never use neon green dots (`#4ade80`, `#22c55e`), pulse animations (`@keyframes pulse`, `ping`), or glowing indicator circles with box-shadow glows.
2. **No Light, Pastel, or Washed-Out Colors**: Never use light green, light blue, cyan (`#38bdf8`), pastel lavender, light yellow, or pastel pink on backgrounds, text, badges, borders, or icons.
3. **No AI Visual Gimmicks**: Never use purple/indigo/cyan gradients (`linear-gradient` with `#7c3aed`, `#6366f1`), gradient text (`-webkit-background-clip: text`), translucent glassmorphism (`backdrop-filter: blur`), or glowing box shadows.
4. **No Icon or Emoji Clutter**: Never place emojis in the interface. Never wrap icons inside tinted background boxes or circles (`rgba(...)`).
5. **No Motion Gimmicks**: Never add bouncy hover scale transforms (`scale(1.05)`) or unrequested entrance animations.

## 2. Mandatory Styling Standards
1. **Deep Color Palette Only**:
   - Deep forest green (`#065f46`, `#047857`) for verified badges, success indicators, and positive states. High-contrast text accent on dark backgrounds: `#34d399`. Solid fills: `#065f46` with `#047857` border and `#ffffff` text. Tint: `rgba(6, 95, 70, 0.16)`.
   - Rich Saffron (`#ea580c`, `#c2410c`, text `#fb923c`, tint `rgba(234, 88, 12, 0.16)`) for MailEngine and cold email outreach surfaces in place of yellow.
   - Deep navy or slate blue (`#1e3a8a`, `#1e40af`, `#0f172a`) for primary actions, active tabs, and brand anchors.
   - Deep crimson (`#991b1b`, `#881337`) for error states and destructive actions.
   - Deep ochre or dark gold (`#854d0e`, `#92400e`) for warnings and secondary metrics.
2. **Solid Surfaces**: Always use solid, opaque backgrounds (`#0a0d14`, `#0f1420`, `#111827`) with crisp 1px borders (`1px solid rgba(255, 255, 255, 0.1)`) and flat elevation.
3. **Functional Icons Only**: Use bare, sharp icons only for clear actions (search, close, filter, sort, copy, navigation) on transparent backgrounds.
4. **Preserve Existing Structure**: When editing existing files, never alter business logic, routing, layout dimensions, component hierarchy, or written copy unless explicitly instructed.

## 3. Mandatory Pre-Commit Self-Check
Before outputting or saving any code in this repository:
- Scan all changes against the ban list.
- Replace any detected light color, neon dot, gradient, blur, emoji, tinted icon box, or glowing shadow with approved deep colors and solid 1px border patterns.
- Confirm zero functional or structural regressions.
