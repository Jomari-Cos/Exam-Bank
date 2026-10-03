import React, { useMemo } from 'react';
import {
  Question,
  Course,
  SystemUser,
  AuditLog,
} from '../../types';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  Settings,
  FileText,
  ArrowRight,
  TrendingUp,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';

interface AdminOverviewViewProps {
  currentUser: SystemUser;
  questions: Question[];
  courses: Course[];
  users: SystemUser[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: 'curriculum' | 'questions' | 'users' | 'audit' | 'manual') => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  currentUser,
  questions,
  courses,
  users,
  auditLogs,
  onNavigateTab,
}) => {
  // Stats
  const approvedCount = questions.filter((q) => q.status === 'Approved' || q.status === 'Published').length;
  const pendingCount = questions.filter((q) => q.status === 'Submitted' || q.status === 'For Review').length;
  const draftCount = questions.filter((q) => q.status === 'Draft').length;

  // Cognitive breakdown
  const cognitiveCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Remembering: 0,
      Understanding: 0,
      Applying: 0,
      Analyzing: 0,
      Evaluating: 0,
      Creating: 0,
    };
    questions.forEach((q) => {
      if (counts[q.cognitiveLevel] !== undefined) {
        counts[q.cognitiveLevel]++;
      }
    });
    return counts;
  }, [questions]);

  // Questions per course
  const courseCounts = useMemo(() => {
    const map: Record<string, number> = {};
    questions.forEach((q) => {
      map[q.courseCode] = (map[q.courseCode] || 0) + 1;
    });
    return map;
  }, [questions]);

  return (
    <div className="space-y-6">
      {/* Admin Institutional Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>ADMINISTRATOR CONTROL CENTER</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Institutional Overview & Governance
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Signed in as <strong className="text-white">{currentUser.name}</strong> · {currentUser.title}
              <br />
              Department Chairperson & Chief Administrator · Full oversight of BSCpE curriculum catalog, user accounts, and security audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('curriculum')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Curriculum Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 transition-colors"
            >
              <Users className="w-4 h-4 text-slate-300" />
              <span>User Accounts</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Questions</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {questions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across 12 formats
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Approved Pool</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">
            {approvedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {((approvedCount / (questions.length || 1)) * 100).toFixed(0)}% exam-ready
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Review Queue</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Awaiting validation
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Courses Active</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {courses.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            4 curriculum categories
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('users')}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl p-4 shadow-xs text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium group-hover:text-indigo-600 transition-colors">Staff Accounts</span>
            <Users className="w-4 h-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {users.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Manage & Add by Role →
          </div>
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Audit Trail</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {auditLogs.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Security events logged
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigateTab('curriculum')}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 text-left transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>Curriculum Manager</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Manage course codes, syllabus topics, subtopics, and prerequisites across BSCpE curriculum.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('users')}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 text-left transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>User Accounts & RBAC</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure system roles, department designations, and verified institutional permissions.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('questions')}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 text-left transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>Question Bank Master</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full oversight of all items across drafts, reviews, approvals, and archived questions.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('audit')}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 text-left transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>Security Audit Logs</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect all logins, role authentications, question approvals, and system changes.
          </p>
        </button>
      </div>

      {/* Analytical Breakdown: Bloom's Taxonomy + Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bloom's Cognitive Distribution */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Bloom's Taxonomy Distribution</span>
              </h2>
              <p className="text-xs text-slate-500">
                Cognitive level proportion across entire BSCpE question bank.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600">
              {questions.length} Items Total
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(cognitiveCounts).map(([level, count]) => {
              const pct = questions.length > 0 ? (count / questions.length) * 100 : 0;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{level}</span>
                    <span className="font-mono text-slate-500">
                      {count} items ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Recent System Activities</span>
              </h2>
              <p className="text-xs text-slate-500">
                Real-time security audit events from all institutional roles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('audit')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
            >
              View All Logs
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <span className="font-semibold">{log.user.split(',')[0]}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 rounded font-mono uppercase">
                      {log.role}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    {log.timestamp}
                  </span>
                </div>
                <div className="text-slate-900 font-semibold">{log.action}</div>
                <div className="text-slate-600 text-[11px] truncate">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
