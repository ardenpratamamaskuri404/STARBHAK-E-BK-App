## Styling Architecture

This project uses **Tailwind CSS v4** (via `@tailwindcss/postcss`) combined with the **shadcn/ui** component library pattern for its frontend styling system. The design follows a token-based approach using CSS custom properties defined in OKLCH color space.

### Core Technologies

- **CSS Framework**: Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- **Component Library Pattern**: shadcn/ui (New York style variant) — not installed as a package, but implemented as copy-paste Radix UI primitives with Tailwind classes
- **Animation Utilities**: `tw-animate-css` for pre-built animation classes
- **Class Composition**: `class-variance-authority` (CVA) for variant-based component styling, `clsx` + `tailwind-merge` via the `cn()` utility for safe class merging
- **Icon Library**: Lucide React (`lucide-react`)
- **Fonts**: Geist Sans + Geist Mono (Google Fonts via `next/font`)

### Design Token System

All design tokens are defined as CSS custom properties in `app/globals.css` using the `@theme inline` directive (Tailwind v4 syntax). Tokens cover:

- **Semantic colors**: `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`
- **Sidebar-specific tokens**: `--sidebar`, `--sidebar-primary`, `--sidebar-accent`, etc.
- **Chart colors**: Five chart-specific color tokens (`--chart-1` through `--chart-5`)
- **Border radius scale**: `--radius-sm`, `--radius-md`, `--radius-lg` (base), `--radius-xl`
- **Dark mode support**: Full dark theme defined under `.dark` selector with inverted OKLCH values

The base color palette uses **neutral** as the base color (per `components.json`), producing a monochrome foundation with OKLCH values for perceptual uniformity.

### Component Styling Patterns

**shadcn/ui components** (`components/ui/`) use CVA variants for polymorphic styling:

- `Button`: Six variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) × five sizes (`sm`, `default`, `lg`, `icon`, `icon-sm`, `icon-lg`)
- All components use the `cn()` utility to merge default classes with user-provided `className` props
- Components include `data-slot` attributes for potential CSS targeting

**Custom components** show mixed patterns:
- `ButtonPrimary.jsx` uses hardcoded hex colors (`#6E8CFB`) instead of design tokens — an inconsistency with the token-based system
- Login page uses inline Tailwind classes with some hardcoded colors (`text-[#0046FF]`, `bg-[#6E8CFB]`)

### File Structure

```
app/
  globals.css          # Global styles, design tokens, Tailwind imports
  layout.js            # Root layout with font variables
components/
  ui/                  # shadcn/ui primitive components (button, card, input, etc.)
  ButtonPrimary.jsx    # Custom branded button (uses hardcoded colors)
  Navbar*.jsx          # Role-specific navigation components
lib/
  utils.js             # cn() utility (clsx + tailwind-merge)
```

### Developer Conventions

1. **Use design tokens, not hardcoded colors**: Prefer `bg-primary`, `text-foreground`, etc. over `bg-[#6E8CFB]`. The existing `ButtonPrimary.jsx` and login page violate this.
2. **Use shadcn/ui primitives**: Import from `@/components/ui/*` for consistent form controls, buttons, cards, avatars, switches, and labels.
3. **Use `cn()` for class merging**: Always use `cn(defaultClasses, className)` pattern when composing component classes to avoid Tailwind class conflicts.
4. **Use CVA for variant components**: When creating polymorphic components, use `cva()` from `class-variance-authority` to define variant/size combinations.
5. **Dark mode**: The `.dark` class on a parent element activates dark theme. Toggle by adding/removing `dark` class on `<html>` or any ancestor.
6. **Font usage**: Access fonts via CSS variables: `var(--font-geist-sans)` and `var(--font-geist-mono)`.
7. **Radius scale**: Use `rounded-sm`, `rounded-md`, `rounded-lg` (default 0.625rem), or `rounded-xl` for consistent corner radii.
