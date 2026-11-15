# Permanent Project Rules & Design Standards: LeadintelAI

> **STATUS:** PERMANENT & NON-NEGOTIABLE  
> **SCOPE:** Entire repository (`leadintelai-main`). Applies to every page, component, stylesheet, script, and future edit.  
> **ENFORCEMENT:** Mandatory pre-commit self-check before outputting or saving code.

---

## 1. Executive Summary & Session Refactor Record

During the visual refactoring and unslopping sessions, the following permanent changes were executed and are locked into the codebase:

1. **Header Consistency & Alignment**:
   - Standardized global headers and navigation capsules across all pages (`index.html`, `login.html`, `whatsapp.html`, `crm.html`, `data.html`, `about.html`, `pricing.html`).
   - Eliminated layout shifts, uneven padding, and floating misalignment. Unified all top navigation into a consistent, stable fixed container.

2. **Query Console & Telemetry Simplification (`data.html`, `glass-theme.css`)**:
   - Permanently removed artificial AI-style widgets: purged `.console-header-viz` floating mini-boxes, artificial equalizer bars, and fake `INTERACTIVE QUERY SIMULATION` tags.
   - Replaced vibrating indicator boxes with an ultra-minimal mathematical harmonic carrier wave on transparent canvas (`#consoleFlowCanvas`) utilizing a Gaussian envelope that tapers cleanly to zero at borders.
   - Removed the "Live Sample" badge. Masked phone telemetry (`+91 98210 •••••`) for a clean, minimal, uncluttered enterprise aesthetic while preserving underlying copy-to-clipboard functionality.
   - Faded and softened secondary text elements (`.person-role-co`, `.dock-subtitle`, `.sector-val`) to establish clear typographic hierarchy.

3. **Liquid Glass & Surface Optical Realism**:
   - Discarded muddy, generic "vibecoded" glassmorphism.
   - Replaced excessive multi-layer backdrop blur and glowing halos with crisp 1px borders (`rgba(255, 255, 255, 0.1)` to `rgba(255, 255, 255, 0.14)`), solid high-contrast dark surfaces (`#0a0d14`, `#0f1420`), and subtle optical specular edge highlights.

---

## 2. Permanent Visual Ban List (Zero Tolerance)

Never introduce, reintroduce, or approve any of the following vibe-coded or AI-generated visual patterns:

| Ban Item | Banned Visual Pattern | Specific Violations |
| :--- | :--- | :--- |
| **NO Neon / Glowing Indicators** | No glowing dots, pulse lights, or radar halos. | Never use `#4ade80`, `#22c55e`, `#00ff00` neon dots. Never use `@keyframes pulse`, `@keyframes ping`, or `box-shadow: 0 0 [N]px` neon aura effects around status beacons. |
| **NO Light, Pastel, or Washed-out Colors** | No washed-out, pastel, or low-contrast tints. | Never use light green (`#86efac`, `#a7f3d0`), light blue / cyan (`#93c5fd`, `#38bdf8`, `#bfdbfe`), light red / pink (`#f87171`, `#fca5a5`), light yellow / amber (`#fbbf24`, `#fde68a`), or pastel lavender (`#ddd6fe`, `#e9d5ff`) across backgrounds, text, badges, borders, or icons. |
| **NO AI Visual Gimmicks** | No purple/indigo/cyan gradients, gradient text, or blur sludge. | Never use purple/indigo/cyan `linear-gradient` (e.g. `#7c3aed`, `#6366f1`, `#8b5cf6`, `#38bdf8`). Never use `-webkit-background-clip: text` gradient text masks. Never use generic `backdrop-filter: blur(24px+)` glassmorphism or multi-stop glowing box-shadow dropshadows (`rgba(124, 58, 237, 0.35)`). |
| **NO Icon or Emoji Clutter** | No decorative emojis or tinted icon background squares. | Never place emojis (`🚀`, `✨`, `⚡`, `📈`, `✅`, `🔥`, `🎯`, `💬`, `💳`) in titles, navigation, buttons, or badges. Never wrap icons in tinted colored background boxes/circles (`rgba(168, 85, 247, 0.1)`, `rgba(59, 130, 246, 0.08)`). |
| **NO Motion Gimmicks** | No bouncy transforms or spring animations. | Never use `transform: scale(1.05)`, `scale(1.5)` or bouncy spring cubic-beziers on hover. Never add unrequested entrance bounce or floating bobbing animations. |

---

## 3. Mandatory Styling Standards for Future Code

All current and future code must adhere strictly to these architectural standards:

