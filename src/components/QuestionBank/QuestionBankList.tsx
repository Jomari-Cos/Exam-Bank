import React, { useState, useMemo } from 'react';
import {
  Question,
  QuestionType,
  QuestionStatus,
  DifficultyLevel,
  CognitiveLevel,
  AssessmentType,
  Course,
  UserRole,
} from '../../types';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle,
  FileCode,
  Download,
  Upload,
  Eye,
  Edit3,
  Copy,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react';

interface QuestionBankListProps {
  questions: Question[];
  courses: Course[];
  currentRole: UserRole;
  onSelectQuestion: (question: Question) => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onDuplicateQuestion: (question: Question) => void;
  onBulkApprove?: (questionIds: string[]) => void;
  onBulkDelete?: (questionIds: string[]) => void;
  onOpenNewModal: () => void;
  onOpenBulkImport: () => void;
}

export const QuestionBankList: React.FC<QuestionBankListProps> = ({
  questions,
  courses,
  currentRole,
  onSelectQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onBulkApprove,
  onBulkDelete,
  onOpenNewModal,
  onOpenBulkImport,
}) => {
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedCognitive, setSelectedCognitive] = useState('ALL');
  const [selectedAssessment, setSelectedAssessment] = useState('ALL');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Calculate real-time counts by cognitive level for quick filter pills
  const cognitiveCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: questions.length,
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

  // Reset all search and filter parameters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCourse('ALL');
    setSelectedCognitive('ALL');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setSelectedDifficulty('ALL');
    setSelectedAssessment('ALL');
  };

  const isAnyFilterActive =
    searchTerm.trim() !== '' ||
    selectedCourse !== 'ALL' ||
    selectedCognitive !== 'ALL' ||
    selectedType !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedDifficulty !== 'ALL' ||
    selectedAssessment !== 'ALL';

  // Format question type display name
  const formatTypeName = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return 'Multiple Choice';
      case 'true_false':
        return 'True or False';
      case 'matching':
        return 'Matching Type';
      case 'fill_in_blank':
        return 'Fill in the Blanks';
      case 'coding_problem':
        return 'Coding Problem';
      case 'code_completion':
        return 'Code Completion';
      case 'code_snippet':
        return 'Code Snippet';
      case 'debugging':
        return 'Debugging';
      case 'problem_solving':
        return 'Problem Solving';
      case 'algorithm_tracing':
        return 'Algorithm Tracing';
      case 'pseudocode':
        return 'Pseudocode';
      case 'flowchart':
        return 'Flowchart';
      default:
        return type;
    }
  };

  // Filtered Questions (Real-time global search by text keywords, course code, and cognitive level)
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Explicit Course dropdown/chip match
      if (selectedCourse !== 'ALL' && q.courseCode !== selectedCourse) return false;
      // 2. Explicit Type dropdown match
      if (selectedType !== 'ALL' && q.questionType !== selectedType) return false;
      // 3. Explicit Status dropdown match
      if (selectedStatus !== 'ALL' && q.status !== selectedStatus) return false;
      // 4. Explicit Difficulty dropdown match
      if (selectedDifficulty !== 'ALL' && q.difficultyLevel !== selectedDifficulty) return false;
      // 5. Explicit Cognitive Level dropdown/pill match
      if (selectedCognitive !== 'ALL' && q.cognitiveLevel !== selectedCognitive) return false;
      // 6. Explicit Assessment dropdown match
      if (selectedAssessment !== 'ALL' && q.assessmentType !== selectedAssessment) return false;

      // 7. Global Search Bar: Real-time multi-token filter across keywords, course code, and cognitive level
      if (searchTerm.trim() !== '') {
        const rawQuery = searchTerm.trim().toLowerCase();
        const tokens = rawQuery.split(/\s+/).filter(Boolean);

        const matchesToken = (token: string) => {
          // Course code & title match (e.g., 'CPE 101', 'CPE 211', '211', 'Architecture')
          if (q.courseCode.toLowerCase().includes(token)) return true;
          if (q.courseTitle?.toLowerCase().includes(token)) return true;

          // Cognitive level match (e.g., 'Remembering', 'Understanding', 'Applying', 'Analyzing', 'Evaluating', 'Creating')
          if (q.cognitiveLevel.toLowerCase().includes(token)) return true;

          // Text keywords match:
          if (q.questionText.toLowerCase().includes(token)) return true;
          if (q.topic.toLowerCase().includes(token)) return true;
          if (q.subtopic?.toLowerCase().includes(token)) return true;
          if (q.explanation?.toLowerCase().includes(token)) return true;
          if (q.id.toLowerCase().includes(token)) return true;
          if (q.author.toLowerCase().includes(token)) return true;
          if (q.difficultyLevel.toLowerCase().includes(token)) return true;
          if (q.questionType.toLowerCase().includes(token)) return true;
          if (q.codeSnippet?.toLowerCase().includes(token)) return true;
          if (q.programmingLanguage?.toLowerCase().includes(token)) return true;
          if (q.choices?.some((choice) => choice.toLowerCase().includes(token))) return true;
          if (q.matchingPairs?.some((p) => p.itemA.toLowerCase().includes(token) || p.itemB.toLowerCase().includes(token))) return true;
          if (typeof q.correctAnswer === 'string' && q.correctAnswer.toLowerCase().includes(token)) return true;

          return false;
        };

        const allTokensMatch = tokens.every(matchesToken);
        if (!allTokensMatch) return false;
      }

      return true;
    });
  }, [
    questions,
    searchTerm,
    selectedCourse,
    selectedType,
    selectedStatus,
    selectedDifficulty,
    selectedCognitive,
    selectedAssessment,
  ]);

  // Handle multi-select toggles
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  };

  // Export selected or all to JSON
  const handleExportJSON = () => {
    const dataToExport = selectedIds.length > 0
      ? questions.filter((q) => selectedIds.includes(q.id))
      : filteredQuestions;
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bscpe_questions_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Status text styling helper (natural text, zero-pill)
  const renderStatus = (status: QuestionStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="text-emerald-700 font-medium">Approved</span>;
      case 'For Review':
        return <span className="text-amber-700 font-medium">For Review</span>;
      case 'Submitted':
        return <span className="text-sky-700 font-medium">Submitted</span>;
      case 'Draft':
        return <span className="text-slate-500 font-medium">Draft</span>;
      case 'Published':
        return <span className="text-indigo-700 font-medium">Published</span>;
      case 'Archived':
        return <span className="text-rose-700 font-medium">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {currentRole === 'reviewer'
                ? 'Approved Question Repository'
                : currentRole === 'examiner'
                ? 'Approved Exam Question Pool'
                : currentRole === 'faculty_author'
                ? 'Faculty Question Bank'
                : 'BSCpE Master Question Data Bank'}
            </h1>
            {(currentRole === 'reviewer' || currentRole === 'examiner') && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Inspection Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'reviewer'
              ? 'Verify curriculum coverage, Bloom taxonomy distribution, and syllabus alignment across validated questions.'
              : currentRole === 'examiner'
              ? 'Browse verified items available for Table of Specifications (TOS) and test booklet generation.'
              : currentRole === 'faculty_author'
              ? 'Search, create, and refine examination questions aligned with course learning outcomes.'
              : 'Administrative central repository of questions across the Computer Engineering curriculum.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(currentRole === 'faculty_author' || currentRole === 'admin') && (
            <button
              type="button"
              onClick={onOpenBulkImport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk Import</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON ({selectedIds.length > 0 ? selectedIds.length : 'All'})</span>
          </button>

          {(currentRole === 'faculty_author' || currentRole === 'admin') && (
            <button
              type="button"
              onClick={onOpenNewModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Question</span>
            </button>
          )}
        </div>
      </div>

      {/* GLOBAL REAL-TIME SEARCH & FILTER BAR CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Main Global Search Input & Direct Course/Cognitive Selectors */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Global Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Global Search: Type text keywords, course code (e.g. 'CPE 211'), or cognitive level (e.g. 'Applying', 'Analyzing')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-2xs"
            />
            {/* Right inside clear button & live badge */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 hidden sm:inline">
                  Live
                </span>
              )}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                  title="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Direct Course Code Selector */}
          <div className="flex items-center gap-2">
            <div className="w-full sm:w-44">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={`w-full text-xs rounded-xl py-2.5 px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer font-medium ${
                  selectedCourse !== 'ALL'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                title="Filter by BSCpE Course Code"
              >
                <option value="ALL">All Courses</option>
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} · {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Cognitive Level Selector */}
            <div className="w-full sm:w-44">
              <select
                value={selectedCognitive}
                onChange={(e) => setSelectedCognitive(e.target.value)}
                className={`w-full text-xs rounded-xl py-2.5 px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer font-medium ${
                  selectedCognitive !== 'ALL'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                title="Filter by Bloom's Taxonomy Cognitive Level"
              >
                <option value="ALL">All Cognitive Levels</option>
                <option value="Remembering">Remembering</option>
                <option value="Understanding">Understanding</option>
                <option value="Applying">Applying</option>
                <option value="Analyzing">Analyzing</option>
                <option value="Evaluating">Evaluating</option>
                <option value="Creating">Creating</option>
              </select>
            </div>
          </div>
        </div>

        {/* 1-Click Cognitive Level Filter Pills (Bloom's Taxonomy) */}
        <div className="flex items-center flex-wrap gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cognitive Level:</span>
          </span>
          {(['ALL', 'Remembering', 'Understanding', 'Applying', 'Analyzing', 'Evaluating', 'Creating'] as const).map((level) => {
            const count = cognitiveCounts[level] || 0;
            const isSelected = selectedCognitive === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedCognitive(level)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-700 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{level === 'ALL' ? 'All Cognitive Levels' : level}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-indigo-900 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 1-Click Course Code Filter Chips */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Course Code:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedCourse('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedCourse === 'ALL'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Courses
          </button>
          {courses.map((c) => {
            const isSelected = selectedCourse === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCourse(isSelected ? 'ALL' : c.code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.code}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters (Question Format, Workflow Status, Difficulty, Assessment) */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Question Type filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Question Format
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All 12 Formats</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True or False</option>
              <option value="matching">Matching Type</option>
              <option value="fill_in_blank">Fill in Blanks</option>
              <option value="coding_problem">Coding Problem</option>
              <option value="code_completion">Code Completion</option>
              <option value="code_snippet">Code Snippet</option>
              <option value="debugging">Debugging</option>
              <option value="problem_solving">Problem Solving</option>
              <option value="algorithm_tracing">Algorithm Tracing</option>
              <option value="pseudocode">Pseudocode</option>
              <option value="flowchart">Flowchart</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Workflow Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="Approved">Approved (Ready for Exam)</option>
              <option value="For Review">For Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Difficulty filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Assessment Type filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Assessment Type
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All Assessments</option>
              <option value="Quiz">Quiz</option>
              <option value="Prelim Exam">Prelim Exam</option>
              <option value="Midterm Exam">Midterm Exam</option>
              <option value="Final Exam">Final Exam</option>
              <option value="Practical Laboratory">Practical Laboratory</option>
            </select>
          </div>
        </div>

        {/* Real-Time Live Results Counter & Active Filter Tags Bar */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center flex-wrap gap-2 text-slate-600">
            <span>
              Showing <strong className="text-slate-900 font-bold">{filteredQuestions.length}</strong> of{' '}
              <strong className="text-slate-900">{questions.length}</strong> questions
            </span>

            {isAnyFilterActive && (
              <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-medium">
                Real-Time Filter Active
              </span>
            )}

            {/* Active search term chip */}
            {searchTerm.trim() !== '' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                <span>Keyword: "{searchTerm}"</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="hover:text-slate-900"
                  title="Remove keyword filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active course chip */}
            {selectedCourse !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-mono">
                <span>Course: {selectedCourse}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCourse('ALL')}
                  className="hover:text-indigo-950"
                  title="Clear course filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active cognitive level chip */}
            {selectedCognitive !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                <span>Bloom: {selectedCognitive}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCognitive('ALL')}
                  className="hover:text-indigo-950"
                  title="Clear cognitive filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active format chip */}
            {selectedType !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                <span>Format: {formatTypeName(selectedType as QuestionType)}</span>
                <button
                  type="button"
                  onClick={() => setSelectedType('ALL')}
                  className="hover:text-slate-900"
                  title="Clear format filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 transition-colors shrink-0"
              title="Reset all active search and filter criteria"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Batch Actions Bar (if any selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-700">
            <span className="font-medium">
              {selectedIds.length} question(s) selected
            </span>
            <div className="flex items-center gap-2">
              {onBulkApprove && (currentRole === 'reviewer' || currentRole === 'admin') && (
                <button
                  type="button"
                  onClick={() => onBulkApprove(selectedIds)}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded font-medium hover:bg-emerald-100 transition-colors"
                >
                  Approve Selected
                </button>
              )}
              {onBulkDelete && (currentRole === 'admin' || currentRole === 'faculty_author') && (
                <button
                  type="button"
                  onClick={() => onBulkDelete(selectedIds)}
                  className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-300 rounded font-medium hover:bg-rose-100 transition-colors"
                >
                  Delete Selected
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 text-slate-500 hover:text-slate-800"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Questions Data List */}
      <div className="space-y-3">
        {/* Table summary row */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="select-all"
              checked={
                filteredQuestions.length > 0 &&
                selectedIds.length === filteredQuestions.length
              }
              onChange={handleSelectAll}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
            <label htmlFor="select-all" className="cursor-pointer select-none">
              Select All
            </label>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono">
              Showing {filteredQuestions.length} of {questions.length} questions
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>Click any question to view full details, code, or test cases</span>
          </div>
        </div>

        {/* Empty state */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
            <BookOpen className="w-9 h-9 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">
              No questions found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No examination questions matched your active filters or search terms. Try clearing filters or create a new question.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCourse('ALL');
                setSelectedType('ALL');
                setSelectedStatus('ALL');
                setSelectedDifficulty('ALL');
                setSelectedCognitive('ALL');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Questions Cards */}
        {filteredQuestions.map((q) => {
          const isSelected = selectedIds.includes(q.id);

          return (
            <div
              key={q.id}
              className={`bg-white border transition-colors rounded-xl p-4 cursor-pointer hover:border-slate-400 shadow-xs ${
                isSelected
                  ? 'border-slate-900 ring-1 ring-slate-900/10 bg-slate-50/40'
                  : 'border-slate-200'
              }`}
              onClick={() => onSelectQuestion(q)}
            >
              {/* Card Header: Zero-pill metadata line with typographic separators */}
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(q.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer mr-1"
                  />
                  <span className="font-mono font-semibold text-slate-900">
                    {q.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-800">
                    {q.courseCode} ({q.courseTitle})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatTypeName(q.questionType)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{q.difficultyLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{q.cognitiveLevel}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-medium text-slate-700 tabular-nums">
                    {q.points} pt{q.points > 1 ? 's' : ''}
                  </span>
                  <span aria-hidden="true">·</span>
                  {renderStatus(q.status)}
                </div>
              </div>

              {/* Question Text Body */}
              <div className="text-slate-900 text-sm font-medium leading-snug line-clamp-2 mb-2">
                {q.questionText}
              </div>

              {/* Code snippet peek if available */}
              {q.codeSnippet && (
                <div className="my-2 p-2 bg-slate-950 text-emerald-300 rounded font-mono text-[11px] line-clamp-2 max-h-16 overflow-hidden">
                  <code>{q.codeSnippet.slice(0, 150)}...</code>
                </div>
              )}

              {/* Card Footer: Topic details, learning outcome, and actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Topic: <strong className="text-slate-700 font-medium">{q.topic}</strong></span>
                  <span aria-hidden="true">/</span>
                  <span>Subtopic: {q.subtopic}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate max-w-xs text-slate-400" title={q.learningOutcome}>
                    {q.learningOutcome}
                  </span>
                </div>

                {/* Quick card action buttons */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onSelectQuestion(q)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    title="View Full Question Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {(currentRole === 'faculty_author' || currentRole === 'admin') && (
                    <button
                      type="button"
                      onClick={() => onDuplicateQuestion(q)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      title="Duplicate Question"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {(currentRole === 'faculty_author' || currentRole === 'admin') && (
                    <button
                      type="button"
                      onClick={() => onEditQuestion(q)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Question"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {(currentRole === 'admin' || currentRole === 'faculty_author') && (
                    <button
                      type="button"
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
