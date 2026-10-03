# BSCpE Examination Question Data Bank - Firebase Database Specification (`database.md`)

This document provides the complete, production-grade schema and architecture specification for integrating **Google Cloud Firestore** as the centralized NoSQL database for the **BS Computer Engineering (BSCpE) Exam Question Data Bank and Test Paper Generator**.

---

## 1. Architectural Overview

The application utilizes a **document-oriented, multi-tenant RBAC (Role-Based Access Control)** structure in Firebase Firestore:

* **Primary Engine**: Google Cloud Firestore (Native Mode / Enterprise Edition)
* **Authentication**: Firebase Authentication (Google Workspace OAuth / Institutional SSO / Email-Password)
* **Access Control**: Attribute-Based Access Control (ABAC) and Role-Based Access Control (RBAC) implemented via `firestore.rules`
* **Data Invariant Principle**: Strict validation of document shapes, immutable creation timestamps (`request.time`), and author-bound document integrity.

---

## 2. Document ID Naming Conventions & Entity Identifier Standards

To ensure predictable indexing, search optimization, human readability, and referential integrity, the system adheres to strict ID conventions:

| Entity | Collection Path | ID Format / Convention | Example ID |
| :--- | :--- | :--- | :--- |
| **System User** | `/users/{userId}` | `user-{role_slug}-{timestamp_hash}` or Firebase Auth `UID` | `user-faculty-author-88491` or `qZ8vR9kL1pM4` |
| **Course** | `/courses/{courseCode}` | Normalized course code with hyphen | `CPE-101`, `CPE-201`, `CPE-311` |
| **Question** | `/questions/{questionId}` | `BSCPE-{CATEGORY_CODE}-{YEAR}-{3DIGIT_SEQ}` | `BSCPE-PROG-2026-001`, `BSCPE-DLD-2026-015` |
| **Review Log** | `/questions/{questionId}/review_logs/{logId}` | `rev-{timestamp}-{rand4}` | `rev-1727658932000-a89f` |
| **Examination** | `/examinations/{examId}` | `EXAM-{COURSE_CLEAN}-{ASSESSMENT_SLUG}-{YEAR}-{HASH}` | `EXAM-CPE201-MIDTERM-2026-X9A2` |
| **Audit Log** | `/audit_logs/{logId}` | `log-{timestamp_ms}` | `log-1727658932000` |
| **System Setting** | `/system_settings/{settingId}` | Static singleton document identifiers | `institution_profile`, `tos_bloom_matrix` |

---

## 3. Collections & Document Schema Specification

### 3.1. Collection: `/users`
Stores institutional personnel profiles, assigned institutional roles, academic ranks, departments, and specific RBAC capability grants.

* **Document ID**: `{userId}` (`string`, 1–128 chars, matching `^[a-zA-Z0-9_\-]+$`)
* **Security Model**: Authenticated users can read directory info; users can update non-RBAC fields of their own profile; only `admin` can modify `role`, `permissions`, or create new users.

| Field Name | Type | Required | Constraints / Enums | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Yes | Matching document ID | Unique system user identifier |
| `name` | `string` | Yes | 2–120 chars | Full name with academic honorifics (e.g., `Engr. Maria Santos, MSc`) |
| `email` | `string` | Yes | Valid email format, lowercase | Institutional email (`@univ.edu.ph`) |
| `role` | `string` | Yes | `'faculty_author'`, `'reviewer'`, `'examiner'`, `'admin'` | Primary institutional RBAC role |
| `department` | `string` | Yes | 2–150 chars | Institutional department or academic unit |
| `title` | `string` | No | Max 150 chars | Academic rank / position title (e.g., `Assistant Professor & Course Lead`) |
| `designation` | `string` | No | Max 100 chars | Display designation (e.g., `Faculty Author`) |
| `avatar` | `string` | No | 1–4 chars | Monogram initials used for avatar badge (e.g., `MS`) |
| `permissions` | `array<string>`| Yes | Max 50 items | List of authorized system operations and capabilities |
| `isActive` | `boolean` | No | Default `true` | Account active status |
| `createdAt` | `timestamp` / `string`| Yes | ISO8601 or server timestamp | Account creation date |
| `updatedAt` | `timestamp` / `string`| Yes | ISO8601 or server timestamp | Last profile update timestamp |

