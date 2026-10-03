import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
  Printer,
  FileDown,
  Layers,
  Settings,
  Shield,
  Code2,
  Workflow,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ListOrdered,
  HelpCircle,
  Clock,
  UserCheck,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';
import { printElementById } from '../../utils/printUtils';

interface SystemManualViewProps {
  currentRole: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onNavigateTab: (tab: any) => void;
  onOpenNewQuestion: () => void;
  onCloseModal?: () => void;
  onReturnToLogin?: () => void;
  isModal?: boolean;
}

export const SystemManualView: React.FC<SystemManualViewProps> = ({
  currentRole,
  onChangeRole,
  onNavigateTab,
  onOpenNewQuestion,
  onCloseModal,
  onReturnToLogin,
  isModal = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('quickstart');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const sections = [
    { id: 'quickstart', label: 'Quick Start & Overview', icon: Sparkles },
    { id: 'author_guide', label: '1. Faculty Author Guide', icon: FileText },
    { id: 'reviewer_guide', label: '2. Reviewer & Validator Guide', icon: UserCheck },
    { id: 'examiner_guide', label: '3. Examiner & Exam Generator Guide', icon: Layers },
    { id: 'admin_guide', label: '4. Administrator & Curriculum Guide', icon: Settings },
    { id: 'lifecycle', label: 'Question Status Workflow', icon: Workflow },
    { id: 'question_types', label: '12 Question Formats Reference', icon: Code2 },
    { id: 'print_guide', label: 'Print Layout & PDF Export', icon: Printer },
    { id: 'faq', label: 'FAQ & Troubleshooting', icon: HelpCircle },
  ];

  const handleCopySampleJSON = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const sampleJSON = `[
  {
    "courseCode": "CPE 101",
    "topic": "Pointers and Memory Allocation",
    "subtopic": "Dynamic Allocation with malloc",
    "questionType": "multiple_choice",
    "questionText": "What header file must be included in C to utilize malloc() and free()?",
    "choices": [
      "<stdio.h>",
      "<stdlib.h>",
      "<string.h>",
      "<memory.h>"
    ],
    "correctAnswer": 1,
    "difficultyLevel": "Easy",
    "cognitiveLevel": "Remembering",
    "assessmentType": "Midterm Exam",
    "points": 1,
    "explanation": "<stdlib.h> declares dynamic memory management functions malloc(), calloc(), realloc(), and free()."
  }
]`;

  return (
    <div id="system-manual-container" className={`space-y-6 ${isModal ? 'p-2' : ''}`}>
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 text-white rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              BSCpE Question Data Bank — System Operations Manual
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete step-by-step documentation, role workflows, outcome-based guidelines, and examination generation manual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onReturnToLogin && (
            <button
              id="manual-return-login-btn"
              name="returnToLoginBtn"
              type="button"
              onClick={onReturnToLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-xs transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Login Screen</span>
            </button>
          )}

          <button
            id="print-manual-btn"
            name="printManualBtn"
            type="button"
            onClick={() => {
              printElementById('system-manual-container', {
                documentTitle: 'BSCpE_System_Operations_Manual',
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manual</span>
          </button>

          {isModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              Close Manual
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar Navigator + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4 no-print">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search guide & steps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Section Links */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-0.5 text-xs">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Manual Sections
            </div>
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{s.label}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>

          {/* Interactive Role Switcher Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Interactive Role Switcher</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Test each perspective directly. Current role: <strong className="text-slate-900 capitalize">{currentRole.replace('_', ' ')}</strong>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onChangeRole ? onChangeRole('faculty_author') : onReturnToLogin?.()}
                className={`px-2 py-1.5 text-[11px] font-medium rounded border transition-colors ${
                  currentRole === 'faculty_author'
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Faculty Author
              </button>
              <button
                type="button"
                onClick={() => onChangeRole ? onChangeRole('reviewer') : onReturnToLogin?.()}
                className={`px-2 py-1.5 text-[11px] font-medium rounded border transition-colors ${
                  currentRole === 'reviewer'
                    ? 'bg-amber-700 text-white border-amber-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Reviewer
              </button>
              <button
                type="button"
                onClick={() => onChangeRole ? onChangeRole('examiner') : onReturnToLogin?.()}
                className={`px-2 py-1.5 text-[11px] font-medium rounded border transition-colors ${
                  currentRole === 'examiner'
                    ? 'bg-indigo-700 text-white border-indigo-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Examiner
              </button>
              <button
                type="button"
                onClick={() => onChangeRole ? onChangeRole('admin') : onReturnToLogin?.()}
                className={`px-2 py-1.5 text-[11px] font-medium rounded border transition-colors ${
                  currentRole === 'admin'
                    ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Manual Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* SECTION: QUICK START & SYSTEM OVERVIEW */}
          {(activeSection === 'quickstart' || searchQuery) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Quick Start & System Architecture Overview
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                The <strong>BSCpE Examination Question Data Bank System</strong> is an academic repository and test generation platform engineered for Computer Engineering departments. It enforces Outcome-Based Education (OBE) principles, Bloom’s Taxonomy cognitive alignment, and peer-reviewed quality assurance across programming, embedded hardware, computer architecture, and networking courses.
              </p>

              {/* Step 0: Department Authentication & Role Login */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      ★
                    </span>
                    <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                      Step 0: Authentication & Role-Based Login
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300">
                    Security & RBAC
                  </span>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  The system starts on the <strong>BSCpE Institutional Login Page</strong>. Users can authenticate into their designated role either through <strong>Instant Role Persona Access</strong> (recommended for testing & faculty access) or standard <strong>Single Sign-On Credentials</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
                    <span className="font-bold text-emerald-800 block">Faculty Author</span>
                    <code className="text-[10px] text-slate-600 block mt-0.5 truncate">maria.santos@univ.edu.ph</code>
                    <span className="text-[10px] text-slate-400">PW: password123</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
                    <span className="font-bold text-amber-800 block">Reviewer / Validator</span>
                    <code className="text-[10px] text-slate-600 block mt-0.5 truncate">roberto.cruz@univ.edu.ph</code>
                    <span className="text-[10px] text-slate-400">PW: password123</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
                    <span className="font-bold text-indigo-800 block">Faculty Examiner</span>
                    <code className="text-[10px] text-slate-600 block mt-0.5 truncate">juvy.reyes@univ.edu.ph</code>
                    <span className="text-[10px] text-slate-400">PW: password123</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
                    <span className="font-bold text-purple-800 block">System Administrator</span>
                    <code className="text-[10px] text-slate-600 block mt-0.5 truncate">carlos.mendoza@univ.edu.ph</code>
                    <span className="text-[10px] text-slate-400">PW: password123</span>
                  </div>
                </div>
                <p className="text-[11px] text-indigo-800 italic">
                  Tip: Use the <strong>Sign Out</strong> button in the top navigation bar at any time to return to the Login Page and switch between departmental roles.
                </p>
              </div>

              {/* 4-Step Quick Flow Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Author</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Create Questions</h4>
                  <p className="text-[11px] text-slate-600">
                    Draft questions across 12 formats with code, diagrams, test cases, and rationales.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span className="text-[10px] text-amber-700 uppercase font-mono">Validate</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Peer QA Review</h4>
                  <p className="text-[11px] text-slate-600">
                    Reviewers evaluate clarity, correctness, Bloom domain, and syllabus fit to approve.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span className="text-[10px] text-indigo-700 uppercase font-mono">Generate</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Multi-Set Exam</h4>
                  <p className="text-[11px] text-slate-600">
                    Create Sets A, B, C, D with question & choice shuffling, plus Table of Specifications.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-mono text-[11px]">
                      4
                    </span>
                    <span className="text-[10px] text-emerald-700 uppercase font-mono">Print/PDF</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Single-Click Print</h4>
                  <p className="text-[11px] text-slate-600">
                    Print Exam Paper and separated Master Answer Key with page-break-before styling.
                  </p>
                </div>
              </div>

              {/* Roles Matrix Table */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  System Roles & Permissions Matrix
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-slate-200 border-collapse">
                    <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 border-r border-slate-200">User Role</th>
                        <th className="p-2.5 border-r border-slate-200">Primary Responsibilities</th>
                        <th className="p-2.5">Key Actions & Tool Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                          Faculty / Author
                        </td>
                        <td className="p-2.5 text-slate-700 border-r border-slate-200">
                          Question authoring, bulk uploads, tagging topics and Bloom levels, configuring code test cases.
                        </td>
                        <td className="p-2.5 text-slate-600">
                          New Question Editor, Bulk JSON/CSV Import, Question Bank search, Submit for QA.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-amber-900 border-r border-slate-200">
                          Reviewer / Validator
                        </td>
                        <td className="p-2.5 text-slate-700 border-r border-slate-200">
                          Curriculum validation, checking answer accuracy, Bloom domain calibration, quality recommendations.
                        </td>
                        <td className="p-2.5 text-slate-600">
                          Review Queue, 5-point QA checklist dialog, Approve, Return for Revision, Reject.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-indigo-900 border-r border-slate-200">
                          Faculty Examiner
                        </td>
                        <td className="p-2.5 text-slate-700 border-r border-slate-200">
                          Generating multi-set examinations from validated questions, Table of Specifications calculation, exam distribution.
                        </td>
                        <td className="p-2.5 text-slate-600">
                          Exam Generator, Automated / Manual blueprint, Custom Print Layout (Exam + Key), PDF Exporter.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-emerald-900 border-r border-slate-200">
                          Administrator
                        </td>
                        <td className="p-2.5 text-slate-700 border-r border-slate-200">
                          Managing BSCpE curriculum catalogs, courses, topics, security audit trails, system parameters.
                        </td>
                        <td className="p-2.5 text-slate-600">
                          Curriculum Course Manager, Audit Log Viewer, User accounts, Full authoring & review rights.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: 1. FACULTY AUTHOR GUIDE */}
          {(activeSection === 'author_guide' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-900" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Step-by-Step Guide: Faculty Question Author
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onOpenNewQuestion}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  <span>Launch Question Editor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                {/* Step 1 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">1</span>
                    <span>Opening the Question Editor or Bulk Importer</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click the black <strong>"New Question"</strong> button in the top navigation bar or the <strong>"Bulk Import"</strong> button in the Question Bank tab. You can create questions individually or upload JSON/CSV batches of hundreds of questions at once.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">2</span>
                    <span>Configuring Course & Curriculum Metadata</span>
                  </h4>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                    <li><strong>Target Course:</strong> Select the BSCpE course (e.g., CPE 101, CPE 201, CPE 211).</li>
                    <li><strong>Topic & Subtopic:</strong> Select the primary syllabus topic and optional subtopic module.</li>
                    <li><strong>Bloom’s Cognitive Level:</strong> Choose from Remembering, Understanding, Applying, Analyzing, Evaluating, or Creating.</li>
                    <li><strong>Difficulty Level:</strong> Tag as Easy, Medium, Hard, or Expert for calibrated test generation.</li>
                    <li><strong>Points & Assessment Type:</strong> Assign item weight (default: 1-10 pts) and assessment target (Midterm, Final, Quiz).</li>
                  </ul>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">3</span>
                    <span>Specifying Question Text & Formats</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Select your question format from the 12 supported types. For <strong>Multiple Choice</strong>, provide 4 choices and mark the correct radio option. For <strong>Matching Type</strong>, add items in List A and matching targets in List B. For <strong>Fill in the Blanks</strong>, provide the expected phrase and case sensitivity.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">4</span>
                    <span>Programming Code & Test Case Suites</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    For <strong>Coding Problems</strong>, enter the problem statement, constraints, time/memory limit, sample inputs/outputs, model reference solution, and configure a table of automated test cases with input strings, expected outputs, and weight percentages.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">5</span>
                    <span>Submitting for Validation vs Saving as Draft</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click <strong>"Save as Draft"</strong> to work on the question later, or <strong>"Submit for Validation"</strong> to send it to the departmental Review Queue for peer validation.
                  </p>
                </div>

                {/* Bulk Import JSON Format Sample */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Bulk Import JSON Schema Example:</span>
                    <button
                      type="button"
                      onClick={() => handleCopySampleJSON(sampleJSON, 1)}
                      className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium"
                    >
                      {copiedCodeIndex === 1 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCodeIndex === 1 ? 'Copied!' : 'Copy Template'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                    <code>{sampleJSON}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: 2. REVIEWER & VALIDATOR GUIDE */}
          {(activeSection === 'reviewer_guide' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-700" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Step-by-Step Guide: Reviewer & Quality Validator
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('review')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-700 text-white rounded text-xs font-medium hover:bg-amber-800 transition-colors"
                >
                  <span>Open Review Queue</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Validators guarantee the scientific correctness, clarity, and syllabus alignment of examination materials before they become eligible for test paper compilation.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-1">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Step 1: Inspect Question Prompt & Code</span>
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Open a question from the Review Queue. Test code snippets, examine diagrams, check matching pairs, and verify that test cases are complete.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-1">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Step 2: Complete the 5-Point QA Checklist</span>
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Check off Answer Correctness, Question Clarity, Difficulty Calibration, Syllabus Topic Alignment, and Bloom’s Cognitive Taxonomy Accuracy.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-1">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Step 3: Document Recommendations</span>
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Provide constructive comments or recommendations for improvements if the question requires refinement or clarification.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-1">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Step 4: Issue Formal Determination</span>
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Choose <strong>"Approve Question"</strong> (unlocks for exam generator), <strong>"Return for Revision"</strong> (returns to author with feedback), or <strong>"Reject"</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: 3. EXAMINER & EXAM GENERATOR GUIDE */}
          {(activeSection === 'examiner_guide' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-700" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Step-by-Step Guide: Exam Generator & Multi-Set Production
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('exams')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-700 text-white rounded text-xs font-medium hover:bg-indigo-800 transition-colors"
                >
                  <span>Open Exam Generator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <strong className="text-xs font-bold text-slate-900 block">
                      Phase 1: Configure Blueprint Parameters
                    </strong>
                    <p className="text-xs text-slate-600">
                      Select your target course (e.g. CPE 211: Computer Architecture), enter the Institutional Header details (University, College, Department), set the Academic Year, Semester, Assessment Type (Midterm/Final), and Time Limit (minutes).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <strong className="text-xs font-bold text-slate-900 block">
                      Phase 2: Question Selection & Randomization Settings
                    </strong>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                      <li><strong>Automated Smart Selection:</strong> Set target item count (e.g. 15 questions) and click "Generate Multi-Set Examination". The system selects approved questions matching course topics.</li>
                      <li><strong>Manual Question Selection:</strong> Alternatively, hand-pick questions from the validated question catalog on the right.</li>
                      <li><strong>Randomization Toggles:</strong> Enable "Randomize Question Sequence" and "Randomize Choices" to permute answers between sets while maintaining synchronized keys.</li>
                      <li><strong>Target Sets:</strong> Check Sets A, B, C, or D depending on proctoring needs.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <strong className="text-xs font-bold text-slate-900 block">
                      Phase 3: Table of Specifications (TOS) Alignment Matrix
                    </strong>
                    <p className="text-xs text-slate-600">
                      The system automatically computes the Outcome-Based Education Table of Specifications (TOS) matrix, balancing hours spent, weight percentages, and cognitive counts across all 6 Bloom levels (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating).
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: PRINT LAYOUT & PDF EXPORT */}
          {(activeSection === 'print_guide' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Printer className="w-5 h-5 text-indigo-700" />
                <h2 className="text-lg font-bold text-slate-900">
                  Custom Print Layout & PDF Export Guide
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  The system features print-optimized styling that satisfies institutional examination protocols, allowing faculty to print or export the examination paper and master answer key with a single click.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-indigo-200 bg-indigo-50/50 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Printer className="w-4 h-4 text-indigo-700" />
                      <span>Single-Click Print Both (Exam + Key)</span>
                    </span>
                    <p className="text-xs text-indigo-950/80">
                      Click the primary <strong>"Print Exam & Answer Key"</strong> button. The custom print layout renders the Examination Paper first, followed by an explicit <code>page-break-before</code> boundary that guarantees the official Master Answer Key begins on a fresh, clean sheet.
                    </p>
                  </div>

                  <div className="border border-emerald-200 bg-emerald-50/50 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <FileDown className="w-4 h-4 text-emerald-700" />
                      <span>High-Definition PDF Export</span>
                    </span>
                    <p className="text-xs text-emerald-950/80">
                      Click <strong>"Export PDF"</strong> to generate a formatted PDF. You can customize the package to include the Exam Paper, Master Answer Key, Table of Specifications (TOS), and choose the target set (A/B/C/D).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-100 rounded-xl space-y-1 text-xs text-slate-700">
                  <strong className="text-slate-900 font-semibold block">Print Optimization Best Practices:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Use standard <strong>A4 Portrait</strong> paper size in your browser’s print dialog.</li>
                    <li>Ensure <strong>"Background Graphics"</strong> is enabled in printer settings so code snippet backgrounds and borders render crisply.</li>
                    <li>The Answer Key contains proctor signature lines and rapid scoring grids for fast grading. Keep printed answer keys in secure faculty storage.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: 4. ADMINISTRATOR & CURRICULUM GUIDE */}
          {(activeSection === 'admin_guide' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Step-by-Step Guide: Administrator & Curriculum Manager
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('curriculum')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded text-xs font-medium hover:bg-emerald-800 transition-colors"
                >
                  <span>Curriculum Courses</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <strong className="text-xs font-bold text-slate-900 block">
                    1. Course Catalog & Syllabus Management
                  </strong>
                  <p className="text-xs text-slate-600">
                    Navigate to <strong>Curriculum Courses</strong>. Add new BSCpE courses, edit course titles and categories (Programming, CE Fundamentals, Computing Systems, Advanced Specialized), and configure modular topics and subtopics.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <strong className="text-xs font-bold text-slate-900 block">
                    2. Security & Compliance Audit Logs
                  </strong>
                  <p className="text-xs text-slate-600">
                    Navigate to <strong>Audit Logs</strong> to monitor real-time system activities. Every question creation, modification, approval, status change, user account creation, and examination generation is recorded with user identity, timestamp, role, and details.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <strong className="text-xs font-bold text-slate-900 block">
                    3. Role-Based User Account Provisioning & RBAC Governance
                  </strong>
                  <p className="text-xs text-slate-600">
                    Navigate to <strong>User Accounts</strong>. Administrators can add new institutional users based on specific roles (<strong>Faculty Author</strong>, <strong>Reviewer / Validator</strong>, <strong>Faculty Examiner</strong>, or <strong>System Administrator</strong>). Each role automatically configures isolation boundaries, suggested department and academic ranks, and pre-populates OBE-compliant capability permissions that administrators can customize.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: QUESTION LIFECYCLE */}
          {(activeSection === 'lifecycle' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Workflow className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-bold text-slate-900">
                  Question Status Lifecycle & Progression Workflow
                </h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                The Question Bank enforces a 6-stage lifecycle to prevent unverified questions from appearing in formal examinations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block">1. Draft</span>
                  <p className="text-[10px] text-slate-500">Work in progress by author</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 block">2. Submitted</span>
                  <p className="text-[10px] text-blue-700">Sent by author for validation</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">3. For Review</span>
                  <p className="text-[10px] text-amber-700">Assigned to peer reviewer</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block">4. Approved</span>
                  <p className="text-[10px] text-emerald-700">Validated; exam-ready</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                  <span className="font-bold text-indigo-900 block">5. Published</span>
                  <p className="text-[10px] text-indigo-700">Live in institutional bank</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-500 block">6. Archived</span>
                  <p className="text-[10px] text-slate-400">Retired or historical</p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: 12 QUESTION FORMATS */}
          {(activeSection === 'question_types' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Code2 className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-bold text-slate-900">
                  The 12 Supported Question Formats Reference
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">1. Multiple Choice</strong>
                  <p className="text-slate-600 text-[11px]">Question prompt, 4+ choices, correct choice index, choice randomization support.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">2. True or False</strong>
                  <p className="text-slate-600 text-[11px]">Direct statement requiring binary factual determination with pedagogical explanation.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">3. Matching Type</strong>
                  <p className="text-slate-600 text-[11px]">List A premises and List B responses with automatic shuffling of List B during exam generation.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">4. Fill in the Blanks</strong>
                  <p className="text-slate-600 text-[11px]">Prompt with missing term, accepted alternative keywords, and case sensitivity controls.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">5. Coding Problems</strong>
                  <p className="text-slate-600 text-[11px]">Specifications, input/output schemas, constraints, model solution, and weighted test case suites.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">6. Code Completion</strong>
                  <p className="text-slate-600 text-[11px]">Incomplete code snippet where students must fill in critical syntax or logic statements.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">7. Code Snippets / Output Prediction</strong>
                  <p className="text-slate-600 text-[11px]">Syntax-highlighted code block where examinees predict exact stdout or variable states.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">8. Debugging</strong>
                  <p className="text-slate-600 text-[11px]">Buggy code snippet requiring students to identify syntax, semantic, or memory errors and provide corrections.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">9. Problem Solving</strong>
                  <p className="text-slate-600 text-[11px]">Engineering calculations (e.g. subnetting, pipelining, clock cycles, digital logic synthesis).</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">10. Algorithm Tracing</strong>
                  <p className="text-slate-600 text-[11px]">Tracing recursive calls, pointer updates, or sorting iteration states across a dry-run execution.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">11. Pseudocode</strong>
                  <p className="text-slate-600 text-[11px]">Language-agnostic structured algorithmic analysis and pseudocode formulation.</p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 space-y-1">
                  <strong className="text-slate-900 font-bold block">12. Flowchart-based Questions</strong>
                  <p className="text-slate-600 text-[11px]">Interactive SVG flowchart rendering depicting hardware control pipelines or state machines.</p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: FAQ & TROUBLESHOOTING */}
          {(activeSection === 'faq' || searchQuery) && (
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <HelpCircle className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-bold text-slate-900">
                  Frequently Asked Questions (FAQ) & Troubleshooting
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="font-bold text-slate-900 block">
                    Q: Why are my questions not showing up in the Exam Generator?
                  </strong>
                  <p className="text-xs text-slate-600">
                    A: Only questions in <strong>Approved</strong> or <strong>Published</strong> status are eligible for exam generation. If a question is in Draft or Submitted status, switch to the <em>Reviewer</em> role to validate and approve it in the Review Queue.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="font-bold text-slate-900 block">
                    Q: How does the system ensure the Master Answer Key prints on a separate page?
                  </strong>
                  <p className="text-xs text-slate-600">
                    A: The custom print layout injects <code>page-break-before: always</code> and <code>break-before: page</code> on the Master Answer Key container. When you click "Print Exam & Answer Key", the browser print manager automatically starts the Answer Key on the next sheet.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="font-bold text-slate-900 block">
                    Q: Can I add new BSCpE courses without changing code?
                  </strong>
                  <p className="text-xs text-slate-600">
                    A: Yes! Switch to the <strong>Administrator</strong> role, navigate to <strong>Curriculum Courses</strong>, and click "Add New Course". You can define course codes, titles, descriptions, categories, and topics directly in the UI.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <strong className="font-bold text-slate-900 block">
                    Q: Where is data stored?
                  </strong>
                  <p className="text-xs text-slate-600">
                    A: All questions, courses, audit logs, and generated exams are automatically persisted in your browser's persistent LocalStorage cache with initial fallback seed data.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Quick Jump Buttons Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
            <span className="text-slate-500 font-medium">Ready to work with the system?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab('questions')}
                className="px-3 py-1.5 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
              >
                Go to Question Bank
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('exams')}
                className="px-3 py-1.5 bg-indigo-700 text-white rounded font-medium hover:bg-indigo-800 transition-colors"
              >
                Go to Exam Generator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
