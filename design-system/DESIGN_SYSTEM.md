# KodNest Premium Build System

**Design Philosophy:** Calm, Intentional, Coherent, Confident

This design system provides a consistent foundation for building premium SaaS interfaces. Every component follows the same principles: no flashy effects, no animation noise, no visual drift.

## Design Principles

1. **Calm** - No gradients, no glassmorphism, no neon colors
2. **Intentional** - Every spacing, color, and type choice has purpose
3. **Coherent** - One mind designed it. No visual drift.
4. **Confident** - Large serif headings, generous spacing, clear hierarchy

## Color System

Maximum 4 colors across the entire system:

- **Background:** `#F7F6F3` (off-white)
- **Primary Text:** `#111111` (near black)
- **Accent:** `#8B0000` (deep red)
- **Success:** `#4A6741` (muted green)
- **Warning:** `#B8860B` (muted amber)

Neutral variations are created through opacity, not additional colors.

## Typography

### Headings
- **Font:** Serif (Georgia, Times New Roman)
- **Size:** Large, confident (48px - 64px for h1)
- **Spacing:** Generous letter-spacing and line-height
- **Weight:** Normal (400), no bold

### Body Text
- **Font:** Clean sans-serif system stack
- **Size:** 16-18px
- **Line Height:** 1.6-1.8
- **Max Width:** 720px for text blocks

## Spacing System

Consistent 8px scale. Never use random spacing.

- `8px` (--space-1)
- `16px` (--space-2)
- `24px` (--space-3)
- `32px` (--space-4)
- `40px` (--space-5)
- `48px` (--space-6)
- `64px` (--space-8)

## Global Layout Structure

Every page follows this structure:

```
[Top Bar]
  ├─ Left: Project name
  ├─ Center: Progress indicator (Step X / Y)
  └─ Right: Status badge

[Context Header]
  ├─ Large serif headline
  └─ 1-line subtext

[Primary Workspace (70%) + Secondary Panel (30%)]
  ├─ Primary: Main product interaction
  └─ Secondary: Step explanation, copyable prompt, actions

[Proof Footer]
  └─ Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed
```

## Components

### Buttons
- **Primary:** Solid deep red background, white text
- **Secondary:** Outlined, deep red border
- **Hover:** Same effect everywhere (slightly darker)
- **Border Radius:** 6px (--radius-md)
- **Transition:** 150ms ease-in-out

### Inputs
- Clean borders (no heavy shadows)
- Clear focus state (accent border + subtle shadow)
- Border radius: 6px
- Padding: 16px vertical, 24px horizontal

### Cards
- Subtle border (no drop shadows)
- Balanced padding (40px)
- Border radius: 8px (--radius-lg)
- White background

### Badges
- Uppercase, small font
- Letter-spacing: 0.05em
- Subtle background colors
- Border radius: 4px

## Interaction Rules

- **Transitions:** 150-200ms, ease-in-out
- **No bounce:** No spring animations
- **No parallax:** No scroll effects
- **Focus states:** Clear, consistent (2px accent outline)

## Error & Empty States

### Error States
- Explain what went wrong
- Provide how to fix it
- Never blame the user
- Use accent color for emphasis

### Empty States
- Provide next action
- Never feel dead
- Clear call-to-action

## Usage

Import the main CSS file:

```html
<link rel="stylesheet" href="design-system/index.css">
```

Or in your build system:

```css
@import './design-system/index.css';
```

## File Structure

```
design-system/
├── tokens.css      # Design tokens (colors, typography, spacing)
├── base.css        # Global reset and foundational styles
├── components.css  # Reusable component styles
├── layout.css      # Layout structure components
├── index.css       # Main entry point
└── DESIGN_SYSTEM.md # This documentation
```

## Consistency Rules

1. **Same hover effect everywhere** - All interactive elements use the same transition timing
2. **Same border radius** - Buttons use --radius-md, cards use --radius-lg
3. **Same spacing scale** - Always use the 8px scale, never random values
4. **Same color usage** - Maximum 4 colors, use opacity for variations
5. **Same typography** - Serif for headings, sans-serif for body, consistent sizes

Everything must feel like one mind designed it. No visual drift.