---

### 3.2. Collection: `/courses`
Stores the official BS Computer Engineering curriculum catalog, course descriptions, prerequisite tracks, and modular syllabus topics/subtopics.

* **Document ID**: `{courseCode}` (e.g., `CPE-101`, `CPE-201`, `CPE-211`, `CPE-311`)
* **Security Model**: Public read for all authenticated institutional roles; Create, Update, and Delete restricted strictly to `admin`.

| Field Name | Type | Required | Constraints / Enums | Description |
| :--- | :--- | :---: | :--- | :--- |
| `code` | `string` | Yes | Pattern `^CPE\s[0-9]{3}$` | Formal course code (e.g., `CPE 201`) |
| `title` | `string` | Yes | 3–150 chars | Course title (e.g., `Object-Oriented Programming`) |
| `category` | `string` | Yes | `'Programming'`, `'CE Fundamentals'`, `'Computing Systems'`, `'Advanced Specialized'` | Curriculum classification track |
| `description` | `string` | Yes | Max 2000 chars | Course syllabus description and overview |
| `topics` | `array<map>` | Yes | Min 1 topic | Structured topics list with nested subtopics |
| `topics[].id` | `string` | Yes | Alphanumeric slug | Topic identifier (e.g., `cpe201-t1`) |
| `topics[].name` | `string` | Yes | 2–100 chars | Topic name (e.g., `Encapsulation & Classes`) |
| `topics[].subtopics` | `array<string>` | Yes | List of strings | Specific course syllabus learning subtopics |
| `createdAt` | `string` | No | ISO8601 | Course entry creation date |
| `updatedAt` | `string` | No | ISO8601 | Last syllabus update timestamp |

---

### 3.3. Collection: `/questions`
Centralized repository for all examination questions across the 12 BSCpE formats, tagging Bloom's Taxonomy, syllabus outcomes (CLOs), test cases, and verification states.

* **Document ID**: `{questionId}` (e.g., `BSCPE-PROG-2026-001`)
* **Security Model**: 
  - Read: Authenticated users can query and read.
  - Create: `faculty_author` or `admin`. Author ID must equal `request.auth.uid`.
  - Update: 
    - Authors can edit their own `Draft` questions.
    - Reviewers can update `status`, `reviewFeedback`, `reviewRecommendations`.
    - Admin can update all fields.
  - Delete: Author (if Draft) or `admin`.

| Field Name | Type | Required | Constraints / Enums | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Yes | Unique ID | Question identifier code |
| `program` | `string` | Yes | Default: `Bachelor of Science in Computer Engineering` | Degree program name |
| `courseCode` | `string` | Yes | Foreign key to `courses.code` | Course code (e.g., `CPE 201`) |
| `courseTitle` | `string` | Yes | Matching course title | Course descriptive title |
| `topic` | `string` | Yes | Syllabus topic | Primary course topic |
| `subtopic` | `string` | Yes | Syllabus subtopic | Specific modular subtopic |
| `questionType` | `string` | Yes | 12 Formats: `'multiple_choice'`, `'true_false'`, `'matching'`, `'fill_in_blank'`, `'coding_problem'`, `'code_completion'`, `'code_snippet'`, `'debugging'`, `'problem_solving'`, `'algorithm_tracing'`, `'pseudocode'`, `'flowchart'` | Question format specification |
| `questionText` | `string` | Yes | 5–10,000 chars | Full problem statement / prompt |
| `explanation` | `string` | Yes | Detailed rationale | Scientific rationale & pedagogical explanation |
| `difficultyLevel` | `string` | Yes | `'Easy'`, `'Medium'`, `'Hard'`, `'Expert'` | Estimated item difficulty |
| `cognitiveLevel` | `string` | Yes | `'Remembering'`, `'Understanding'`, `'Applying'`, `'Analyzing'`, `'Evaluating'`, `'Creating'` | Revised Bloom's Taxonomy cognitive classification |
| `learningOutcome` | `string` | Yes | Max 300 chars | Syllabus Course Learning Outcome (CLO) tag |
| `assessmentType` | `string` | Yes | `'Quiz'`, `'Prelim Exam'`, `'Midterm Exam'`, `'Final Exam'`, `'Practical Laboratory'` | Targeted institutional assessment |
| `points` | `number` | Yes | 1 to 100 | Score weight points |
| `status` | `string` | Yes | `'Draft'`, `'Submitted'`, `'For Review'`, `'Approved'`, `'Published'`, `'Archived'` | 6-stage OBE verification status |
| `author` | `string` | Yes | Author display name | Name of faculty member author |
| `authorId` | `string` | No | Foreign key to `users.id` | User identifier of creating author |
| `reviewer` | `string` | No | Reviewer display name | Name of approving curriculum validator |
| `reviewerId` | `string` | No | Foreign key to `users.id` | User identifier of assigned reviewer |
| `reviewFeedback` | `string` | No | Max 2000 chars | Review comments or required revision notes |
| `reviewRecommendations`| `string` | No | Max 1000 chars | Actionable rubric recommendation checklist |
| `academicYear` | `string` | Yes | Format `YYYY-YYYY` (e.g., `2025-2026`) | Academic curriculum year |
| `semester` | `string` | Yes | `'1st Semester'`, `'2nd Semester'`, `'Summer'` | Academic term |
| `version` | `number` | Yes | Integer >= 1 | Question revision iteration number |
| `dateCreated` | `string` | Yes | Format `YYYY-MM-DD` | Creation date |
| `dateModified` | `string` | Yes | Format `YYYY-MM-DD` | Last modification date |

