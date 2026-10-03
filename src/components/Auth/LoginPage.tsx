import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Layers,
  FileText,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  School,
  Check
} from 'lucide-react';
import { SystemUser, UserRole } from '../../types';

interface LoginPageProps {
  users: SystemUser[];
  onLogin: (user: SystemUser) => void;
  onOpenManual?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin, onOpenManual }) => {
  const [activeTab, setActiveTab] = useState<'personas' | 'credentials'>('personas');
  const [selectedRole, setSelectedRole] = useState<UserRole>('faculty_author');
  const [email, setEmail] = useState('maria.santos@univ.edu.ph');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role visual specs and description
  const roleConfig: Record<
    UserRole,
    {
      badge: string;
      color: string;
      accentBg: string;
      borderColor: string;
      ringColor: string;
      icon: React.ReactNode;
      label: string;
      summary: string;
      keyDuties: string[];
    }
  > = {
    faculty_author: {
      badge: 'Faculty Author',
      color: 'text-emerald-700',
      accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      borderColor: 'border-emerald-300',
      ringColor: 'ring-emerald-500',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      label: 'Question Author & Faculty',
      summary: 'Draft, test, and contribute institutional questions across 12 computer engineering formats.',
      keyDuties: [
        'Author 12 BSCpE question types with code and flowcharts',
        'Specify CLO learning outcomes and Bloom taxonomy',
        'Submit items to curriculum review queue',
        'Perform test case runs for code problems'
      ]
    },
    reviewer: {
      badge: 'Reviewer / Validator',
      color: 'text-amber-700',
      accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
      borderColor: 'border-amber-300',
      ringColor: 'ring-amber-500',
      icon: <CheckCircle2 className="w-5 h-5 text-amber-600" />,
      label: 'Curriculum Validator & Reviewer',
      summary: 'Evaluate questions for syllabus alignment, Bloom taxonomy rigor, and answer key accuracy.',
      keyDuties: [
        'Review items submitted in the peer validation queue',
        'Approve, reject, or request revisions with rubrics',
        'Verify test cases, logic diagrams, and explanations',
        'Audit course learning outcome (CLO) mappings'
      ]
    },
    examiner: {
      badge: 'Faculty Examiner',
      color: 'text-indigo-700',
      accentBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      borderColor: 'border-indigo-300',
      ringColor: 'ring-indigo-500',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      label: 'Exam Officer & Test Generator',
      summary: 'Generate multi-set scrambled examinations, Table of Specifications (TOS), and print layouts.',
      keyDuties: [
        'Automate multi-set test paper generation (Sets A-D)',
        'Compute real-time Table of Specifications (TOS) matrix',
        'Single-click custom print layout (paper + answer key)',
        'Generate OMR 100-item scannable bubble sheets'
      ]
    },
    admin: {
      badge: 'Administrator',
      color: 'text-purple-700',
      accentBg: 'bg-purple-50 text-purple-800 border-purple-200',
      borderColor: 'border-purple-300',
      ringColor: 'ring-purple-500',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      label: 'Department Head & System Admin',
      summary: 'Oversee academic courses, audit security logs, manage faculty roles, and accreditation compliance.',
      keyDuties: [
        'Manage BSCpE curriculum catalog and course syllabi',
        'Review institutional audit logs and user activities',
        'Maintain system settings and RBAC access roles',
        'Export departmental compliance & assessment statistics'
      ]
    }
  };

  const handleQuickRoleLogin = (targetUser: SystemUser) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setTimeout(() => {
      onLogin(targetUser);
      setIsSubmitting(false);
    }, 250);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const matched = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail
      );

      if (!matched) {
        setErrorMsg('No user account found matching this email address. Please select one of the registered role personas.');
        setIsSubmitting(false);
        return;
      }

      // Check password (allow 'password123' or empty or matching password)
      if (password && matched.password && password !== matched.password && password !== 'password123' && password !== 'admin123') {
        setErrorMsg('Invalid password. Default demo password for all accounts is "password123".');
        setIsSubmitting(false);
        return;
      }

      onLogin(matched);
      setIsSubmitting(false);
    }, 300);
  };

  const fillCredentialsForRole = (role: UserRole) => {
    const userForRole = users.find((u) => u.role === role);
    if (userForRole) {
      setEmail(userForRole.email);
      setPassword(userForRole.password || 'password123');
      setSelectedRole(role);
      setErrorMsg(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Subtle Gradient & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Institutional Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-mono font-bold text-sm shadow-md ring-2 ring-indigo-400/20">
              CpE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  BSCpE Question Bank & Exam Generator
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  OBE v2.4 Accredited
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Computer Engineering • College of Engineering & Technology
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {onOpenManual && (
              <button
                type="button"
                onClick={onOpenManual}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>System Operations Manual</span>
              </button>
            )}
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Institutional Portal Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Institutional Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sign In to BSCpE Examination System
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Please log in with your assigned departmental role or institutional credentials to access your designated workflow.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center mt-6">
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 inline-flex shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('personas');
                  setErrorMsg(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'personas'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Select Role Persona (Instant Login)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('credentials');
                  setErrorMsg(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'credentials'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Single Sign-On / Credentials</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="max-w-xl mx-auto mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <p className="flex-1">{errorMsg}</p>
          </div>
        )}

        {/* VIEW 1: ROLE PERSONA QUICK ACCESS */}
        {activeTab === 'personas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {users.map((user) => {
              const config = roleConfig[user.role];
              const isSelected = selectedRole === user.role;

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedRole(user.role)}
                  className={`group relative bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                    isSelected
                      ? `${config.borderColor} ring-2 ${config.ringColor} bg-slate-900`
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top user badge and avatar */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white font-mono shadow-sm group-hover:scale-105 transition-transform">
                        {user.avatar || user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.accentBg}`}>
                        {config.badge}
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                      {user.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {user.title || config.label}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      {user.email}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {config.summary}
                      </p>

                      <div className="space-y-1.5 mb-4">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Key Capabilities:
                        </span>
                        {config.keyDuties.slice(0, 3).map((duty, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{duty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Login Action Button */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickRoleLogin(user);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm mt-2 ${
                      isSelected
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    <span>Log In as {config.badge}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: STANDARD INSTITUTIONAL CREDENTIAL LOGIN */}
        {activeTab === 'credentials' && (
          <div className="max-w-xl mx-auto w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Quick Demo Pre-fill shortcuts */}
            <div className="mb-6 pb-6 border-b border-slate-800">
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                Click a role to auto-populate credentials:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {users.map((u) => {
                  const cfg = roleConfig[u.role];
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setEmail(u.email);
                        setPassword(u.password || 'password123');
                        setSelectedRole(u.role);
                        setErrorMsg(null);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        email.toLowerCase() === u.email.toLowerCase()
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-bold'
                          : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate">{cfg.badge}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{u.name.split(',')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="faculty@univ.edu.ph"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Account Password
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Default demo: <code className="text-indigo-400 font-mono">password123</code>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <span>Keep me signed in on this terminal</span>
                </label>
                <span className="text-xs text-indigo-400 hover:underline cursor-pointer">
                  Account Support
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authenticating Department Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Sign In to Portal</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500">
                Authorized for BSCpE Faculty, Reviewers, Examiners, and Administrators only. All authentication and question modifications are timestamped in the system audit trail.
              </p>
            </div>
          </div>
        )}

        {/* Role Permissions Matrix Summary */}
        <div className="mt-12 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Institutional Role-Based Access Control (RBAC) Quick Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Each role is isolated to ensure academic integrity in accordance with CHED OBE standards.
              </p>
            </div>
            {onOpenManual && (
              <button
                type="button"
                onClick={onOpenManual}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 self-start md:self-auto"
              >
                <span>Read Full Operational Manual</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Faculty Author</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Primary creator of assessment items. Can create and preview all 12 formats, run code test cases, and submit to the review queue.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>2. Reviewer / Validator</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Academic validator. Audits questions for Bloom cognitive level, syllabus match, answer correctness, and CLO rubric conformity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
              <div className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>3. Faculty Examiner</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Test administrator. Scrambles questions across multiple examination sets (A/B/C/D), generates TOS matrix, custom print layout, and OMR sheets.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
              <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>4. Department Administrator</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                System guardian. Manages the 13-course catalog, configures learning outcomes, inspects tamper-proof audit trails, and manages user accounts.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Department of Computer Engineering • Outcome-Based Education Question Data Bank
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Version 2.4.0-OBE</span>
            <span>•</span>
            <span>CHED CMO 88 s.2017 Compliant</span>
            <span>•</span>
            <span>ISO 9001:2015 Educational Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
