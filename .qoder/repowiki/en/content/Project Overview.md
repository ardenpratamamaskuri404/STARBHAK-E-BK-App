# Project Overview

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [README.md](file://README.md)
- [lib/auth.js](file://lib/auth.js)
- [lib/database.js](file://lib/database.js)
- [middleware.js](file://middleware.js)
- [databasebk.sql](file://databasebk.sql)
- [app/layout.js](file://app/layout.js)
- [components/Providers.jsx](file://components/Providers.jsx)
- [app/admin/dashboard/page.jsx](file://app/admin/dashboard/page.jsx)
- [app/siswa/dashboard/page.jsx](file://app/siswa/dashboard/page.jsx)
- [app/gurubk/dashboard/page.jsx](file://app/gurubk/dashboard/page.jsx)
- [app/api/auth/[...nextauth]/route.js](file://app/api/auth/[...nextauth]/route.js)
- [components/NavbarAdmin.jsx](file://components/NavbarAdmin.jsx)
- [components/NavbarGuru.jsx](file://components/NavbarGuru.jsx)
- [components/NavbarSiswa.jsx](file://components/NavbarSiswa.jsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
Educational Booking Application (E-BK) is a school counseling management system designed to streamline the end-to-end process of student counseling sessions. It targets three primary user roles: administrators, counselors (Guru BK), and students (Siswa). The platform centralizes appointment requests, scheduling, progress documentation, reporting, and notifications to improve operational efficiency and support student wellbeing.

Core value proposition:
- Simplified appointment booking and scheduling for students with visibility into counselor availability and session status
- Centralized dashboards for counselors to manage incoming requests, schedule sessions, and maintain progress notes
- Administrative oversight with reporting, user management, and system analytics
- Secure, role-based access ensuring appropriate permissions and data privacy

Educational domain context:
Schools often struggle with manual, paper-based or fragmented systems for managing counseling sessions. E-BK addresses these challenges by digitizing the entire lifecycle—from request submission to session completion and follow-up reporting—while maintaining compliance with institutional policies and user privacy.

## Project Structure
The application follows a Next.js App Router structure with a clear separation of concerns:
- app/: Route handlers, pages, and nested layouts organized by role and feature
- components/: Reusable UI components and providers
- lib/: Shared utilities for authentication, database connectivity, and helpers
- public/uploads/: Static assets for user avatars and uploads
- Database schema defined via SQL script with normalized tables for users, profiles, schedules, reports, and notifications

```mermaid
graph TB
subgraph "Frontend (Next.js App)"
LAYOUT["Root Layout<br/>app/layout.js"]
PROVIDERS["Providers<br/>components/Providers.jsx"]
ADMIN_DASH["Admin Dashboard<br/>app/admin/dashboard/page.jsx"]
GURU_DASH["Guru Dashboard<br/>app/gurubk/dashboard/page.jsx"]
SISWA_DASH["Siswa Dashboard<br/>app/siswa/dashboard/page.jsx"]
NAV_ADMIN["NavbarAdmin<br/>components/NavbarAdmin.jsx"]
NAV_GURU["NavbarGuru<br/>components/NavbarGuru.jsx"]
NAV_SISWA["NavbarSiswa<br/>components/NavbarSiswa.jsx"]
end
subgraph "Authentication"
AUTH_LIB["Auth Config<br/>lib/auth.js"]
AUTH_API["Auth API<br/>app/api/auth/[...nextauth]/route.js"]
MIDDLEWARE["Middleware<br/>middleware.js"]
end
subgraph "Data Layer"
DB_POOL["Database Pool<br/>lib/database.js"]
SCHEMA["Schema & Seed<br/>databasebk.sql"]
end
LAYOUT --> PROVIDERS
PROVIDERS --> NAV_ADMIN
PROVIDERS --> NAV_GURU
PROVIDERS --> NAV_SISWA
NAV_ADMIN --> ADMIN_DASH
NAV_GURU --> GURU_DASH
NAV_SISWA --> SISWA_DASH
AUTH_LIB --> AUTH_API
AUTH_API --> MIDDLEWARE
MIDDLEWARE --> ADMIN_DASH
MIDDLEWARE --> GURU_DASH
MIDDLEWARE --> SISWA_DASH
ADMIN_DASH --> DB_POOL
GURU_DASH --> DB_POOL
SISWA_DASH --> DB_POOL
DB_POOL --> SCHEMA
```

**Diagram sources**
- [app/layout.js:1-31](file://app/layout.js#L1-L31)
- [components/Providers.jsx:1-14](file://components/Providers.jsx#L1-L14)
- [app/admin/dashboard/page.jsx:1-255](file://app/admin/dashboard/page.jsx#L1-L255)
- [app/gurubk/dashboard/page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)
- [app/siswa/dashboard/page.jsx:1-209](file://app/siswa/dashboard/page.jsx#L1-L209)
- [components/NavbarAdmin.jsx:1-231](file://components/NavbarAdmin.jsx#L1-L231)
- [components/NavbarGuru.jsx:1-210](file://components/NavbarGuru.jsx#L1-L210)
- [components/NavbarSiswa.jsx:1-191](file://components/NavbarSiswa.jsx#L1-L191)
- [lib/auth.js:1-77](file://lib/auth.js#L1-L77)
- [app/api/auth/[...nextauth]/route.js:1-102](file://app/api/auth/[...nextauth]/route.js#L1-L102)
- [middleware.js:1-53](file://middleware.js#L1-L53)
- [lib/database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:1-407](file://databasebk.sql#L1-L407)

**Section sources**
- [README.md:1-37](file://README.md#L1-L37)
- [package.json:1-44](file://package.json#L1-L44)
- [app/layout.js:1-31](file://app/layout.js#L1-L31)
- [components/Providers.jsx:1-14](file://components/Providers.jsx#L1-L14)
- [lib/auth.js:1-77](file://lib/auth.js#L1-L77)
- [app/api/auth/[...nextauth]/route.js:1-102](file://app/api/auth/[...nextauth]/route.js#L1-L102)
- [middleware.js:1-53](file://middleware.js#L1-L53)
- [lib/database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:1-407](file://databasebk.sql#L1-L407)

## Core Components
- Role-based authentication and session management using NextAuth.js with JWT strategy
- Middleware enforcing role-specific routing protection
- Centralized database pool abstraction for MySQL connectivity
- Role-specific dashboards with charts, filters, and actionable navigation
- Shared navigation components for Admin, Guru BK, and Siswa

Key capabilities:
- Appointment booking and status tracking for students
- Counselor dashboard with analytics and activity feeds
- Admin oversight with reporting and user management
- Real-time notifications and status updates

**Section sources**
- [lib/auth.js:1-77](file://lib/auth.js#L1-L77)
- [app/api/auth/[...nextauth]/route.js:1-102](file://app/api/auth/[...nextauth]/route.js#L1-L102)
- [middleware.js:1-53](file://middleware.js#L1-L53)
- [lib/database.js:1-23](file://lib/database.js#L1-L23)
- [app/admin/dashboard/page.jsx:1-255](file://app/admin/dashboard/page.jsx#L1-L255)
- [app/gurubk/dashboard/page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)
- [app/siswa/dashboard/page.jsx:1-209](file://app/siswa/dashboard/page.jsx#L1-L209)

## Architecture Overview
The system employs a layered architecture:
- Presentation layer: Next.js App Router pages and shared UI components
- Authentication layer: NextAuth.js with custom credentials provider and JWT callbacks
- Business logic layer: Route handlers under app/api implementing CRUD and analytics
- Data access layer: MySQL2 pool with centralized query execution
- Middleware layer: Role-based access control protecting protected routes

```mermaid
graph TB
CLIENT["Browser"]
NEXT["Next.js App Router"]
AUTH["NextAuth.js"]
MW["Middleware"]
API_ADMIN["Admin API Routes"]
API_GURU["Guru API Routes"]
API_SISWA["Siswa API Routes"]
DB["MySQL Database"]
CLIENT --> NEXT
NEXT --> AUTH
NEXT --> MW
NEXT --> API_ADMIN
NEXT --> API_GURU
NEXT --> API_SISWA
API_ADMIN --> DB
API_GURU --> DB
API_SISWA --> DB
AUTH --> DB
```

**Diagram sources**
- [app/api/auth/[...nextauth]/route.js:1-102](file://app/api/auth/[...nextauth]/route.js#L1-L102)
- [middleware.js:1-53](file://middleware.js#L1-L53)
- [lib/database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:1-407](file://databasebk.sql#L1-L407)

## Detailed Component Analysis

### Role-Based Architecture
The application defines three user roles with distinct dashboards and permissions:
- Admin: Manages users, schedules, and generates reports
- Guru BK: Reviews requests, schedules sessions, and maintains notes
- Siswa: Submits requests, tracks status, and views personal history

```mermaid
classDiagram
class AdminDashboard {
+stats()
+filters()
+reports()
}
class GuruDashboard {
+requests()
+schedule()
+analytics()
+notes()
}
class SiswaDashboard {
+requests()
+upcoming()
+history()
+quickActions()
}
class Middleware {
+protectAdmin()
+protectGuru()
+protectSiswa()
}
class AuthConfig {
+credentialsProvider()
+jwtCallbacks()
+sessionCallbacks()
}
AdminDashboard --> Middleware : "protected"
GuruDashboard --> Middleware : "protected"
SiswaDashboard --> Middleware : "protected"
AuthConfig --> AdminDashboard : "provides session"
AuthConfig --> GuruDashboard : "provides session"
AuthConfig --> SiswaDashboard : "provides session"
```

**Diagram sources**
- [app/admin/dashboard/page.jsx:1-255](file://app/admin/dashboard/page.jsx#L1-L255)
- [app/gurubk/dashboard/page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)
- [app/siswa/dashboard/page.jsx:1-209](file://app/siswa/dashboard/page.jsx#L1-L209)
- [middleware.js:1-53](file://middleware.js#L1-L53)
- [lib/auth.js:1-77](file://lib/auth.js#L1-L77)

**Section sources**
- [middleware.js:1-53](file://middleware.js#L1-L53)
- [lib/auth.js:1-77](file://lib/auth.js#L1-L77)

### Authentication and Authorization Flow
The authentication system supports login via email/NIS/NIP with password verification against hashed credentials stored in the database. JWT tokens carry role and profile attributes to enable middleware-based route protection and UI customization.

```mermaid
sequenceDiagram
participant U as "User"
participant A as "Auth API<br/>app/api/auth/[...nextauth]/route.js"
participant DB as "Database<br/>lib/database.js"
participant MW as "Middleware<br/>middleware.js"
U->>A : Submit credentials
A->>DB : Query user by email/NIS/NIP
DB-->>A : User record
A->>A : Verify password hash
A-->>U : JWT token with role/profile
U->>MW : Navigate to protected route
MW->>MW : Extract token and role
MW-->>U : Allow or redirect to unauthorized
```

**Diagram sources**
- [app/api/auth/[...nextauth]/route.js:1-102](file://app/api/auth/[...nextauth]/route.js#L1-L102)
- [lib/database.js:1-23](file://lib/database.js#L1-L23)
- [middleware.js:1-53](file://middleware.js#L1-L53)

**Section sources**
- [app/api/auth/[...nextauth]/route.js:1-102](file://app/api/auth/[...nextauth]/route.js#L1-L102)
- [lib/database.js:1-23](file://lib/database.js#L1-L23)
- [middleware.js:1-53](file://middleware.js#L1-L53)

### Data Model Overview
The schema supports users, profiles, counseling requests, schedules, reports, and notifications. Indexes are defined for performance on frequently queried columns.

```mermaid
erDiagram
USERS {
int id PK
string name
string email UK
string password
enum role
string phone
string avatar_url
tinyint is_active
timestamp created_at
timestamp updated_at
}
SISWA_PROFILE {
int id PK
int user_id FK
string nis UK
date tanggal_lahir
text alamat
int kelas_id
string emergency_contact
timestamp created_at
timestamp updated_at
}
GURU_PROFILE {
int id PK
int user_id FK
string nip UK
string mata_pelajaran
string jabatan
text bio
timestamp created_at
timestamp updated_at
}
KELAS {
int id PK
string nama UK
timestamp created_at
timestamp updated_at
}
BORROWS {
int id PK
int student_id FK
int teacher_id FK
string type
string title
text description
text reason
enum status
timestamp requested_at
datetime scheduled_at
datetime preferred_datetime
datetime scheduled_datetime
datetime approved_at
datetime rejected_at
datetime completed_at
timestamp created_at
timestamp updated_at
}
JADWAL_KONSELING {
int id PK
int student_id FK
int teacher_id FK
datetime scheduled_datetime
int duration_minutes
string lokasi
enum status
timestamp created_at
timestamp updated_at
}
LAPORAN_KONSELING {
int id PK
int jadwal_id
int student_id FK
int teacher_id FK
text summary
text detail
text follow_up
timestamp created_at
timestamp updated_at
}
CATATAN_SISWA {
int id PK
int student_id FK
int teacher_id FK
string judul
text isi
string kategori
timestamp created_at
timestamp updated_at
}
NOTIFICATIONS {
int id PK
int user_id FK
text message
tinyint is_read
timestamp created_at
}
KELAS ||--o{ SISWA_PROFILE : "contains"
USERS ||--o{ SISWA_PROFILE : "has profile"
USERS ||--o{ GURU_PROFILE : "has profile"
USERS ||--o{ BORROWS : "student/teacher"
USERS ||--o{ JADWAL_KONSELING : "student/teacher"
USERS ||--o{ LAPORAN_KONSELING : "student/teacher"
USERS ||--o{ CATATAN_SISWA : "student/teacher"
USERS ||--o{ NOTIFICATIONS : "receives"
JADWAL_KONSELING ||--o{ LAPORAN_KONSELING : "generates report"
```

**Diagram sources**
- [databasebk.sql:1-407](file://databasebk.sql#L1-L407)

**Section sources**
- [databasebk.sql:1-407](file://databasebk.sql#L1-L407)

### Admin Dashboard Features
The Admin dashboard aggregates counts for students and teachers, lists borrowing transactions with filtering and search, and presents statistics in a responsive layout.

```mermaid
flowchart TD
Start(["Load Admin Dashboard"]) --> FetchStats["Fetch Students, Teachers, Borrowings"]
FetchStats --> RenderCards["Render Stats Cards"]
RenderCards --> Filters["Apply Search & Filters"]
Filters --> RenderTable["Render Borrowings Table"]
RenderTable --> End(["Ready"])
```

**Diagram sources**
- [app/admin/dashboard/page.jsx:1-255](file://app/admin/dashboard/page.jsx#L1-L255)

**Section sources**
- [app/admin/dashboard/page.jsx:1-255](file://app/admin/dashboard/page.jsx#L1-L255)

### Guru Dashboard Features
The Guru dashboard displays request intake, daily schedule, historical completions, student count, and recent activities with charts for status distribution and monthly volume.

```mermaid
flowchart TD
Start(["Load Guru Dashboard"]) --> FetchData["Fetch Analytics Data"]
FetchData --> RenderStats["Render Stat Cards"]
RenderStats --> Charts["Render Donut & Bar Charts"]
Charts --> Activities["Render Recent Activities"]
Activities --> End(["Ready"])
```

**Diagram sources**
- [app/gurubk/dashboard/page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)

**Section sources**
- [app/gurubk/dashboard/page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)

### Siswa Dashboard Features
The Siswa dashboard shows total requests, completed sessions, latest status, quick actions (notes, history, request), upcoming schedule, and a call-to-action to submit a new request.

```mermaid
flowchart TD
Start(["Load Siswa Dashboard"]) --> FetchData["Fetch Dashboard Data"]
FetchData --> Stats["Render Stats"]
Stats --> QuickActions["Render Quick Actions"]
QuickActions --> Upcoming["Show Upcoming Schedule"]
Upcoming --> Latest["Show Latest Request Status"]
Latest --> CTA["Call-to-Action to Request"]
CTA --> End(["Ready"])
```

**Diagram sources**
- [app/siswa/dashboard/page.jsx:1-209](file://app/siswa/dashboard/page.jsx#L1-L209)

**Section sources**
- [app/siswa/dashboard/page.jsx:1-209](file://app/siswa/dashboard/page.jsx#L1-L209)

### Navigation Components
Each role has a dedicated navbar with menu items, profile dropdown, and logout functionality. Avatars are resolved from uploaded URLs or defaults.

```mermaid
classDiagram
class NavbarAdmin {
+menuItems
+profileDropdown()
+logout()
}
class NavbarGuru {
+menuItems
+profileDropdown()
+logout()
}
class NavbarSiswa {
+menuItems
+profileDropdown()
+logout()
}
```

**Diagram sources**
- [components/NavbarAdmin.jsx:1-231](file://components/NavbarAdmin.jsx#L1-L231)
- [components/NavbarGuru.jsx:1-210](file://components/NavbarGuru.jsx#L1-L210)
- [components/NavbarSiswa.jsx:1-191](file://components/NavbarSiswa.jsx#L1-L191)

**Section sources**
- [components/NavbarAdmin.jsx:1-231](file://components/NavbarAdmin.jsx#L1-L231)
- [components/NavbarGuru.jsx:1-210](file://components/NavbarGuru.jsx#L1-L210)
- [components/NavbarSiswa.jsx:1-191](file://components/NavbarSiswa.jsx#L1-L191)

## Dependency Analysis
Technology stack highlights:
- Frontend framework: Next.js 16.0.3
- Authentication: NextAuth.js with custom credentials provider
- Backend data access: mysql2 promise pool
- UI primitives: Radix UI components
- Icons: Lucide React
- Charts: Recharts
- Animations: Framer Motion
- Notifications: react-hot-toast
- PDF rendering: @react-pdf/renderer
- Uploads: uploadthing and @uploadthing/react
- Validation: zod
- Styling: Tailwind CSS v4

```mermaid
graph LR
NEXT["Next.js 16.0.3"] --> NA["NextAuth.js"]
NEXT --> UI["Radix UI + Lucide React"]
NEXT --> CHARTS["Recharts"]
NEXT --> ANIM["Framer Motion"]
NEXT --> TOAST["React Hot Toast"]
NEXT --> PDF["@react-pdf/renderer"]
NEXT --> UPLOAD["@uploadthing/react / uploadthing"]
NEXT --> VALID["Zod"]
NEXT --> DB["mysql2"]
NEXT --> TAILWIND["Tailwind CSS v4"]
```

**Diagram sources**
- [package.json:11-34](file://package.json#L11-L34)

**Section sources**
- [package.json:11-34](file://package.json#L11-L34)

## Performance Considerations
- Database pooling: The pool limits concurrent connections and queues requests to prevent overload
- Indexes: Strategic indexes on users, borrowing, and schedule tables improve query performance
- Client-side memoization: Filtering logic in Admin dashboard uses memoization to avoid unnecessary re-computation
- Lazy loading: Charts and animations are rendered only when data is available
- CDN/static assets: Avatars and logos are served efficiently via static/public paths

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Authentication failures: Verify NEXTAUTH_SECRET environment variable and ensure bcrypt-compatibile password hashes in the database
- Middleware redirects: Confirm role-based routes align with user roles and that tokens are present
- Database connectivity: Check DB_HOST, DB_USER, DB_PASS, DB_NAME environment variables and pool configuration
- CORS/upload issues: Validate uploadthing configuration and public uploads directory permissions

**Section sources**
- [lib/auth.js:1-77](file://lib/auth.js#L1-L77)
- [app/api/auth/[...nextauth]/route.js:1-102](file://app/api/auth/[...nextauth]/route.js#L1-L102)
- [middleware.js:1-53](file://middleware.js#L1-L53)
- [lib/database.js:1-23](file://lib/database.js#L1-L23)

## Conclusion
E-BK delivers a cohesive, role-focused solution for school counseling session management. Its modular architecture, robust authentication, and intuitive dashboards enable administrators to oversee operations, counselors to manage caseloads effectively, and students to easily book and track sessions. The technology stack balances modern frontend capabilities with reliable backend services, providing a scalable foundation for future enhancements.