#### Format-Specific Optional Fields in `/questions`:
* **Multiple Choice**: `choices` (`array<string>`, 2–6 items), `correctAnswer` (`number` index, 0-based).
* **True / False**: `correctAnswer` (`boolean`).
* **Fill in the Blank**: `correctAnswer` (`string`), `alternativeAnswers` (`array<string>`), `isCaseSensitive` (`boolean`).
* **Matching**: `matchingPairs` (`array<map>` with `id`, `itemA`, `itemB`), `instructions` (`string`).
* **Coding Problem & Code Snippet**: `programmingLanguage` (`'C'`, `'C++'`, `'Python'`, `'Java'`, `'Verilog'`, `'Assembly'`, `'Pseudocode'`), `codeSnippet` (`string`), `sampleInput` (`string`), `sampleOutput` (`string`), `testCases` (`array<map>` with `id`, `input`, `expectedOutput`, `weight`, `isHidden`), `timeLimitMs` (`number`), `memoryLimitMb` (`number`).
* **Debugging**: `buggyCode` (`string`), `expectedBehavior` (`string`), `debugHints` (`string`).
* **Flowchart**: `flowchartNodes` (`array<map>` with `id`, `type`: terminal/process/decision/io, `label`, `yesNext`, `noNext`, `next`).
* **Algorithm Tracing**: `traceVariables` (`array<string>`), `traceTableHeaders` (`array<string>`), `expectedTraceSteps` (`array<map>`).

---

### 3.4. Subcollection: `/questions/{questionId}/review_logs`
Historical timeline tracking every quality audit, approval, return for revision, or rejection event for a question.

* **Document ID**: `{logId}` (`string`, e.g., `rev-1727658932000-a89f`)
* **Security Model**: Append-only log; created by `reviewer` or `admin`.

| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Yes | Log record ID |
| `questionId` | `string` | Yes | Target question ID |
| `reviewer` | `string` | Yes | Full name of reviewing validator |
| `reviewerId` | `string` | Yes | User ID of reviewing validator |
| `action` | `string` | Yes | `'Approved'`, `'Returned'`, `'Rejected'` |
| `comments` | `string` | Yes | Rubric evaluation commentary |
| `recommendations` | `string` | No | Improvement recommendations |
| `timestamp` | `string` | Yes | Timestamp ISO8601 |

---

### 3.5. Collection: `/examinations`
Stores generated multi-set examination papers, Table of Specifications (TOS) calculations, question orders, and scrambled answer keys.

* **Document ID**: `{examId}` (e.g., `EXAM-CPE201-MIDTERM-2026-X9A2`)
* **Security Model**: Read and Create allowed for `examiner` and `admin`.

