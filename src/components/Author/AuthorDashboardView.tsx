import React, { useMemo } from 'react';
import {
  Question,
  Course,
  SystemUser,
} from '../../types';
import {
  BookOpen,
  Plus,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Edit3,
  Eye,
  ArrowRight,
  Sparkles,
  Search,
  RotateCcw,
  Layers,
  Award,
} from 'lucide-react';

interface AuthorDashboardViewProps {
  currentUser: SystemUser;
  questions: Question[];
  courses: Course[];
  onOpenNewQuestion: () => void;
  onOpenBulkImport: () => void;
  onNavigateToQuestionBank: (courseCode?: string) => void;
  onNavigateToGuide: () => void;
  onSelectQuestion: (question: Question) => void;
  onEditQuestion: (question: Question) => void;
}

export const AuthorDashboardView: React.FC<AuthorDashboardViewProps> = ({
  currentUser,
  questions,
  courses,
  onOpenNewQuestion,
  onOpenBulkImport,
  onNavigateToQuestionBank,
  onNavigateToGuide,
  onSelectQuestion,
  onEditQuestion,
}) => {
  // Questions authored by the current user (or fallback to author name match)
  const myQuestions = useMemo(() => {
    return questions.filter(
      (q) =>
        q.author.toLowerCase().includes('maria') ||
        q.author.toLowerCase().includes('santos') ||
        q.author.toLowerCase().includes(currentUser.name.toLowerCase().split(',')[0])
    );
  }, [questions, currentUser]);

  // Questions needing revisions (returned by reviewer with feedback)
  const returnedQuestions = useMemo(() => {
    return myQuestions.filter(
      (q) =>
        (q.status === 'Draft' && q.reviewFeedback && q.reviewFeedback.trim() !== '') ||
        (q.reviewer && q.reviewFeedback && q.status !== 'Approved')
    );
  }, [myQuestions]);

  const draftQuestions = useMemo(
    () => myQuestions.filter((q) => q.status === 'Draft' && !returnedQuestions.includes(q)),
    [myQuestions, returnedQuestions]
  );

  const pendingReviewQuestions = useMemo(
    () => myQuestions.filter((q) => q.status === 'Submitted' || q.status === 'For Review'),
    [myQuestions]
  );

  const approvedQuestions = useMemo(
    () => myQuestions.filter((q) => q.status === 'Approved' || q.status === 'Published'),
    [myQuestions]
  );

  // Group my questions by course
  const courseStats = useMemo(() => {
    const stats: Record<string, number> = {};
    courses.forEach((c) => {
      stats[c.code] = 0;
    });
    myQuestions.forEach((q) => {
      if (stats[q.courseCode] !== undefined) {
        stats[q.courseCode]++;
      } else {
        stats[q.courseCode] = 1;
      }
    });
    return stats;
  }, [courses, myQuestions]);

  return (
    <div className="space-y-6">
      {/* Role Welcome & Identity Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FACULTY AUTHOR PORTAL</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, {currentUser.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentUser.title || 'Course Lead & Faculty Author'} · {currentUser.department}
              <br />
              Author and align examination questions to BSCpE syllabus outcomes, Bloom's cognitive taxonomy, and automated test cases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenNewQuestion}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Create Question</span>
            </button>

            <button
              type="button"
              onClick={onOpenBulkImport}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-300" />
              <span>Bulk Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Revisions Required Alert Box (High priority attention) */}
      {returnedQuestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-700" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-amber-900">
                  {returnedQuestions.length} Question{returnedQuestions.length > 1 ? 's' : ''} Require Your Revision
                </h2>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5">
                The peer validator has reviewed these items and requested specific modifications before curriculum approval.
              </p>

              <div className="mt-3 space-y-2.5">
                {returnedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white border border-amber-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-slate-800">{q.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-indigo-700">{q.courseCode}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-medium">{q.topic}</span>
                      </div>
                      <div className="text-xs text-slate-800 font-medium line-clamp-1">
                        "{q.questionText}"
                      </div>
                      {q.reviewFeedback && (
                        <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200/60 rounded px-2 py-1 font-mono">
                          <strong>Validator Note:</strong> {q.reviewFeedback}
                          {q.reviewRecommendations && (
                            <span className="block mt-0.5 text-slate-600 font-sans">
                              <strong>Recommendation:</strong> {q.reviewRecommendations}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onEditQuestion(q)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Resubmit</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">My Authored Questions</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {myQuestions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {courses.length} curriculum courses
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Under Review</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {pendingReviewQuestions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Waiting for peer validation
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Approved in Bank</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">
            {approvedQuestions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ready for exam compilation
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Drafts / Revisions</span>
            <Edit3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {draftQuestions.length + returnedQuestions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {returnedQuestions.length > 0 ? `${returnedQuestions.length} need revision` : 'Ready to submit'}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Author's Recent Submissions + Course Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Questions Authored */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                My Authored Questions & Submissions
              </h2>
              <p className="text-xs text-slate-500">
                Manage your active drafts, monitor validator feedback, and update questions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToQuestionBank()}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <span>View in Question Bank</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {myQuestions.slice(0, 6).map((q) => {
              const isReturned = q.reviewFeedback && q.status !== 'Approved';

              return (
                <div
                  key={q.id}
                  onClick={() => onSelectQuestion(q)}
                  className="p-3.5 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 rounded-xl cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-800">{q.id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-indigo-700">{q.courseCode}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{q.questionType.replace('_', ' ')}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{q.cognitiveLevel}</span>
                    </div>

                    <div className="text-xs font-medium text-slate-900 line-clamp-1">
                      {q.questionText}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Topic: {q.topic}</span>
                      <span>·</span>
                      <span>Points: {q.points}</span>
                      <span>·</span>
                      <span>Modified: {q.dateModified}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        q.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.status === 'Submitted' || q.status === 'For Review'
                          ? 'bg-sky-100 text-sky-800'
                          : isReturned
                          ? 'bg-amber-100 text-amber-800 font-semibold'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isReturned ? 'Revision Needed' : q.status}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditQuestion(q);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 shadow-2xs"
                      title="Edit Question"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {myQuestions.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No questions authored yet. Click "Create Question" above to start contributing to the BSCpE data bank.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Contributions & Guidelines Quick Access */}
        <div className="lg:col-span-4 space-y-4">
          {/* Course Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>My Course Coverage</span>
              <span className="text-xs text-slate-400 font-normal">BSCpE Catalog</span>
            </h2>

            <div className="space-y-2 text-xs">
              {courses.slice(0, 6).map((c) => {
                const count = courseStats[c.code] || 0;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => onNavigateToQuestionBank(c.code)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 font-mono">{c.code}</div>
                      <div className="text-[11px] text-slate-500 truncate">{c.title}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* OBE & Bloom's Guide Shortcut Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold">Authoring Guidelines</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensure every question adheres to the 12 BSCpE format rubrics, specifies intended Course Learning Outcomes (CLOs), and designates the appropriate Bloom's taxonomy tier.
            </p>
            <button
              type="button"
              onClick={onNavigateToGuide}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              <span>View Authoring Manual & Rubrics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
