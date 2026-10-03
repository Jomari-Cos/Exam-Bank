import React, { useState } from 'react';
import { Question, ReviewLog, UserRole } from '../../types';
import {
  CheckCircle2,
  RotateCcw,
  XCircle,
  FileCheck,
  AlertCircle,
  Eye,
  Check,
  Clock,
  User,
  ShieldAlert,
} from 'lucide-react';
import { CodeEditorViewer } from '../Common/CodeEditorViewer';
import { FlowchartViewer } from '../Common/FlowchartViewer';
import { TestCaseRunner } from '../Common/TestCaseRunner';

interface ReviewQueueViewProps {
  questions: Question[];
  currentRole: UserRole;
  reviewerName: string;
  onApprove: (questionId: string, comments: string) => void;
  onReturnForRevision: (questionId: string, comments: string, recommendations: string) => void;
  onReject: (questionId: string, comments: string) => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  questions,
  currentRole,
  reviewerName,
  onApprove,
  onReturnForRevision,
  onReject,
}) => {
  // Pending questions for validation
  const pendingQuestions = questions.filter(
    (q) => q.status === 'Submitted' || q.status === 'For Review'
  );

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    pendingQuestions.length > 0 ? pendingQuestions[0].id : null
  );

  // Review checklist state
  const [rubricCorrectness, setRubricCorrectness] = useState(true);
  const [rubricClarity, setRubricClarity] = useState(true);
  const [rubricDifficulty, setRubricDifficulty] = useState(true);
  const [rubricAlignment, setRubricAlignment] = useState(true);
  const [rubricBlooms, setRubricBlooms] = useState(true);

  // Comments & recommendations
  const [comments, setComments] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const handleApproveAction = () => {
    if (!selectedQuestion) return;
    onApprove(
      selectedQuestion.id,
      comments || 'Technical accuracy and curriculum alignment verified. Approved for examination generation.'
    );
    setFeedbackSuccess(`Question ${selectedQuestion.id} successfully Approved!`);
    setTimeout(() => setFeedbackSuccess(null), 3500);
    setComments('');
    setRecommendations('');
  };

  const handleReturnAction = () => {
    if (!selectedQuestion) return;
    if (!comments.trim()) {
      alert('Please provide specific feedback comments on why the question is being returned.');
      return;
    }
    onReturnForRevision(selectedQuestion.id, comments, recommendations);
    setFeedbackSuccess(`Question ${selectedQuestion.id} returned to author for revision.`);
    setTimeout(() => setFeedbackSuccess(null), 3500);
    setComments('');
    setRecommendations('');
  };

  const handleRejectAction = () => {
    if (!selectedQuestion) return;
    if (!comments.trim()) {
      alert('Please provide a formal justification for rejecting this question.');
      return;
    }
    onReject(selectedQuestion.id, comments);
    setFeedbackSuccess(`Question ${selectedQuestion.id} rejected and archived.`);
    setTimeout(() => setFeedbackSuccess(null), 3500);
    setComments('');
    setRecommendations('');
  };

  return (
    <div className="space-y-6">
      {/* Title banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Examination Validation & Quality Assurance Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted questions, verify technical correctness, evaluate Bloom's taxonomy alignment, and approve for exam generation.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Active Reviewer:</span>
          <strong className="text-slate-800">{reviewerName}</strong>
        </div>
      </div>

      {feedbackSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* Main 2-Column Review Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Queue list (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pending Validation ({pendingQuestions.length})
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Queue
            </span>
          </div>

          {pendingQuestions.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-slate-700">Review Queue is Clear!</p>
              <p className="mt-1">All submitted examination questions have been validated.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {pendingQuestions.map((q) => {
                const isSelected = q.id === selectedQuestionId;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestionId(q.id);
                      setComments('');
                      setRecommendations('');
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/80 shadow-xs ring-1 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-900">{q.id}</span>
                      <span className="text-amber-700 font-semibold">{q.status}</span>
                    </div>

                    <div className="font-medium text-slate-800 line-clamp-2 mb-1.5">
                      {q.questionText}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{q.courseCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.difficultyLevel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.points} pt{q.points > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Question Inspection & Validation Form (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedQuestion ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-slate-500">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedQuestion.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-800">
                    {selectedQuestion.courseCode} ({selectedQuestion.courseTitle})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{selectedQuestion.questionType.replace('_', ' ')}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-mono">{selectedQuestion.points} pts</span>
                  <span aria-hidden="true">·</span>
                  <span>Author: {selectedQuestion.author}</span>
                </div>
              </div>

              {/* Question Statement */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Question Statement
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium leading-relaxed">
                  {selectedQuestion.questionText}
                </div>
              </div>

              {/* Specific Content Inspector (Code, choices, testcases, flowchart) */}
              {selectedQuestion.questionType === 'multiple_choice' && selectedQuestion.choices && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Choices & Answer Key
                  </h4>
                  <div className="grid gap-1.5">
                    {selectedQuestion.choices.map((choice, idx) => {
                      const isCorrect = selectedQuestion.correctAnswer === idx;
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 font-medium text-emerald-950'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-500">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{choice}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700">
                              ✓ Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedQuestion.questionType === 'true_false' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <span className="font-bold text-slate-700">Correct Evaluation: </span>
                  <span className="font-bold text-emerald-700">
                    {selectedQuestion.correctAnswer ? 'TRUE' : 'FALSE'}
                  </span>
                </div>
              )}

              {selectedQuestion.questionType === 'fill_in_blank' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div>
                    <span className="font-bold text-emerald-950">Expected Answer: </span>
                    <code className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {String(selectedQuestion.correctAnswer)}
                    </code>
                  </div>
                  {selectedQuestion.alternativeAnswers && (
                    <div className="text-[11px] text-emerald-800">
                      Alternatives: {selectedQuestion.alternativeAnswers.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {selectedQuestion.codeSnippet && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Code Snippet ({selectedQuestion.programmingLanguage || 'C++'})
                  </h4>
                  <CodeEditorViewer
                    code={selectedQuestion.codeSnippet}
                    language={selectedQuestion.programmingLanguage || 'c++'}
                    maxHeight="220px"
                  />
                  {selectedQuestion.correctAnswer && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                      <span className="font-bold text-emerald-950">Expected Output: </span>
                      <code className="font-mono font-bold text-emerald-900">
                        {String(selectedQuestion.correctAnswer)}
                      </code>
                    </div>
                  )}
                </div>
              )}

              {selectedQuestion.questionType === 'coding_problem' && selectedQuestion.testCases && (
                <div className="space-y-3">
                  <TestCaseRunner
                    testCases={selectedQuestion.testCases}
                    language={selectedQuestion.programmingLanguage}
                    solutionCode={selectedQuestion.expectedSolution}
                    points={selectedQuestion.points}
                  />
                </div>
              )}

              {selectedQuestion.questionType === 'flowchart' && selectedQuestion.flowchartNodes && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Flowchart Diagram
                  </h4>
                  <FlowchartViewer nodes={selectedQuestion.flowchartNodes} />
                </div>
              )}

              {/* Pedagogical Explanation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Author Explanation & Pedagogical Rationale
                </span>
                <p className="text-slate-800 leading-relaxed">{selectedQuestion.explanation}</p>
              </div>

              {/* Quality Assurance Rubrics Checklist */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Validator Quality Assurance Rubric
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rubricCorrectness}
                      onChange={(e) => setRubricCorrectness(e.target.checked)}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-slate-800 font-medium">
                      1. Technical correctness of question & solution
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rubricClarity}
                      onChange={(e) => setRubricClarity(e.target.checked)}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-slate-800 font-medium">
                      2. Clarity & lack of grammatical ambiguity
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rubricDifficulty}
                      onChange={(e) => setRubricDifficulty(e.target.checked)}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-slate-800 font-medium">
                      3. Appropriate difficulty calibration ({selectedQuestion.difficultyLevel})
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rubricAlignment}
                      onChange={(e) => setRubricAlignment(e.target.checked)}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-slate-800 font-medium">
                      4. Course Learning Outcome (CLO) alignment
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={rubricBlooms}
                      onChange={(e) => setRubricBlooms(e.target.checked)}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-slate-800 font-medium">
                      5. Bloom's Cognitive Taxonomy alignment ({selectedQuestion.cognitiveLevel})
                    </span>
                  </label>
                </div>
              </div>

              {/* Validator Comments & Feedback Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Validator Comments & Evaluation Notes
                  </label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter validation observations, technical verification details, or revision instructions..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Recommendations (Required if returning for revision)
                  </label>
                  <input
                    type="text"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="e.g. Specify compiler standard (C++17) or rephrase choice D to avoid double negatives"
                    className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRejectAction}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject & Archive</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReturnAction}
                    className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Return for Revision</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApproveAction}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Question</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
              Select a question from the pending list on the left to inspect and validate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