| Field Name | Type | Required | Constraints / Enums | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Yes | Unique ID | Exam paper identifier |
| `title` | `string` | Yes | 5–200 chars | Examination title (e.g., `CPE 201 Midterm Examination`) |
| `program` | `string` | Yes | Default: BSCpE | Degree program |
| `courseCode` | `string` | Yes | Ref to `courses.code` | Course code |
| `courseTitle` | `string` | Yes | Ref to `courses.title` | Course title |
| `academicYear` | `string` | Yes | `YYYY-YYYY` | Academic year |
| `semester` | `string` | Yes | Term name | Academic semester |
| `assessmentType` | `string` | Yes | `'Midterm Exam'`, `'Final Exam'`, etc. | Assessment tier |
| `examDate` | `string` | Yes | Date string | Scheduled exam administration date |
| `timeDurationMinutes` | `number`| Yes | 15–300 | Duration allowed in minutes |
| `instructions` | `string` | Yes | Max 2000 chars | General proctoring & student exam instructions |
| `totalPoints` | `number` | Yes | Sum of question weights | Total possible score |
| `totalItems` | `number` | Yes | Count of questions | Number of test items |
| `sets` | `array<map>` | Yes | Array of Set A-D | Scrambled multi-set test configurations |
| `sets[].setCode` | `string` | Yes | `'A'`, `'B'`, `'C'`, `'D'` | Test set designation |
| `sets[].questions` | `array<map>` | Yes | Array of Question data | Scrambled questions with randomized choices |
| `sets[].answerKey` | `array<map>` | Yes | Array of answers | Key mapping question number to answer |
| `tosMatrix` | `array<map>` | Yes | Array of TOS items | Outcome-Based Education Table of Specifications |
| `createdBy` | `string` | Yes | User display name | Name of faculty examiner |
| `createdById` | `string` | No | User ID | Identifier of faculty examiner |
| `createdAt` | `string` | Yes | ISO8601 | Generation timestamp |
| `status` | `string` | Yes | `'Draft'`, `'Finalized'`, `'Printed'` | Examination lifecycle status |

---

### 3.6. Collection: `/audit_logs`
Append-only tamper-evident security audit trail capturing all system events, status changes, question approvals, course alterations, and account management.

* **Document ID**: `{logId}` (e.g., `log-1727658932000`)
* **Security Model**: Append-only (create allowed by authenticated institutional roles); reads restricted to `admin`; updates and deletions are **strictly forbidden** (`allow update, delete: if false`).

| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Yes | Audit log record ID |
| `timestamp` | `string` | Yes | Timestamp of event (`YYYY-MM-DD HH:mm:ss`) |
| `user` | `string` | Yes | Name of executing user |
| `userId` | `string` | No | Identifier of executing user |
| `role` | `string` | Yes | Active user role during event execution |
| `action` | `string` | Yes | Action name (e.g., `Question Approved`, `User Account Created`) |
| `entityType` | `string` | Yes | `'Question'`, `'Exam'`, `'Course'`, `'Setting'`, `'User'` |
| `entityId` | `string` | Yes | Identifier of affected resource |
| `details` | `string` | Yes | Detailed event description and context |

---

### 3.7. Collection: `/system_settings`
Global configuration documents governing institutional parameters, default TOS Bloom taxonomy weights, and system policies.

* **Document ID**: `institution_profile` / `tos_bloom_matrix`
* **Security Model**: Read by any authenticated user; write strictly restricted to `admin`.

| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `institutionName` | `string` | Yes | Institution Name (e.g., `State University of Engineering & Technology`) |
| `college` | `string` | Yes | College Name (e.g., `College of Engineering and Technology`) |
| `department` | `string` | Yes | Department Name (e.g., `Department of Computer Engineering`) |
| `defaultAcademicYear`| `string` | Yes | Current active academic calendar year |
| `defaultSemester` | `string` | Yes | Current active term |
| `tosWeights` | `map` | No | Recommended Bloom weights (`Remembering: 20`, `Understanding: 30`, etc.) |

---

## 4. UI Element Identification & Testing Matrix (`id` and `name` Registry)

For automated end-to-end testing, accessibility compliance, and QA script verification, the following HTML `id` and `name` attributes are integrated across key application components:

