# Joineazy - Assignment & Review Dashboard

Frontend Intern Assignment (Task 1) submission for Joineazy.

This repository contains a responsive, client-side dashboard built with React and Tailwind CSS. It supports two core roles—**Student** and **Admin (Faculty)**—with strict data isolation, two-step submission verification, multi-student distribution, search/sorting, dark mode, and persistent storage via `localStorage`.

---

## Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm start
```
The app will be accessible at `http://localhost:3000`.

### Running Tests
The project includes unit and integration tests written with Jest and React Testing Library:
```bash
npm test -- --watchAll=false
```

### Production Build
```bash
npm run build
```
The optimized production bundle will be generated in the `build/` directory.

---

## Demo Accounts

No real backend or passwords are needed. You can switch between accounts at any time using the quick account switcher in the top navigation bar or the initial login screen.

### Faculty / Admins (2 Seeded)
| Name | Email | Initial Data |
| :--- | :--- | :--- |
| **Prof. Sarah Jenkins** | `admin1@joineazy.com` | Created 3 assignments (Distributed DB, Frontend, Cloud Microservices) |
| **Prof. David Miller** | `admin2@joineazy.com` | Created 1 assignment (Compiler Construction) |

### Students (5 Seeded)
| Name | Email | Student ID | Initial Status |
| :--- | :--- | :--- | :--- |
| **Alex Johnson** | `student1@joineazy.com` | CS-2024-001 | Assigned to 3 (2 Submitted, 1 Pending) |
| **Bella Chen** | `student2@joineazy.com` | CS-2024-002 | Assigned to 2 (1 Submitted, 1 Overdue) |
| **Carlos Rodriguez** | `student3@joineazy.com` | CS-2024-003 | Assigned to 3 (1 Submitted, 1 Pending, 1 Overdue) |
| **Divya Patel** | `student4@joineazy.com` | CS-2024-004 | Assigned to 2 (2 Pending) |
| **Ethan Wright** | `student5@joineazy.com` | CS-2024-005 | Assigned to 3 (1 Submitted, 2 Pending) |

*Note: You can reset all demo data back to default seed state at any time using the refresh icon in the top header.*

---

## Core Features & Workflow

### 1. Student View
- **Personalized Dashboard:** Students see only the assignments assigned to them.
- **Two-Step Submission Flow:**
  1. Clicking **"Yes, I have submitted"** does not immediately mark the assignment as done.
  2. A confirmation modal opens reminding the student to verify that their deliverables are uploaded to the provided Google Drive link with proper access permissions.
  3. Once confirmed, the status updates to `Submitted`, the exact submission timestamp is recorded, and the progress bar updates.
- **Progress Tracking:** Shows real-time statistics (e.g. `3 of 5 Submitted`) and remaining count.
- **Filtering & Search:** Filter by Pending, Submitted, or Overdue, or search by assignment title/description.

### 2. Admin / Faculty View
- **Assignment Management (CRUD):** Faculty can create, edit, and delete assignments.
- **Flexible Distribution:**
  - Assign to **All Students** with one click.
  - Or choose **Selected Students** with an interactive multi-select checklist (includes Select All and Clear helpers).
- **Class Progress & Roster:**
  - Progress bar shows the class completion percentage and ratio (`submitted / totalAssigned`).
  - Student status pills (Submitted ✓, Pending, or Overdue) are displayed directly on the card/table.
  - Clicking **"View Student Roster"** displays the full class list with individual submission timestamps.
- **Dual View Modes:** Toggle between card grid view and compact tabular view.
- **Student Directory Tab:** View overall submission performance and rates across all enrolled students.

### 3. General & Bonus Features
- **Strict Data Isolation:** Students only receive data intended for their student ID; admins only manage assignments they personally created.
- **Data Persistence:** Stored in `localStorage` with versioned keys and defensive JSON parsing. Persists across page reloads.
- **Overdue Highlighting:** Automatically flags assignments as Overdue once the due date passes without a submission.
- **Dark Mode:** Built-in theme toggle with `localStorage` preference persistence.
- **Responsive Layout:** Works smoothly on desktop, tablet, and mobile screens (includes mobile slide-out navigation drawer).

---

## Folder Structure

