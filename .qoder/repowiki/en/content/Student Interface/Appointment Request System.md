# Appointment Request System

<cite>
**Referenced Files in This Document**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/siswa/guru/route.js)
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)
- [page.jsx](file://app/siswa/riwayat/page.jsx)
- [page.jsx](file://app/gurubk/riwayat/page.jsx)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)
- [databasebk.sql](file://databasebk.sql)
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
This document describes the student appointment request system for counseling sessions. It covers the form interface for submitting requests (including date/time selection, reason description, and counselor preferences), validation rules, submission workflow, and response handling. It also documents integration with the borrowing system, conflict detection, and the approval process for counselors. Examples of form fields, validation rules, success/error states, and user feedback mechanisms are included.

## Project Structure
The system spans frontend pages and backend API routes:
- Student-facing request form and history pages
- Counselor-facing approval pages and endpoints
- Shared borrowing model for storing requests and scheduling
- Database schema supporting users, profiles, borrowing requests, schedules, and reports

```mermaid
graph TB
subgraph "Student UI"
S_Ajukan["app/siswa/ajukan/page.jsx"]
S_Riwayat["app/siswa/riwayat/page.jsx"]
end
subgraph "Counselor UI"
G_Pengajuan["app/gurubk/pengajuan/page.jsx"]
G_Riwayat["app/gurubk/riwayat/page.jsx"]
end
subgraph "API Routes"
API_Siswa_Guru["app/api/siswa/guru/route.js"]
API_Siswa_Pengajuan["app/api/siswa/pengajuan/route.js"]
API_Guru_Pengajuan["app/api/guru/pengajuan/route.js"]
API_Guru_Approve["app/api/guru/pengajuan/[id]/approve/route.js"]
API_Guru_Reject["app/api/guru/pengajuan/[id]/reject/route.js"]
API_Borrowings["app/api/borrowings/route.js"]
end
subgraph "Database"
DB["lib/database.js"]
Schema["databasebk.sql"]
end
S_Ajukan --> API_Siswa_Guru
S_Ajukan --> API_Siswa_Pengajuan
S_Riwayat --> API_Siswa_Pengajuan
G_Pengajuan --> API_Guru_Pengajuan
G_Pengajuan --> API_Guru_Approve
G_Pengajuan --> API_Guru_Reject
G_Riwayat --> API_Guru_Pengajuan
API_Siswa_Pengajuan --> DB
API_Guru_Pengajuan --> DB
API_Guru_Approve --> DB
API_Guru_Reject --> DB
API_Borrowings --> DB
DB --> Schema
```

**Diagram sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/siswa/guru/route.js)
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)
- [page.jsx](file://app/siswa/riwayat/page.jsx)
- [page.jsx](file://app/gurubk/riwayat/page.jsx)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)
- [databasebk.sql](file://databasebk.sql)

**Section sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/siswa/guru/route.js)
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)
- [page.jsx](file://app/siswa/riwayat/page.jsx)
- [page.jsx](file://app/gurubk/riwayat/page.jsx)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)
- [databasebk.sql](file://databasebk.sql)

## Core Components
- Student request form: collects counselor selection, preferred date/time, and reason, validates locally and submits to the backend.
- Backend request endpoint: validates session, ensures counselor exists, checks for pending borrowing requests, and inserts a new borrowing record with status pending.
- Counselor approval panel: lists pending requests assigned to the logged-in counselor and allows approve/reject actions.
- Borrowing system integration: uses a unified borrowing table to track requests and their statuses.
- Conflict detection: prevents double-booking by checking existing non-rejected entries for the same counselor and time slot.
- History pages: show student and counselor request histories with status badges and timestamps.

**Section sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/siswa/guru/route.js)
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)
- [route.js](file://app/api/borrowings/route.js)
- [page.jsx](file://app/siswa/riwayat/page.jsx)
- [page.jsx](file://app/gurubk/riwayat/page.jsx)

## Architecture Overview
The system follows a client-server pattern with React client pages and Next.js API routes. Data persistence uses a MySQL database accessed via a shared query utility. Requests are stored in a borrowing table with distinct types and statuses. Counselors approve or reject pending requests, which updates the borrowing record accordingly.

```mermaid
sequenceDiagram
participant Student as "Student UI<br/>app/siswa/ajukan/page.jsx"
participant API_Siswa as "Siswa API<br/>app/api/siswa/pengajuan/route.js"
participant DB as "Database<br/>lib/database.js"
participant API_Borrow as "Borrowings API<br/>app/api/borrowings/route.js"
Student->>API_Siswa : POST /api/siswa/pengajuan (teacher_id, reason)
API_Siswa->>DB : Validate counselor exists
API_Siswa->>DB : Check pending borrowing for student
API_Siswa->>DB : Insert borrowing (type=konseling, status=pending)
DB-->>API_Siswa : Success
API_Siswa-->>Student : {success : true, message}
Note over Student,API_Borrow : Alternative path using legacy borrowings API
Student->>API_Borrow : POST /api/borrowings (guru_id, tanggal, jam, alasan)
API_Borrow->>DB : Check conflicts (non-rejected)
API_Borrow->>DB : Insert borrowing
DB-->>API_Borrow : Success
API_Borrow-->>Student : {success : true, message}
```

**Diagram sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)

## Detailed Component Analysis

### Student Request Form
- Fields:
  - Counselor selection: dropdown populated from the counselor list endpoint.
  - Preferred date/time: datetime-local input.
  - Reason: multiline text area.
- Validation:
  - Client-side: prevents submission if any required field is empty.
  - Server-side: requires counselor existence and non-empty reason; blocks submissions if the student has a pending borrowing.
- Submission:
  - Sends a POST request to the student request endpoint with teacher_id, reason, and preferred_datetime.
  - On success, shows an alert and navigates to the student history page; otherwise shows an error alert.
- User feedback:
  - Loading indicators during counselor list fetch and submission.
  - Alerts for success and error messages returned by the backend.

```mermaid
flowchart TD
Start(["Form Load"]) --> FetchGuru["Fetch Counselors"]
FetchGuru --> Ready["Form Ready"]
Ready --> Input["User fills fields"]
Input --> Validate{"Required fields<br/>filled?"}
Validate --> |No| AlertEmpty["Show alert: fill all fields"]
AlertEmpty --> Input
Validate --> |Yes| Submit["POST /api/siswa/pengajuan"]
Submit --> Resp{"Success?"}
Resp --> |Yes| Success["Alert success<br/>Navigate to history"]
Resp --> |No| Error["Alert error message"]
Success --> End(["Done"])
Error --> End
```

**Diagram sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)

**Section sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)

### Counselor Approval Panel
- Retrieves pending requests assigned to the logged-in counselor via the counselor request endpoint.
- Provides Approve and Reject buttons for each pending request.
- On action, posts to the respective approve/reject endpoint and removes the item from the list.

```mermaid
sequenceDiagram
participant Guru as "Counselor UI<br/>app/gurubk/pengajuan/page.jsx"
participant API as "Counselor Requests<br/>app/api/guru/pengajuan/route.js"
participant Approve as "Approve Endpoint<br/>app/api/guru/pengajuan/[id]/approve/route.js"
participant Reject as "Reject Endpoint<br/>app/api/guru/pengajuan/[id]/reject/route.js"
participant DB as "Database<br/>lib/database.js"
Guru->>API : GET /api/guru/pengajuan
API->>DB : SELECT pending requests for teacher
DB-->>API : Pending list
API-->>Guru : {pengajuan : [...]}
Guru->>Approve : POST /api/guru/pengajuan/{id}/approve
Approve->>DB : UPDATE status=approved
DB-->>Approve : OK
Approve-->>Guru : {status : "success"}
Guru->>Reject : POST /api/guru/pengajuan/{id}/reject
Reject->>DB : UPDATE status=rejected
DB-->>Reject : OK
Reject-->>Guru : {status : "success"}
```

**Diagram sources**
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)
- [database.js](file://lib/database.js)

**Section sources**
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)

### Borrowing System Integration and Conflict Detection
- Unified borrowing table supports multiple types (konseling, pinjam, lainnya) and statuses (pending, approved, rejected, completed).
- Conflict detection prevents double-booking by excluding rejected records when checking for existing bookings at the same time and for the same counselor.
- The system integrates with two submission paths:
  - New student request endpoint writes to the borrowing table with type konseling and status pending.
  - Legacy borrowings endpoint validates inputs, checks conflicts, and inserts borrowing records.

```mermaid
flowchart TD
A["Submit Request"] --> B["Validate inputs"]
B --> C{"Counselor exists?"}
C --> |No| E["Return 404 Not Found"]
C --> |Yes| D["Check conflicts (non-rejected)"]
D --> F{"Conflict found?"}
F --> |Yes| G["Return 409 Conflict"]
F --> |No| H["Insert borrowing record"]
H --> I["Return 201 Created"]
```

**Diagram sources**
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)
- [databasebk.sql](file://databasebk.sql)

**Section sources**
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)
- [databasebk.sql](file://databasebk.sql)

### Data Model Overview
The borrowing table stores request metadata, status, and timestamps. Additional related tables support scheduling, reports, and notes.

```mermaid
erDiagram
USERS {
bigint id PK
varchar email UK
varchar role
varchar name
}
BORROWS {
bigint id PK
bigint student_id FK
bigint teacher_id FK
enum type
varchar title
text description
enum status
timestamp requested_at
datetime scheduled_at
timestamp approved_at
timestamp rejected_at
timestamp completed_at
}
JADWAL_KONSELING {
bigint id PK
bigint student_id FK
bigint teacher_id FK
datetime scheduled_datetime
int duration_minutes
varchar lokasi
enum status
}
LAPORAN_KONSELING {
bigint id PK
bigint jadwal_id FK
bigint student_id FK
bigint teacher_id FK
text summary
text detail
text follow_up
}
USERS ||--o{ BORROWS : "enrolls"
USERS ||--o{ JADWAL_KONSELING : "attends"
JADWAL_KONSELING ||--o{ LAPORAN_KONSELING : "reported_by"
```

**Diagram sources**
- [databasebk.sql](file://databasebk.sql)

**Section sources**
- [databasebk.sql](file://databasebk.sql)

## Dependency Analysis
- Frontend pages depend on NextAuth session management and Next.js routing.
- API routes depend on the shared database query utility and NextAuth session extraction.
- The borrowing endpoint depends on the database pool and performs SQL queries to validate counselors, check conflicts, and insert records.
- Counselor endpoints depend on session validation and join queries to present pending requests.

```mermaid
graph LR
S_Ajukan["app/siswa/ajukan/page.jsx"] --> API_Siswa_Pengajuan["app/api/siswa/pengajuan/route.js"]
S_Ajukan --> API_Siswa_Guru["app/api/siswa/guru/route.js"]
G_Pengajuan["app/gurubk/pengajuan/page.jsx"] --> API_Guru_Pengajuan["app/api/guru/pengajuan/route.js"]
G_Pengajuan --> API_Guru_Approve["app/api/guru/pengajuan/[id]/approve/route.js"]
G_Pengajuan --> API_Guru_Reject["app/api/guru/pengajuan/[id]/reject/route.js"]
API_Siswa_Pengajuan --> DB["lib/database.js"]
API_Guru_Pengajuan --> DB
API_Guru_Approve --> DB
API_Guru_Reject --> DB
API_Borrowings["app/api/borrowings/route.js"] --> DB
```

**Diagram sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/siswa/guru/route.js)
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)

**Section sources**
- [page.jsx](file://app/siswa/ajukan/page.jsx)
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/siswa/guru/route.js)
- [page.jsx](file://app/gurubk/pengajuan/page.jsx)
- [route.js](file://app/api/guru/pengajuan/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/approve/route.js)
- [route.js](file://app/api/guru/pengajuan/[id]/reject/route.js)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)

## Performance Considerations
- Database connections are pooled and reused via a shared query utility.
- Indexes exist on frequently queried columns (users role/email, borrows student/teacher/status) to improve lookup performance.
- Dynamic route settings ensure fresh data retrieval for counselor request lists.
- Consider adding pagination for counselor request lists and student history if datasets grow large.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Unauthorized access: Ensure the user role is validated on both client and server; redirect unauthenticated users appropriately.
- Missing counselor: Verify the counselor ID exists and belongs to a user with role guru.
- Pending request conflict: Prevent submission if the student already has a pending borrowing; prompt the user to resolve the conflict first.
- Conflict detection failures: Confirm that the conflict check excludes rejected records and matches the same counselor and time slot.
- Server errors: Inspect server logs for detailed error messages returned by the backend.

**Section sources**
- [route.js](file://app/api/siswa/pengajuan/route.js)
- [route.js](file://app/api/borrowings/route.js)
- [database.js](file://lib/database.js)

## Conclusion
The appointment request system provides a streamlined workflow for students to submit counseling requests, with robust validation, conflict detection, and a clear approval process for counselors. The unified borrowing model centralizes request management, while separate UIs serve student and counselor needs effectively. Extending the system could involve adding scheduling confirmations, notifications, and richer reporting capabilities.