### 4.1. User Accounts & RBAC (`src/components/Admin/UserAccountsView.tsx`)
* `id="add-user-by-role-btn"`: Primary modal trigger to add an institutional user.
* `id="search-users-input"`, `name="searchUsers"`: Real-time search query input.
* `id="filter-role-tab-ALL"`, `id="filter-role-tab-faculty_author"`, `id="filter-role-tab-reviewer"`, `id="filter-role-tab-examiner"`, `id="filter-role-tab-admin"`: Role filter pills.
* `id="quick-add-faculty_author-btn"`, `id="quick-add-reviewer-btn"`, `id="quick-add-examiner-btn"`, `id="quick-add-admin-btn"`: Shortcut buttons on role stat cards.
* `id="user-accounts-table"`: The main user directory table element.
* Row-level elements:
  * `id="user-row-{userId}"`, `data-testid="user-row-{userId}"`
  * `id="user-name-{userId}"`
  * `id="user-email-{userId}"`
  * `id="user-role-badge-{userId}"`
  * `id="user-dept-{userId}"`
  * `id="inspect-rbac-btn-{userId}"`: Button opening RBAC permission inspector.
  * `id="edit-user-btn-{userId}"`: Button opening modal in edit mode.
  * `id="delete-user-btn-{userId}"`: Button triggering account removal.
  * `id="test-persona-btn-{userId}"`: Button switching session persona.

### 4.2. Add User by Role Modal (`src/components/Admin/AddUserModal.tsx`)
* `id="add-user-form"`, `name="addUserForm"`: The root form element.
* Role Selection Buttons:
  * `id="role-select-faculty_author"`, `name="roleOption"`, `data-role="faculty_author"`
  * `id="role-select-reviewer"`, `name="roleOption"`, `data-role="reviewer"`
  * `id="role-select-examiner"`, `name="roleOption"`, `data-role="examiner"`
  * `id="role-select-admin"`, `name="roleOption"`, `data-role="admin"`
* Form Input Fields:
  * `id="user-name-input"`, `name="name"`: Full name input.
  * `id="user-email-input"`, `name="email"`: Institutional email input.
  * `id="user-title-input"`, `name="title"`: Academic rank input.
  * `id="user-department-input"`, `name="department"`: Department unit input.
  * `id="user-password-input"`, `name="password"`: Password input.
  * `id="generate-password-btn"`: Helper button generating a strong password.
  * `id="toggle-password-visibility-btn"`: Show/hide password toggle.
  * `id="user-avatar-input"`, `name="avatar"`: Avatar monogram initials.
  * `id="permission-checkbox-{index}"`, `name="permissions"`: Checkbox for each RBAC capability.
  * `id="custom-permission-input"`, `name="customPermission"`: Add custom authorization privilege.
  * `id="add-custom-permission-btn"`: Action button to append custom privilege.
  * `id="reset-permissions-btn"`: Reset permissions to role defaults.
  * `id="cancel-user-modal-btn"`: Dismiss modal.
  * `id="submit-user-btn"`: Submit new user or save updates.

### 4.3. Authentication & Login Screen (`src/components/Auth/LoginPage.tsx`)
* Mode toggles: `id="persona-mode-tab"`, `id="credentials-mode-tab"`
* Credentials inputs:
  * `id="login-email-input"`, `name="email"`
  * `id="login-password-input"`, `name="password"`
  * `id="login-remember-me"`, `name="rememberMe"`
  * `id="login-submit-btn"`
* Quick Persona buttons: `id="persona-login-btn-{userId}"`

### 4.4. Examination & Test Paper Generator (`src/components/ExamGenerator/ExamGeneratorView.tsx`)
* Action & Print Buttons:
  * `id="exam-print-both-btn"`, `name="printBothBtn"`: Single-click print both Examination Paper and Master Answer Key with clean page-break.
  * `id="exam-export-pdf-modal-btn"`, `name="exportPdfModalBtn"`: Open PDF export configuration modal.
  * `id="exam-print-paper-btn"`, `name="printPaperBtn"`: Print examination paper document only.
  * `id="exam-print-key-btn"`, `name="printKeyBtn"`: Print master answer key only.
* Navigation Tabs:
  * `id="exam-tab-config"`, `name="examTab"`: Configuration & Blueprint Builder
  * `id="exam-tab-custom_print"`, `name="examTab"`: Custom Print Layout (Exam Paper + Separated Answer Key)
  * `id="exam-tab-preview_paper"`, `name="examTab"`: Exam Paper Preview
  * `id="exam-tab-answer_key"`, `name="examTab"`: Master Answer Key & Scoring Guide
  * `id="exam-tab-tos_matrix"`, `name="examTab"`: Table of Specifications (TOS)
  * `id="exam-tab-omr_sheet"`, `name="examTab"`: Student OMR Answer Bubble Grid