```
src/
├── components/
│   ├── assignments/          # Role-specific assignment cards, table, and roster modal
│   │   ├── AdminAssignmentCard.jsx
│   │   ├── AdminAssignmentTable.jsx
│   │   ├── StudentAssignmentCard.jsx
│   │   └── StudentRosterModal.jsx
│   ├── common/               # Shared UI primitives (buttons, badges, modals, icons, progress bars)
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Icons.jsx
│   │   ├── Modal.jsx
│   │   └── ProgressBar.jsx
│   ├── dialogs/              # Action confirmation dialogs
│   │   ├── ConfirmDeleteDialog.jsx
│   │   ├── ConfirmResetDialog.jsx
│   │   └── ConfirmSubmissionDialog.jsx
│   ├── forms/                # Form modals
│   │   └── AssignmentFormModal.jsx
│   └── layout/               # Header, sidebar, user switcher, and responsive shell
│       ├── Header.jsx
│       ├── Layout.jsx
│       ├── Sidebar.jsx
│       └── UserSwitcher.jsx
├── context/                  # React Context providers for global state
│   ├── AssignmentContext.jsx # Assignments state, CRUD, submissions, and metrics
│   ├── AuthContext.jsx       # Current user, login/logout, role switching
│   ├── ThemeContext.jsx      # Light / dark mode state
│   └── ToastContext.jsx      # Feedback toast notifications
├── data/
│   └── seedData.js           # Default users (2 admins, 5 students) and initial assignments
├── pages/
│   ├── AdminDashboard/
│   │   └── AdminDashboard.jsx
│   ├── Login/
│   │   └── LoginPage.jsx
│   └── StudentDashboard/
│       └── StudentDashboard.jsx
├── services/
│   ├── assignmentService.js  # Business logic: role-based data filtering and isolation
│   └── storageService.js     # Safe localStorage read/write with fallback handling
├── utils/
│   ├── dateUtils.js          # Date formatting, relative due dates, overdue detection
│   ├── progressUtils.js      # Completion percentage calculations
│   └── validationUtils.js    # Form input and URL validation
├── App.js                    # Root component with layout and role routing
├── index.css                 # Tailwind CSS base and directives
└── index.js                  # Application entry point
```

---

## Component Architecture & Data Flow

```
+-----------------------------------------------------------+
|                        App.js                             |
|  (ThemeProvider -> ToastProvider -> AuthProvider ->       |
|   AssignmentProvider)                                     |
+-----------------------------------------------------------+
                             |
         +-------------------+-------------------+
         |                                       |
    [Logged Out]                            [Logged In]
         |                                       |
    LoginPage.jsx                             Layout.jsx
                              (Header + Sidebar + UserSwitcher)
                                                 |
                         +-----------------------+-----------------------+
                         |                                               |
                  (Role: Student)                                  (Role: Admin)
                         |                                               |
               StudentDashboard.jsx                             AdminDashboard.jsx
            - StudentAssignmentCard.jsx                      - AdminAssignmentCard.jsx
            - ConfirmSubmissionDialog.jsx                    - AdminAssignmentTable.jsx
            - Progress & Filters                             - AssignmentFormModal.jsx
                                                             - StudentRosterModal.jsx
                                                             - ConfirmDeleteDialog.jsx
```

### Context Breakdown
1. **`AuthContext`**: Manages the logged-in user profile, mock login, and instant switching. Exposes helper booleans (`isAdmin`, `isStudent`).
2. **`AssignmentContext`**: Acts as the central store for assignments. Persists to `localStorage` on any state update, and provides isolated selector functions:
   - `getStudentAssignments(studentId)`: Filters assignments and strips private submission data of other students.
   - `getAdminAssignments(adminId)`: Filters assignments created by the specific admin.
   - `submitAssignment(asgId, studentId)`: Updates submission status and records the timestamp.
3. **`ThemeContext`**: Manages the active color scheme (`light` vs `dark`) and syncs with `document.documentElement.classList`.
4. **`ToastContext`**: Provides toast notifications across the application for form actions and state changes.

---

## Key Design Decisions

1. **Context API over External State Libraries (Redux / Zustand):**
   Given the scope of the project, React's native Context API combined with custom hooks (`useAuth`, `useAssignments`) provides clean state separation without extra boilerplate or bundle overhead.

2. **Strict Data Isolation in the Service Layer:**
   Data isolation is enforced at the selector/service layer (`assignmentService.js`), not just hidden in CSS or component rendering:
   - For students, only assignments matching `assignedStudentIds` are returned. Other students' submission timestamps and statuses are never leaked to the student client.
   - For faculty, only assignments matching `createdBy === adminId` are returned.

3. **Two-Step Submission Flow:**
   In online educational dashboards, accidentally clicking "Submit" can cause unnecessary stress. Requiring a second verification step with a reminder checklist ensures students confirm they have granted folder access before logging their official submission.

4. **Preserving Submissions on Assignment Edit:**
   When an admin edits an existing assignment (e.g. changing the title or adding/removing assigned students), students who were already assigned retain their existing submission status (`Submitted` or `Pending`). Newly added students are initialized to `Pending`, and removed students' records are cleanly pruned.

5. **Defensive Storage Parsing:**
   Local storage operations are wrapped in safe JSON serialization and versioned keys (`joineazy_v1_*`). If stored data is corrupted or outdated, the app falls back to default seed data rather than crashing.

---

## Testing

30 unit and integration tests are included covering:
- **Validation:** Form input fields, minimum length checks, and URL formats.
- **Date calculations:** Overdue detection and relative date formatting.
- **Progress analytics:** Completion rates, pending count, and overdue count.
- **Service layer:** Student isolation, admin isolation, and submission recording.
- **Integration flows:**
  - Login and account switching.
  - Student two-step submission flow.
  - Admin assignment creation with working input fields.
  - Admin assignment editing and updating.

Run all tests:
```bash
npm test -- --watchAll=false
```

---

## Deployment

### Vercel
1. Push this repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select this repository.
3. Framework Preset: **Create React App**.
4. Click **Deploy**.

### Netlify
1. Connect your GitHub repository in Netlify.
2. Build command: `npm run build`
3. Publish directory: `build`
4. Click **Deploy Site**.