### 1. Deep Color Palette Only
Always use deep, rich, high-contrast tones:
- **Green System (Strict Standard)**:
  - **Active Fill / Solid Buttons**: `#065f46` (Deep Forest Green)
  - **Structural Border / Stroke**: `#047857`
  - **High-Contrast Text Accent on Dark Backgrounds**: `#34d399`
  - **Text on Solid `#065f46`**: `#ffffff`
  - **Translucent Tint Background**: `rgba(6, 95, 70, 0.16)` or `rgba(6, 95, 70, 0.2)`
  - **Translucent Tint Border**: `rgba(4, 120, 87, 0.4)`
  - **Zero Neon**: `#4ade80`, `#22c55e`, `#25d366`, `#128c7e`, `#00a884`, `#86efac`, `#a7f3d0` are strictly banned.
- **Saffron System (Mail & Outreach Standard)**:
  - **Active Fill / Solid Buttons**: `#ea580c` (Rich Saffron) / `#c2410c` (Deep Saffron)
  - **Structural Border / Stroke**: `#c2410c` / `#ea580c`
  - **High-Contrast Text Accent on Dark Backgrounds**: `#fb923c` / `#f97316`
  - **Text on Solid Saffron**: `#ffffff`
  - **Translucent Tint Background**: `rgba(234, 88, 12, 0.16)`
  - **Translucent Tint Border**: `rgba(234, 88, 12, 0.4)`
  - **Zero Yellow**: Never use generic yellow, amber, or lemon (`#fbbf24`, `#fcd34d`, `#f59e0b`) on MailEngine surfaces.
- **Blue**: Deep Navy / Slate Blue (`#1e3a8a`, `#1e40af`, `#0f172a`) for primary actions, active tabs, and key brand anchors.
- **Red**: Deep Crimson (`#991b1b`, `#881337`) for errors, cancellations, and destructive states.
- **Yellow / Amber**: Deep Ochre / Dark Gold (`#854d0e`, `#92400e`) for warnings, rate limits, and secondary badges.
- **Neutral Backgrounds**: Solid, deep opaque surfaces (`#0a0d14`, `#0f1420`, `#111827`, `#000000`).

### 2. Solid Surfaces & Crisp 1px Borders
- Replace all translucent blur cards and multi-stop gradient panels with solid, opaque backgrounds.
- Frame all containers, cards, tables, modals, and docks with crisp, structural `1px solid rgba(255, 255, 255, 0.08)` to `1px solid rgba(255, 255, 255, 0.12)` borders.
- Keep elevation flat or use subtle, tight ambient shadows (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5)`).

### 3. Functional Bare Iconography
- Icons must serve a functional purpose (e.g. search, close, filter, sort, copy, chevron navigation, external link).
- Render icons bare on transparent backgrounds without colored backing squares, circles, or tinted frosted pills.
- Icons must use monochromatic or subtle muted stroke fills (`#94a3b8`, `#cbd5e1`, `#ffffff`).

### 4. Strict Structural & Copy Preservation
- **NEVER** alter business logic, API endpoints, backend contracts, database queries, authentication routes, or client-side event handlers.
- **NEVER** change page layout grids, spacing hierarchies, component hierarchies, or written marketing/technical copy unless explicitly directed by the user.

---

## 4. Pre-Commit Self-Check Routine

Before delivering or saving any code, stylesheets, or markup across future tasks, run this mandatory mental and programmatic verification:

```bash
# Verify no forbidden visual patterns were introduced
grep -iE "(pulse-dot|stream-dot|ping|animation:.*pulse|#4ade80|#22c55e|#93c5fd|#38bdf8|#7c3aed|#8b5cf6|backdrop-filter.*blur\(2[0-9]|scale\(1\.0[5-9]\))" <modified_files>
```

1. **Check Indicators**: Are there any neon dots, glowing shadows, or ping animations? → Replace with solid Deep Forest Green (`#065f46`) or Slate (`#334155`).
2. **Check Colors**: Are there any pastel, cyan, or neon colors? → Replace with the corresponding deep color counterpart.
3. **Check Gradients & Glass**: Is there any purple gradient or blur glass? → Replace with solid `#0a0d14` and crisp 1px border.
4. **Check Emojis & Boxes**: Are there any decorative emojis or tinted icon squares? → Strip emojis and render icons bare.
5. **Check Transforms**: Are hover states bouncy? → Replace with standard 150ms opacity/border transitions.
6. **Check Functional Integrity**: Did layout dimensions, backend endpoints, routing, or text copy change? → Keep all non-styling code 100% untouched.