* Configuration Form Controls:
  * `id="exam-course-select"`, `name="courseCode"`: Target BSCpE Course dropdown
  * `id="exam-term-select"`, `name="examTitle"`: Examination term selector
  * `id="exam-academic-year-input"`, `name="academicYear"`: Academic year input
  * `id="exam-semester-select"`, `name="semester"`: Academic semester selector
  * `id="exam-time-duration-input"`, `name="timeDurationMinutes"`: Exam duration limit in minutes
  * `id="exam-institution-name-input"`, `name="institutionName"`: University header institution name
  * `id="exam-college-name-input"`, `name="collegeName"`: College name
  * `id="exam-department-name-input"`, `name="departmentName"`: Department name
  * `id="exam-instructions-input"`, `name="instructions"`: Proctoring and student directions
  * `id="exam-randomize-questions-checkbox"`, `name="randomizeQuestions"`: Question order shuffle toggle
  * `id="exam-randomize-choices-checkbox"`, `name="randomizeChoices"`: Option choices (A-D) shuffle toggle
  * `id="exam-randomize-matching-checkbox"`, `name="randomizeMatchingListB"`: Matching Column B shuffle toggle
  * `id="exam-set-checkbox-A"`, `id="exam-set-checkbox-B"`, `id="exam-set-checkbox-C"`, `id="exam-set-checkbox-D"`: Multi-set generation checkboxes
  * `id="exam-target-items-slider"`, `name="targetItems"`: Question pool slider
  * `id="exam-auto-generate-btn"`, `name="generateExamBtn"`: Primary generation execution trigger
* Print Document Containers:
  * `id="exam-combined-print-container"`: Unified container with Exam Paper + Answer Key (`page-break-before: always`).
  * `id="exam-paper-container"`: Official student test paper with university header and student info box.
  * `id="exam-answer-key-container"`: Faculty confidential scoring key with rapid-grading matrix.
  * `id="exam-tos-container"`: Outcome-Based Education (OBE) Table of Specifications matrix.
  * `id="exam-omr-container"`: Standardized student bubble answer sheet.

### 4.5. Question Editor Modal (`src/components/QuestionBank/QuestionEditorModal.tsx`)
* Form Input Fields:
  * `id="question-course-select"`, `name="courseCode"`
  * `id="question-topic-input"`, `name="topic"`
  * `id="question-subtopic-input"`, `name="subtopic"`
  * `id="question-type-select"`, `name="questionType"`
  * `id="question-text-input"`, `name="questionText"`
  * `id="question-explanation-input"`, `name="explanation"`
  * `id="question-difficulty-select"`, `name="difficultyLevel"`
  * `id="question-cognitive-select"`, `name="cognitiveLevel"`
  * `id="question-assessment-type-select"`, `name="assessmentType"`
  * `id="question-points-input"`, `name="points"`
  * `id="question-clo-input"`, `name="learningOutcome"`
  * `id="question-academic-year-input"`, `name="academicYear"`
  * `id="question-semester-select"`, `name="semester"`
* Form Actions:
  * `id="question-cancel-btn"`, `name="cancelQuestion"`
  * `id="question-save-draft-btn"`, `name="saveDraft"`
  * `id="question-submit-review-btn"`, `name="submitReview"`

### 4.6. Curriculum & Course Manager (`src/components/Curriculum/CourseManager.tsx`)
* `id="add-course-btn"`, `name="addCourseBtn"`: Trigger course creation modal.
* `id="course-code-input"`, `name="code"`: Course code (e.g., `CPE 431`).
* `id="course-category-select"`, `name="category"`: Disciplinary track.
* `id="course-title-input"`, `name="title"`: Course title.
* `id="course-description-input"`, `name="description"`: Syllabus scope.
* `id="course-topic-name-input"`, `name="topicName"`: Topic name.
* `id="course-subtopics-input"`, `name="subtopics"`: Modular subtopics.
* `id="add-topic-btn"`, `name="addTopicBtn"`: Add topic to draft list.
* `id="cancel-course-modal-btn"`, `name="cancelCourseBtn"`: Cancel course creation.
* `id="save-course-modal-btn"`, `name="saveCourseBtn"`: Save course to catalog.

