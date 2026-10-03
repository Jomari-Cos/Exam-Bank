import React from 'react';
import { UserRole, SystemUser } from '../types';
import {
  Plus,
  CheckCircle,
  FileText,
  BookOpen,
  LogOut,
  Users,
  Settings,
  Activity,
  Layers,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  ArrowRightLeft,
} from 'lucide-react';

export type ActiveTab =
  | 'author_dashboard'
  | 'questions'
  | 'review'
  | 'exams'
  | 'admin_overview'
  | 'curriculum'
  | 'users'
  | 'audit'
  | 'manual';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
  currentUser?: SystemUser | null;
  onLogout?: () => void;
  pendingReviewCount: number;
  onOpenNewQuestion: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  currentUser,
  onLogout,
  pendingReviewCount,
  onOpenNewQuestion,
}) => {
  const roleSpecs: Record<
    UserRole,
    {
      badge: string;
      title: string;
      colorClass: string;
      bgClass: string;
      borderClass: string;
    }
  > = {
    faculty_author: {
      badge: 'Author Portal',
      title: 'Faculty Author & Course Lead',
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
    },
    reviewer: {
      badge: 'Validator Portal',
      title: 'Curriculum Validator & Reviewer',
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
    },
    examiner: {
      badge: 'Examiner Portal',
      title: 'Faculty Examiner & TOS Lead',
      colorClass: 'text-indigo-700',
      bgClass: 'bg-indigo-50',
      borderClass: 'border-indigo-200',
    },
    admin: {
      badge: 'Admin Portal',
      title: 'System & Curriculum Administrator',
      colorClass: 'text-purple-700',
      bgClass: 'bg-purple-50',
      borderClass: 'border-purple-200',
    },
  };

  const currentSpec = roleSpecs[currentRole];

  // Default home tab for active role
  const getHomeTab = (role: UserRole): ActiveTab => {
    switch (role) {
      case 'faculty_author':
        return 'author_dashboard';
      case 'reviewer':
        return 'review';
      case 'examiner':
        return 'exams';
      case 'admin':
        return 'admin_overview';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 no-print shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Branding with Role Badge */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab(getHomeTab(currentRole));
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                CpE
              </span>
              <span className="hidden sm:inline">BSCpE Data Bank</span>
            </a>

            <div
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentSpec.bgClass} ${currentSpec.colorClass} ${currentSpec.borderClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{currentSpec.badge}</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links - DEDICATED ONLY TO THE ASSIGNED ROLE */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
            {/* FACULTY AUTHOR TABS */}
            {currentRole === 'faculty_author' && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectTab('author_dashboard')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'author_dashboard'
                      ? 'border-emerald-600 text-emerald-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('questions')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'questions'
                      ? 'border-emerald-600 text-emerald-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Question Bank</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('manual')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'manual'
                      ? 'border-emerald-600 text-emerald-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Author Guide</span>
                </button>
              </>
            )}

            {/* REVIEWER / VALIDATOR TABS */}
            {currentRole === 'reviewer' && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectTab('review')}
                  className={`relative transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'review'
                      ? 'border-amber-600 text-amber-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Review Queue</span>
                  {pendingReviewCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                      {pendingReviewCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('questions')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'questions'
                      ? 'border-amber-600 text-amber-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Approved Repository</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('manual')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'manual'
                      ? 'border-amber-600 text-amber-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Validator Guide</span>
                </button>
              </>
            )}

            {/* FACULTY EXAMINER TABS */}
            {currentRole === 'examiner' && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectTab('exams')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'exams'
                      ? 'border-indigo-600 text-indigo-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Exam Generator & TOS</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('questions')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'questions'
                      ? 'border-indigo-600 text-indigo-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Approved Pool</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('manual')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'manual'
                      ? 'border-indigo-600 text-indigo-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Examiner Guide</span>
                </button>
              </>
            )}

            {/* ADMINISTRATOR TABS */}
            {currentRole === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectTab('admin_overview')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'admin_overview'
                      ? 'border-purple-600 text-purple-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('curriculum')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'curriculum'
                      ? 'border-purple-600 text-purple-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Curriculum</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('questions')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'questions'
                      ? 'border-purple-600 text-purple-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Question Bank</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('users')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'users'
                      ? 'border-purple-600 text-purple-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>User Accounts</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('audit')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'audit'
                      ? 'border-purple-600 text-purple-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Audit Logs</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('manual')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'manual'
                      ? 'border-purple-600 text-purple-900 font-bold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>System Manual</span>
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Active User Card, Role Actions & Secure Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Primary Action Button (Specific to Active Role) */}
            {(currentRole === 'faculty_author' || currentRole === 'admin') && (
              <button
                type="button"
                onClick={onOpenNewQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Question</span>
                <span className="sm:hidden">New</span>
              </button>
            )}

            {currentRole === 'examiner' && (
              <button
                type="button"
                onClick={() => onSelectTab('exams')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Generate Exam</span>
                <span className="sm:hidden">Exam</span>
              </button>
            )}

            {currentRole === 'reviewer' && (
              <button
                type="button"
                onClick={() => onSelectTab('review')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Validate Queue</span>
                <span className="sm:hidden">Queue</span>
                {pendingReviewCount > 0 && <span>({pendingReviewCount})</span>}
              </button>
            )}

            {/* Authenticated User Session Badge & Secure Role Switch / Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <div
                  className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200 text-left"
                  title={`${currentUser.name} • ${currentUser.department}`}
                >
                  <div className="w-6 h-6 rounded bg-slate-800 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <div className="text-[11px] font-bold text-slate-800 truncate max-w-[130px]">
                      {currentUser.name.split(',')[0]}
                    </div>
                    <div className="text-[9px] text-slate-500 truncate max-w-[130px] font-medium">
                      {currentSpec.title}
                    </div>
                  </div>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-700 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors font-medium shadow-2xs"
                    title="Sign Out / Switch Institutional Role"
                    aria-label="Sign out or switch role"
                  >
                    <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                    <span className="hidden sm:inline text-[11px] font-semibold">Switch Account</span>
                    <LogOut className="w-3.5 h-3.5 text-rose-600 sm:hidden" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (Horizontal Scrollable for small screens) */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto py-2 border-t border-slate-100 text-xs font-semibold text-slate-600 no-scrollbar">
          {currentRole === 'faculty_author' && (
            <>
              <button
                type="button"
                onClick={() => onSelectTab('author_dashboard')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'author_dashboard' ? 'bg-emerald-100 text-emerald-900 font-bold' : ''
                }`}
              >
                My Workspace
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('questions')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'questions' ? 'bg-emerald-100 text-emerald-900 font-bold' : ''
                }`}
              >
                Question Bank
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('manual')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'manual' ? 'bg-emerald-100 text-emerald-900 font-bold' : ''
                }`}
              >
                Author Guide
              </button>
            </>
          )}

          {currentRole === 'reviewer' && (
            <>
              <button
                type="button"
                onClick={() => onSelectTab('review')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'review' ? 'bg-amber-100 text-amber-900 font-bold' : ''
                }`}
              >
                Review Queue ({pendingReviewCount})
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('questions')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'questions' ? 'bg-amber-100 text-amber-900 font-bold' : ''
                }`}
              >
                Approved Repository
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('manual')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'manual' ? 'bg-amber-100 text-amber-900 font-bold' : ''
                }`}
              >
                Validator Guide
              </button>
            </>
          )}

          {currentRole === 'examiner' && (
            <>
              <button
                type="button"
                onClick={() => onSelectTab('exams')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'exams' ? 'bg-indigo-100 text-indigo-900 font-bold' : ''
                }`}
              >
                Exam Generator
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('questions')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'questions' ? 'bg-indigo-100 text-indigo-900 font-bold' : ''
                }`}
              >
                Approved Pool
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('manual')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'manual' ? 'bg-indigo-100 text-indigo-900 font-bold' : ''
                }`}
              >
                Examiner Guide
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                type="button"
                onClick={() => onSelectTab('admin_overview')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'admin_overview' ? 'bg-purple-100 text-purple-900 font-bold' : ''
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('curriculum')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'curriculum' ? 'bg-purple-100 text-purple-900 font-bold' : ''
                }`}
              >
                Curriculum
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('questions')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'questions' ? 'bg-purple-100 text-purple-900 font-bold' : ''
                }`}
              >
                Question Bank
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('users')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'users' ? 'bg-purple-100 text-purple-900 font-bold' : ''
                }`}
              >
                User Accounts
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('audit')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'audit' ? 'bg-purple-100 text-purple-900 font-bold' : ''
                }`}
              >
                Audit Logs
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('manual')}
                className={`whitespace-nowrap px-2 py-1 rounded ${
                  activeTab === 'manual' ? 'bg-purple-100 text-purple-900 font-bold' : ''
                }`}
              >
                System Manual
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
