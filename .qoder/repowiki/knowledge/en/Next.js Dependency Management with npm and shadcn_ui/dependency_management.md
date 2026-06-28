## Overview
The project uses **npm** as its primary package manager for dependency management, leveraging `package.json` for declaration and `package-lock.json` for version locking. It is a **Next.js 16** application (using React 19) built with JavaScript (JSX), not TypeScript.

## Key Files
- **`package.json`**: Defines all production and development dependencies. The project is marked as `"private": true`, preventing accidental publication to the public npm registry.
- **`package-lock.json`**: Ensures deterministic builds by locking dependency versions. It uses `lockfileVersion: 3`, compatible with npm v7+.
- **`components.json`**: Configuration file for **shadcn/ui**, a component library that copies code directly into the project rather than installing it as a traditional node_module dependency. This affects how UI dependencies are managed and updated.
- **`next.config.mjs`**: Contains Next.js-specific configuration, including image optimization settings (`unoptimized: true` for local images), which influences how static assets and remote patterns are handled.

## Architecture and Conventions
### Dependency Strategy
1. **Public Registry**: All dependencies are resolved from the public npm registry (`https://registry.npmjs.org`). There is no evidence of private registries, vendoring, or GOPRIVATE-like configurations.
2. **shadcn/ui Integration**: The project uses `shadcn/ui` for UI components (e.g., `@radix-ui/react-avatar`, `lucide-react`). Instead of importing from a single large library, shadcn/cli installs individual Radix UI primitives and utility libraries (`clsx`, `tailwind-merge`, `class-variance-authority`) as direct dependencies. This means UI updates require manual intervention via the shadcn CLI or manual code updates, rather than a simple `npm update`.
3. **Next.js App Router**: The project uses the Next.js App Router (`app/` directory), which influences dependency choices like `next-auth` for authentication and `mysql2` for direct database access in API routes.

### Key Dependencies
- **Framework**: `next@16.0.3`, `react@19.2.0`, `react-dom@19.2.0`
- **Database**: `mysql2@^3.15.3` (direct MySQL driver)
- **Authentication**: `next-auth@^4.24.13`, `bcryptjs@^3.0.3`
- **UI/Styling**: `tailwindcss@^4`, `@radix-ui/*` primitives, `lucide-react`, `framer-motion`
- **Utilities**: `axios`, `zod` (validation), `@react-pdf/renderer` (PDF generation), `uploadthing` (file uploads)

## Rules for Developers
1. **Use npm**: Always use `npm install <package>` to add dependencies. Do not use yarn or pnpm, as the lockfile is npm-specific.
2. **Lockfile Commitment**: Always commit `package-lock.json` to version control to ensure consistent environments across development and production.
3. **shadcn/ui Updates**: To update UI components, use the shadcn CLI (`npx shadcn@latest add <component>`) or manually update the copied component files in `components/ui/`. Do not expect automatic updates via `npm update` for these components.
4. **Private Project**: The `"private": true` flag in `package.json` prevents accidental publishing. Do not remove this flag unless intending to publish the package.
5. **Environment Variables**: Sensitive configuration (like database credentials) should be managed via `.env` files (ignored by git via `.gitignore`), not hardcoded in dependencies or source code.
