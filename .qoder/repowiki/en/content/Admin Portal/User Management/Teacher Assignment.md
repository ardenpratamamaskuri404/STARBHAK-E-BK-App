# Teacher Assignment

<cite>
**Referenced Files in This Document**
- [route.js](file://app/api/admin/create-teacher/route.js)
- [page.jsx](file://app/admin/guru/page.jsx)
- [route.js](file://app/api/admin/guru/route.js)
- [route.js](file://app/api/admin/guru/[id]/route.js)
- [route.js](file://app/api/admin/list-teachers/route.js)
- [database.js](file://lib/database.js)
- [auth.js](file://lib/auth.js)
- [databasebk.sql](file://databasebk.sql)
- [SiswaSelector.jsx](file://app/gurubk/catatan/components/SiswaSelector.jsx)
- [route.js](file://app/api/siswa/search/route.js)
- [page.jsx](file://app/gurubk/dashboard/page.jsx)
- [route.js](file://app/api/guru/dashboard/route.js)
- [route.js](file://app/api/admin/jadwal/route.js)
- [page.jsx](file://app/gurubk/jadwal/page.jsx)
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
10. [Appendices](#appendices)

## Introduction
This document explains the Teacher Assignment system with a focus on creating and managing “Teacher BK” (Guidance Teacher) accounts. It covers:
- The backend API for creating teacher accounts via /api/admin/create-teacher
- The teacher registration workflow, validation rules, and role assignment
- Integration with the admin dashboard for managing teacher profiles and assignments
- Teacher directory management, account status controls, and permission inheritance
- Examples of successful onboarding, common validation errors, and administrative oversight
- Teacher-student relationship management and scheduling coordination features

## Project Structure
The system spans frontend React pages, Next.js App Router API routes, and a MySQL relational schema. Key areas:
- Admin UI for managing teachers and schedules
- APIs for CRUD operations on teachers and schedules
- Authentication and authorization via NextAuth.js
- Database schema supporting users, teacher profiles, and scheduling

```mermaid
graph TB
subgraph "Admin UI"
AdminGuru["Admin Guru Page<br/>(app/admin/guru/page.jsx)"]
AdminSchedule["Admin Schedule Page<br/>(app/api/admin/jadwal/route.js)"]
end
subgraph "Teacher UI"
GuruDashboard["Guru Dashboard<br/>(app/gurubk/dashboard/page.jsx)"]
GuruSchedule["Guru Schedule Page<br/>(app/gurubk/jadwal/page.jsx)"]
end
subgraph "API Layer"
CreateTeacher["Create Teacher API<br/>(app/api/admin/create-teacher/route.js)"]
ManageTeacher["Manage Teachers API<br/>(app/api/admin/guru/route.js)"]
ManageTeacherById["Update/Delete Teacher API<br/>(app/api/admin/guru/[id]/route.js)"]
ListTeachers["List Teachers API<br/>(app/api/admin/list-teachers/route.js)"]
GuruDashboardAPI["Guru Dashboard API<br/>(app/api/guru/dashboard/route.js)"]
ScheduleAPI["Admin Schedule API<br/>(app/api/admin/jadwal/route.js)"]
StudentSearch["Student Search API<br/>(app/api/siswa/search/route.js)"]
end
subgraph "Auth & DB"
Auth["NextAuth Config<br/>(lib/auth.js)"]
DB["Database Pool<br/>(lib/database.js)"]
Schema["Schema & Indexes<br/>(databasebk.sql)"]
end
AdminGuru --> ManageTeacher
AdminGuru --> ManageTeacherById
AdminGuru --> ListTeachers
AdminGuru --> StudentSearch
AdminSchedule --> ScheduleAPI
GuruDashboard --> GuruDashboardAPI
GuruSchedule --> ScheduleAPI
CreateTeacher --> DB
ManageTeacher --> DB
ManageTeacherById --> DB
ListTeachers --> DB
GuruDashboardAPI --> DB
ScheduleAPI --> DB
Auth --> DB
DB --> Schema
```

**Diagram sources**
- [page.jsx:1-278](file://app/admin/guru/page.jsx#L1-L278)
- [route.js:1-22](file://app/api/admin/create-teacher/route.js#L1-L22)
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [route.js:1-100](file://app/api/admin/guru/[id]/route.js#L1-L100)
- [route.js:1-29](file://app/api/admin/list-teachers/route.js#L1-L29)
- [route.js:1-139](file://app/api/guru/dashboard/route.js#L1-L139)
- [route.js:1-38](file://app/api/admin/jadwal/route.js#L1-L38)
- [route.js:1-20](file://app/api/siswa/search/route.js#L1-L20)
- [auth.js:1-77](file://lib/auth.js#L1-L77)
- [database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:1-636](file://databasebk.sql#L1-L636)

**Section sources**
- [page.jsx:1-278](file://app/admin/guru/page.jsx#L1-L278)
- [route.js:1-22](file://app/api/admin/create-teacher/route.js#L1-L22)
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [route.js:1-100](file://app/api/admin/guru/[id]/route.js#L1-L100)
- [route.js:1-29](file://app/api/admin/list-teachers/route.js#L1-L29)
- [route.js:1-139](file://app/api/guru/dashboard/route.js#L1-L139)
- [route.js:1-38](file://app/api/admin/jadwal/route.js#L1-L38)
- [route.js:1-20](file://app/api/siswa/search/route.js#L1-L20)
- [auth.js:1-77](file://lib/auth.js#L1-L77)
- [database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:1-636](file://databasebk.sql#L1-L636)

## Core Components
- Admin Teacher Management UI: Adds, edits, deletes, and filters teachers; integrates with teacher APIs and student search.
- Teacher Registration API: Creates teacher accounts with hashed passwords and inserts into users and guru_profile tables.
- Teacher Management API: Lists, updates, and deletes teacher records with strict validations and transactions.
- Admin Schedule API: Retrieves and updates scheduling statuses for coordination.
- Guru Dashboard and Schedule Pages: Provide teacher-centric views for activity and schedule.
- Authentication: NextAuth.js handles credential-based login and JWT session propagation.

**Section sources**
- [page.jsx:1-278](file://app/admin/guru/page.jsx#L1-L278)
- [route.js:1-22](file://app/api/admin/create-teacher/route.js#L1-L22)
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [route.js:1-100](file://app/api/admin/guru/[id]/route.js#L1-L100)
- [route.js:1-38](file://app/api/admin/jadwal/route.js#L1-L38)
- [page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)
- [page.jsx:1-94](file://app/gurubk/jadwal/page.jsx#L1-L94)
- [auth.js:1-77](file://lib/auth.js#L1-L77)

## Architecture Overview
The system follows a layered architecture:
- Presentation: Next.js pages for admin and teacher roles
- Application: App Router API handlers implementing CRUD and orchestration
- Persistence: MySQL via a connection pool with transactional integrity
- Security: NextAuth.js for authentication and role-based access

```mermaid
sequenceDiagram
participant AdminUI as "Admin UI<br/>(Admin Guru Page)"
participant APICreate as "Create Teacher API<br/>(/api/admin/create-teacher)"
participant APIManage as "Manage Teachers API<br/>(/api/admin/guru)"
participant DB as "MySQL Database"
AdminUI->>APICreate : POST {name,username,email,password}
APICreate->>DB : INSERT users (hashed password, role=guru)
DB-->>APICreate : OK
APICreate-->>AdminUI : {message : "Guru BK berhasil dibuat!"}
AdminUI->>APIManage : POST {name,email,password,nip,...}
APIManage->>DB : BEGIN TRANSACTION
APIManage->>DB : Check email uniqueness
APIManage->>DB : Check nip uniqueness
APIManage->>DB : INSERT users (role=guru)
APIManage->>DB : INSERT guru_profile
APIManage->>DB : COMMIT
APIManage-->>AdminUI : {message,id}
```

**Diagram sources**
- [page.jsx:42-92](file://app/admin/guru/page.jsx#L42-L92)
- [route.js:5-21](file://app/api/admin/create-teacher/route.js#L5-L21)
- [route.js:30-91](file://app/api/admin/guru/route.js#L30-L91)
- [database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:25-65](file://databasebk.sql#L25-L65)

## Detailed Component Analysis

### Teacher Account Creation via /api/admin/create-teacher
- Endpoint: POST /api/admin/create-teacher
- Request payload: name, username, email, password
- Behavior:
  - Hashes the password using bcrypt
  - Inserts a new user with role set to “guru”
  - Returns a success message upon completion
- Notes:
  - Uses a lightweight query wrapper for single statements
  - No duplicate checks are performed in this endpoint

```mermaid
sequenceDiagram
participant Client as "Client"
participant API as "POST /api/admin/create-teacher"
participant DB as "Database"
Client->>API : JSON {name,username,email,password}
API->>API : Hash password
API->>DB : INSERT INTO users (name,username,email,password,role,role_id)
DB-->>API : OK
API-->>Client : {message : "Guru BK berhasil dibuat!"}
```

**Diagram sources**
- [route.js:5-21](file://app/api/admin/create-teacher/route.js#L5-L21)

**Section sources**
- [route.js:1-22](file://app/api/admin/create-teacher/route.js#L1-L22)

### Teacher Registration Workflow and Validation
- Endpoint: POST /api/admin/guru
- Required fields: name, email, password, nip
- Validation and flow:
  - Checks for missing required fields
  - Starts a transaction
  - Ensures email is unique
  - Ensures nip is unique
  - Hashes password
  - Inserts into users (role=guru)
  - Inserts into guru_profile
  - Commits transaction; returns success with id
- Error handling:
  - Returns 400 for validation failures
  - Returns 500 for internal errors; rolls back on failure

```mermaid
flowchart TD
Start(["POST /api/admin/guru"]) --> Validate["Validate required fields"]
Validate --> Valid{"All present?"}
Valid --> |No| Err400["Return 400 Bad Request"]
Valid --> |Yes| BeginTx["Begin Transaction"]
BeginTx --> CheckEmail["Check email uniqueness"]
CheckEmail --> ExistsEmail{"Duplicate?"}
ExistsEmail --> |Yes| Rollback1["Rollback & 400"]
ExistsEmail --> |No| CheckNIP["Check nip uniqueness"]
CheckNIP --> ExistsNIP{"Duplicate?"}
ExistsNIP --> |Yes| Rollback2["Rollback & 400"]
ExistsNIP --> |No| HashPass["Hash password"]
HashPass --> InsertUsers["INSERT INTO users (role=guru)"]
InsertUsers --> InsertProfile["INSERT INTO guru_profile"]
InsertProfile --> Commit["Commit"]
Commit --> Success["Return 201 Created with id"]
Err400 --> End
Rollback1 --> End
Rollback2 --> End
Success --> End(["End"])
```

**Diagram sources**
- [route.js:30-91](file://app/api/admin/guru/route.js#L30-L91)

**Section sources**
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)

### Teacher Profile Management (Edit/Delete)
- Update endpoint: PUT /api/admin/guru/[id]
  - Validates completeness
  - Prevents duplicate email/nip (excluding current record)
  - Updates users and guru_profile (insert or update)
- Delete endpoint: DELETE /api/admin/guru/[id]
  - Deletes user; cascading delete removes guru_profile
  - Returns appropriate status codes

```mermaid
sequenceDiagram
participant AdminUI as "Admin UI"
participant APIPut as "PUT /api/admin/guru/[id]"
participant APIDel as "DELETE /api/admin/guru/[id]"
participant DB as "Database"
AdminUI->>APIPut : JSON {name,email,nip,...}
APIPut->>DB : Check unique constraints (skip self)
APIPut->>DB : UPDATE users
APIPut->>DB : INSERT/UPDATE guru_profile
APIPut-->>AdminUI : {message : "Guru berhasil diperbarui!"}
AdminUI->>APIDel : DELETE
APIDel->>DB : DELETE FROM users WHERE role='guru'
DB-->>APIDel : Affected Rows
APIDel-->>AdminUI : {message : "Guru berhasil dihapus!"}
```

**Diagram sources**
- [route.js:9-100](file://app/api/admin/guru/[id]/route.js#L9-L100)

**Section sources**
- [route.js:1-100](file://app/api/admin/guru/[id]/route.js#L1-L100)

### Admin Dashboard Integration for Managing Teachers
- Admin UI page for teachers:
  - Fetches teacher list from GET /api/admin/guru
  - Supports search/filter across name, email, nip, subject
  - Form supports adding new or editing existing teachers
  - Submits to POST /api/admin/guru or PUT /api/admin/guru/[id]
  - Deletion via DELETE /api/admin/guru/[id]
- Additional listing endpoint:
  - GET /api/admin/list-teachers returns teacher details including is_active

```mermaid
sequenceDiagram
participant AdminUI as "Admin Guru Page"
participant APIGet as "GET /api/admin/guru"
participant APIPost as "POST /api/admin/guru"
participant APIPut as "PUT /api/admin/guru/[id]"
participant APIDel as "DELETE /api/admin/guru/[id]"
participant ListAPI as "GET /api/admin/list-teachers"
AdminUI->>APIGet : Load teachers
APIGet-->>AdminUI : [{id,name,email,nip,...}]
AdminUI->>APIPost : Add new teacher
APIPost-->>AdminUI : {message,id}
AdminUI->>APIPut : Update selected teacher
APIPut-->>AdminUI : {message}
AdminUI->>APIDel : Delete teacher
APIDel-->>AdminUI : {message}
AdminUI->>ListAPI : Optional detailed list
ListAPI-->>AdminUI : [teachers with is_active]
```

**Diagram sources**
- [page.jsx:25-135](file://app/admin/guru/page.jsx#L25-L135)
- [route.js:8-25](file://app/api/admin/guru/route.js#L8-L25)
- [route.js:81-100](file://app/api/admin/guru/[id]/route.js#L81-L100)
- [route.js:4-28](file://app/api/admin/list-teachers/route.js#L4-L28)

**Section sources**
- [page.jsx:1-278](file://app/admin/guru/page.jsx#L1-L278)
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [route.js:1-100](file://app/api/admin/guru/[id]/route.js#L1-L100)
- [route.js:1-29](file://app/api/admin/list-teachers/route.js#L1-L29)

### Teacher Directory Management and Account Status Controls
- Teacher listing and filtering:
  - GET /api/admin/guru returns active teachers joined with guru_profile
  - Filtering by name, email, nip, subject supported in UI
- Account status:
  - users table includes is_active flag
  - Active filter applied in teacher listing queries
- Permission inheritance:
  - Role stored in users.role; NextAuth propagates role in JWT/session

```mermaid
flowchart TD
A["GET /api/admin/guru"] --> B["SELECT users JOIN guru_profile WHERE role='guru' AND is_active=1"]
B --> C["Return {data:[teachers]}"]
D["Role Propagation"] --> E["NextAuth JWT/session includes role"]
```

**Diagram sources**
- [route.js:8-25](file://app/api/admin/guru/route.js#L8-L25)
- [auth.js:55-72](file://lib/auth.js#L55-L72)
- [databasebk.sql:25-38](file://databasebk.sql#L25-L38)

**Section sources**
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [auth.js:1-77](file://lib/auth.js#L1-L77)
- [databasebk.sql:1-636](file://databasebk.sql#L1-L636)

### Teacher-Student Relationship Management and Scheduling Coordination
- Student search for notes/scheduling:
  - SiswaSelector component calls GET /api/siswa/search?search=text
  - Returns matching students with name, nis, and class
- Teacher dashboard and schedule:
  - Guru Dashboard page fetches /api/guru/dashboard for stats and recent activities
  - Guru Schedule page lists upcoming schedules
  - Admin Schedule API retrieves consolidated schedule data and allows status updates

```mermaid
sequenceDiagram
participant GuruUI as "Guru Dashboard Page"
participant GuruAPI as "GET /api/guru/dashboard"
participant AdminUI as "Admin Schedule Page"
participant AdminAPI as "GET /api/admin/jadwal"
participant DB as "Database"
GuruUI->>GuruAPI : Fetch dashboard stats
GuruAPI->>DB : Query borrows/jadwal_konseling
DB-->>GuruAPI : Stats & activities
GuruAPI-->>GuruUI : {stats,donut,monthly,activities}
AdminUI->>AdminAPI : Fetch schedules
AdminAPI->>DB : JOIN jadwal_konseling with users
DB-->>AdminAPI : [{student,guru,scheduled,status},...]
AdminAPI-->>AdminUI : [schedules]
```

**Diagram sources**
- [page.jsx:20-28](file://app/gurubk/dashboard/page.jsx#L20-L28)
- [route.js:7-138](file://app/api/guru/dashboard/route.js#L7-L138)
- [page.jsx:8-20](file://app/gurubk/jadwal/page.jsx#L8-L20)
- [route.js:5-38](file://app/api/admin/jadwal/route.js#L5-L38)

**Section sources**
- [SiswaSelector.jsx:1-78](file://app/gurubk/catatan/components/SiswaSelector.jsx#L1-L78)
- [route.js:1-20](file://app/api/siswa/search/route.js#L1-L20)
- [page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)
- [route.js:1-139](file://app/api/guru/dashboard/route.js#L1-L139)
- [page.jsx:1-94](file://app/gurubk/jadwal/page.jsx#L1-L94)
- [route.js:1-38](file://app/api/admin/jadwal/route.js#L1-L38)

## Dependency Analysis
- Frontend depends on:
  - Next.js App Router for routing and API consumption
  - React state and effects for UI interactions
- Backend depends on:
  - NextAuth.js for session and role propagation
  - MySQL via a connection pool with transaction support
- Database schema enforces:
  - Unique constraints on email and nip
  - Foreign keys with cascade deletes for profile tables
  - Indexes for performance on role, email, and foreign keys

```mermaid
graph LR
AdminPage["Admin Guru Page"] --> ManageAPI["/api/admin/guru"]
ManageAPI --> DBPool["Database Pool"]
CreateAPI["/api/admin/create-teacher"] --> DBPool
GuruDashUI["Guru Dashboard Page"] --> GuruDashAPI["/api/guru/dashboard"]
GuruDashAPI --> DBPool
AdminScheduleUI["Admin Schedule Page"] --> AdminScheduleAPI["/api/admin/jadwal"]
AdminScheduleAPI --> DBPool
AuthLib["NextAuth Config"] --> DBPool
DBPool --> Schema["Database Schema"]
```

**Diagram sources**
- [page.jsx:25-135](file://app/admin/guru/page.jsx#L25-L135)
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [route.js:1-22](file://app/api/admin/create-teacher/route.js#L1-L22)
- [page.jsx:20-28](file://app/gurubk/dashboard/page.jsx#L20-L28)
- [route.js:1-139](file://app/api/guru/dashboard/route.js#L1-L139)
- [page.jsx:8-20](file://app/gurubk/jadwal/page.jsx#L8-L20)
- [route.js:1-38](file://app/api/admin/jadwal/route.js#L1-L38)
- [auth.js:1-77](file://lib/auth.js#L1-L77)
- [database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:1-636](file://databasebk.sql#L1-L636)

**Section sources**
- [page.jsx:1-278](file://app/admin/guru/page.jsx#L1-L278)
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [route.js:1-22](file://app/api/admin/create-teacher/route.js#L1-L22)
- [page.jsx:1-158](file://app/gurubk/dashboard/page.jsx#L1-L158)
- [route.js:1-139](file://app/api/guru/dashboard/route.js#L1-L139)
- [page.jsx:1-94](file://app/gurubk/jadwal/page.jsx#L1-L94)
- [route.js:1-38](file://app/api/admin/jadwal/route.js#L1-L38)
- [auth.js:1-77](file://lib/auth.js#L1-L77)
- [database.js:1-23](file://lib/database.js#L1-L23)
- [databasebk.sql:1-636](file://databasebk.sql#L1-L636)

## Performance Considerations
- Use indexes on frequently queried columns (users.role, users.email, guru_profile.nip, foreign keys)
- Batch operations and transactions minimize partial writes
- Pagination or limits on search endpoints prevent excessive result sets
- Keep password hashing cost reasonable to balance security and performance

## Troubleshooting Guide
Common issues and resolutions:
- Duplicate email or nip:
  - Symptom: 400 response indicating duplication
  - Resolution: Change email or nip to a unique value
- Missing required fields:
  - Symptom: 400 response requiring name, email, password, nip
  - Resolution: Fill all required fields in the form
- Transaction rollback:
  - Symptom: Internal server error after validation failure
  - Resolution: Ensure data meets uniqueness and presence rules before submission
- Unauthorized access:
  - Symptom: 401 when accessing protected endpoints
  - Resolution: Authenticate with valid credentials and ensure role is “guru” or authorized role

**Section sources**
- [route.js:36-56](file://app/api/admin/guru/route.js#L36-L56)
- [route.js:16-39](file://app/api/admin/guru/[id]/route.js#L16-L39)
- [route.js:11-13](file://app/api/guru/dashboard/route.js#L11-L13)
- [auth.js:14-42](file://lib/auth.js#L14-L42)

## Conclusion
The Teacher Assignment system provides a robust foundation for creating, managing, and coordinating with teachers. It leverages secure authentication, transactional database operations, and intuitive dashboards for both administrators and teachers. By adhering to validation rules and leveraging the provided APIs, administrators can efficiently onboard teachers and manage their relationships with students and schedules.

## Appendices

### API Definitions and Behaviors
- POST /api/admin/create-teacher
  - Payload: name, username, email, password
  - Response: success message
- POST /api/admin/guru
  - Payload: name, email, password, phone, nip, mata_pelajaran, jabatan, bio
  - Response: success with id
- PUT /api/admin/guru/[id]
  - Payload: name, email, phone, password (optional), nip, mata_pelajaran, jabatan, bio
  - Response: success message
- DELETE /api/admin/guru/[id]
  - Response: success message
- GET /api/admin/guru
  - Response: list of active teachers with profile details
- GET /api/admin/list-teachers
  - Response: teacher details including is_active
- GET /api/admin/jadwal
  - Response: consolidated schedule list
- PATCH /api/admin/jadwal
  - Payload: { status }
  - Response: success message

**Section sources**
- [route.js:1-22](file://app/api/admin/create-teacher/route.js#L1-L22)
- [route.js:1-92](file://app/api/admin/guru/route.js#L1-L92)
- [route.js:1-100](file://app/api/admin/guru/[id]/route.js#L1-L100)
- [route.js:8-25](file://app/api/admin/guru/route.js#L8-L25)
- [route.js:1-29](file://app/api/admin/list-teachers/route.js#L1-L29)
- [route.js:1-38](file://app/api/admin/jadwal/route.js#L1-L38)