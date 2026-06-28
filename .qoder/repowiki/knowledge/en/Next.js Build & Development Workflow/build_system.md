The project uses a standard **Next.js** build system managed via **npm**. There are no containerization tools (Docker), CI/CD pipelines, or complex build scripts (Makefiles) present. The build process relies entirely on the Next.js CLI and standard Node.js tooling.

### Build & Development Commands
- **Development**: `npm run dev` starts the Next.js development server with hot-reloading.
- **Production Build**: `npm run build` compiles the application for production, optimizing assets and generating static/dynamic routes.
- **Production Start**: `npm run start` serves the built application.
- **Linting**: `npm run lint` runs ESLint with Next.js core web vitals configuration.

### Database Seeding
A custom seed script (`seed.js`) is used to populate the MySQL database with initial admin, teacher, and student accounts. It uses `bcryptjs` for password hashing and `mysql2` for database interaction. This script is executed manually via `node seed.js` (implied, as no specific npm script is defined for it in `package.json`).

### Configuration & Tooling
- **Next.js Config**: `next.config.mjs` configures image handling, specifically setting `unoptimized: true` to support local image serving without external optimization services.
- **Styling**: Uses **Tailwind CSS v4** with `@tailwindcss/postcss` for processing styles.
- **Linting**: Configured via `eslint.config.mjs` extending `eslint-config-next/core-web-vitals`.
- **Environment**: Relies on `.env` for database credentials and other secrets, loaded via `dotenv` in the seed script and likely by Next.js automatically for runtime config.

### Deployment
The `README.md` suggests deployment on the **Vercel Platform**, which is the native hosting environment for Next.js applications. No other deployment strategies (e.g., Docker, Kubernetes, traditional VPS) are configured or documented.