### 4.7. Question Details & Print Card (`src/components/QuestionBank/QuestionDetailModal.tsx`)
* `id="printable-question-card"`: Printable question specification card with institutional header.
* `id="question-print-card-btn"`, `name="printQuestionCardBtn"`: Trigger isolated print dialog for question card.
* `id="question-detail-close-btn"`, `name="closeQuestionDetailBtn"`: Dismiss modal.

### 4.8. Security Audit Trail & Compliance Report (`src/components/AuditLogs/AuditLogView.tsx`)
* `id="printable-audit-report"`: Printable institutional compliance audit report.
* `id="print-audit-report-btn"`, `name="printAuditReportBtn"`: Trigger isolated print dialog for audit report.

### 4.9. System Operations Manual (`src/components/Manual/SystemManualView.tsx`)
* `id="system-manual-container"`: Printable operations manual container.
* `id="print-manual-btn"`, `name="printManualBtn"`: Trigger isolated print dialog for user manual.
* `id="manual-return-login-btn"`, `name="returnToLoginBtn"`: Navigation shortcut to sign-in portal.

---

## 5. Firestore Compound Indexes Specification

To support high-performance filtered querying in the Question Bank and Review Queue, the following composite indexes must be defined in `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "questions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "courseCode", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "dateModified", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "questions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "cognitiveLevel", "order": "ASCENDING" },
        { "fieldPath": "difficultyLevel", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "questions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "authorId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "dateModified", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "examinations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "courseCode", "order": "ASCENDING" },
        { "fieldPath": "academicYear", "order": "DESCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "audit_logs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "entityType", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 6. Firestore Security Rules Reference (`firestore.rules`)

When ready to provision Firestore, security rules enforcing strict Role-Based Access Control (RBAC) and data isolation should be deployed using the following hardened logic:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 0. Default Deny catch-all
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function hasRole(role) {
      return isSignedIn() && getUserData().role == role;
    }
    
    function isAdmin() {
      return hasRole('admin');
    }
    
    function isReviewer() {
      return hasRole('reviewer') || isAdmin();
    }
    
    function isExaminer() {
      return hasRole('examiner') || isAdmin();
    }
    
    function isAuthor() {
      return hasRole('faculty_author') || isAdmin();
    }

    // 1. Users collection: Read by authenticated, write strictly by Admin or Self (non-RBAC)
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isAdmin();
      allow update: if isAdmin() || (
        request.auth.uid == userId && 
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'permissions'])
      );
      allow delete: if isAdmin() && request.auth.uid != userId;
    }

    // 2. Courses collection: Read by authenticated, write by Admin
    match /courses/{courseCode} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // 3. Questions collection
    match /questions/{questionId} {
      allow read: if isSignedIn();
      allow create: if isAuthor();
      allow update: if isAdmin() || 
        (isAuthor() && resource.data.authorId == request.auth.uid && resource.data.status == 'Draft') ||
        (isReviewer() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'reviewer', 'reviewerId', 'reviewFeedback', 'reviewRecommendations', 'dateModified']));
      allow delete: if isAdmin() || (isAuthor() && resource.data.authorId == request.auth.uid && resource.data.status == 'Draft');

      match /review_logs/{logId} {
        allow read: if isSignedIn();
        allow create: if isReviewer();
        allow update, delete: if false; // Append-only
      }
    }

    // 4. Examinations collection
    match /examinations/{examId} {
      allow read: if isSignedIn();
      allow create, update: if isExaminer();
      allow delete: if isAdmin();
    }

    // 5. Audit logs: Append-only by any signed-in user, read strictly by Admin, no delete/update
    match /audit_logs/{logId} {
      allow read: if isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if false; // Immutable audit trail
    }

    // 6. System settings
    match /system_settings/{settingId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

---

## 7. Migration & Activation Instructions

When connecting Firebase:
1. Initialize Firebase using `firebase-applet-config.json`.
2. Connect your client Firestore SDK using the collections specified above.
3. Use the defined `id` and `name` attributes for UI binding, test automation, and form serialization.
