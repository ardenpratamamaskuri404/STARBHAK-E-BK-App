## Overview

This Next.js application uses an **informal, ad-hoc error handling approach** without a centralized error management system. Error handling is implemented through scattered `try/catch` blocks in API route handlers and client-side components, with errors returned as inline JSON responses using `NextResponse.json()`.

## System/Approach Used

### Backend (API Routes)
- **Pattern**: Every API route handler wraps logic in `try/catch` blocks
- **Error Response Format**: `NextResponse.json({ error: "message" }, { status: <code> })`
- **HTTP Status Codes Used**:
  - `400` — Validation failures (missing fields, duplicate entries)
  - `401` — Unauthorized access (role mismatch, missing session)
  - `404` — Resource not found
  - `409` — Conflict (e.g., scheduling conflicts, pending requests)
  - `500` — Server/internal errors
- **Logging**: Errors are logged via `console.error()` before returning generic messages to clients
- **Transaction Rollback**: Database transactions use manual rollback in catch blocks (`await connection.rollback()`)

### Frontend (Client Components)
- **Pattern**: `try/catch` around `fetch()` calls
- **Error Detection**: Checking `res.ok` or inspecting response body for `error` field
- **User Feedback**: Uses `toast.error()` from a toast library to display error messages
- **Error Propagation**: Some components throw `new Error(result.error)` to propagate backend error messages

### Authentication & Authorization
- **Middleware-based auth**: `middleware.js` redirects unauthenticated users to `/auth/login` and unauthorized role access to `/unauthorized`
- **Auth failure**: Returns `null` from `authorize()` rather than throwing errors; errors are caught and logged silently
- **No global error boundary**: No `error.jsx` or `global-error.jsx` files found in the app directory structure

## Key Files

| File | Role |
|------|------|
| `middleware.js` | Role-based access control; redirects on auth/authz failures |
| `lib/database.js` | Centralized query wrapper that logs and re-throws DB errors |
| `app/api/auth/[...nextauth]/route.js` | Auth configuration; returns `null` on credential failures |
| `app/api/admin/guru/route.js` | Representative API route with validation, transaction, and error handling |
| `app/api/admin/guru/[id]/route.js` | Shows PUT/DELETE error patterns including 404 checks |
| `app/api/borrowings/route.js` | Demonstrates 401/400/404/409 status code usage |
| `app/unauthorized/page.jsx` | Static page shown when middleware denies access |

## Architecture and Conventions

### Inconsistencies Observed
1. **Response format varies**: Some routes return `{ error: "..." }`, others return `{ success: false, message: "..." }`, and some mix both styles
2. **Error detail exposure**: Most routes return generic messages ("Gagal menambahkan guru"), but some leak `error.message` directly to clients (e.g., `create-student/route.js`, `siswa/pengajuan/route.js`)
3. **No centralized error utility**: Each route handler duplicates validation and error-response logic
4. **No custom error types**: All errors are plain strings; no error classes or error codes defined
5. **Database layer inconsistency**: `lib/database.js` has a `query()` helper that re-throws errors, but many routes bypass it and use `pool.query()` directly

### Transaction Pattern
Routes that modify multiple tables follow this pattern:
```javascript
let connection;
try {
  connection = await pool.getConnection();
  await connection.beginTransaction();
  // ... operations ...
  await connection.commit();
} catch (err) {
  if (connection) await connection.rollback();
  console.error("...", err);
  return NextResponse.json({ error: "..." }, { status: 500 });
} finally {
  if (connection) connection.release();
}
```

## Rules Developers Should Follow

1. **Always wrap async operations in try/catch** in API route handlers
2. **Return appropriate HTTP status codes**: 400 for validation, 401 for auth, 404 for not found, 500 for server errors
3. **Log errors with `console.error()`** before returning generic messages to avoid leaking internals
4. **Roll back transactions** in catch blocks when using database transactions
5. **Release database connections** in `finally` blocks
6. **Validate input early** and return 400 responses before performing database operations
7. **Check for duplicate constraints** (email, NIP, NIS) before insert/update and return 400 with descriptive messages
8. **Use consistent response format**: Prefer `{ error: "message" }` for errors across all routes
9. **Do not expose raw `error.message`** to clients in production; use generic messages instead
10. **Handle authorization at the API level** in addition to middleware, since middleware only protects routes by path prefix
