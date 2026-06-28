## Configuration System Overview

This School Counseling Management System uses a **flat environment-variable-driven configuration** approach typical of Next.js applications, with no dedicated configuration framework or layered config management.

### What System/Approach Is Used

- **Primary mechanism**: `.env` file for all runtime secrets and connection strings
- **Next.js built-in env handling**: `process.env.*` accessed directly in server-side code (API routes, middleware, lib modules)
- **No config loader library**: No dotenv explicit import, no config module pattern — relies on Next.js automatic `.env` loading
- **No feature flags or runtime config toggles**: All behavior is hardcoded; no dynamic configuration at runtime
- **No secrets manager**: Credentials stored in plaintext `.env` (no Vault, AWS Secrets Manager, etc.)

### Key Files and Packages

| File | Purpose |
|------|---------|
| `.env` | Single source of truth for all environment variables: DB credentials (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DATABASE_URL`), NextAuth secrets (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`) |
| `next.config.mjs` | Next.js build/runtime config: image remote patterns, unoptimized local images |
| `lib/database.js` | Reads `process.env.DB_*` to create MySQL connection pool via `mysql2` |
| `lib/auth.js` | Reads `process.env.NEXTAUTH_SECRET` for JWT signing; has a hardcoded fallback secret as safety net |
| `middleware.js` | Reads `process.env.NEXTAUTH_SECRET` for token verification; defines role-based route protection rules |
| `jsconfig.json` | Module resolution aliases (`@/*` → project root) |
| `components.json` | shadcn/ui component library configuration (style, paths, Tailwind integration) |
| `package.json` | Dependency versions; no config-related scripts beyond standard Next.js commands |

### Architecture and Conventions

1. **Flat env structure**: All 9 environment variables live in a single `.env` file with no grouping, no comments explaining purpose, and no environment-specific overrides (e.g., no `.env.production`, `.env.local`).

2. **Direct `process.env` access**: Configuration values are read inline wherever needed:
   - `lib/database.js` reads `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - `lib/auth.js` reads `NEXTAUTH_SECRET`
   - `middleware.js` reads `NEXTAUTH_SECRET`
   There is no centralized config module that exports typed/configured constants.

3. **Dual DB URL pattern**: Both individual fields (`DB_HOST`, etc.) and a composite `DATABASE_URL` exist in `.env`, but only the individual fields are actually used by `lib/database.js`. The `DATABASE_URL` appears unused/dead configuration.

4. **Hardcoded fallback for auth secret**: `lib/auth.js` line 74 provides a fallback string if `NEXTAUTH_SECRET` is missing — a dangerous pattern that could silently degrade security in production.

5. **Role-based routing in middleware**: Access control rules (which paths require which roles) are hardcoded in `middleware.js` rather than driven by configuration. Adding a new role requires code changes, not config updates.

6. **No validation layer**: Environment variables are consumed without schema validation (no Zod, no `envalid`, no runtime checks for required vars). Missing vars result in `undefined` being passed to MySQL driver or NextAuth, causing runtime failures.

### Rules Developers Should Follow

1. **Never commit `.env`**: The `.gitignore` should exclude `.env` (verify this is enforced). Use `.env.example` with placeholder values for onboarding.

2. **Add new env vars to `.env` only**: Do not hardcode secrets or connection strings in source files. Always use `process.env.VAR_NAME`.

3. **Create a centralized config module** (recommended improvement): Instead of scattering `process.env` reads across files, create `lib/config.js` that validates and exports all configuration values at startup. This makes it easy to audit what config the app depends on.

4. **Remove the hardcoded auth secret fallback**: The fallback in `lib/auth.js` should be removed. If `NEXTAUTH_SECRET` is missing, the app should fail fast with a clear error message.

5. **Use environment-specific env files**: Adopt `.env.local` (gitignored, overrides), `.env.production`, `.env.development` patterns supported by Next.js for multi-environment deployments.

6. **Validate required env vars at startup**: Add a check in a top-level file (e.g., `lib/config.js` imported early) that throws if critical vars like `DB_HOST`, `NEXTAUTH_SECRET` are missing or empty.

7. **Clean up dead config**: Remove `DATABASE_URL` from `.env` if it is not used, or migrate `lib/database.js` to use it via a connection string parser.

8. **Document each env var**: Add comments in `.env` or a separate `ENV.md` explaining the purpose, format, and whether each variable is required.