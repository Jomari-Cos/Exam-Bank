import React from 'react';
import { Question, UserRole } from '../../types';
import { X, CheckCircle2, Clock, User, Calendar, BookOpen, Layers, Edit3, ArrowRight, Printer } from 'lucide-react';
import { CodeEditorViewer } from '../Common/CodeEditorViewer';
import { FlowchartViewer } from '../Common/FlowchartViewer';
import { TestCaseRunner } from '../Common/TestCaseRunner';
import { printElementById } from '../../utils/printUtils';

interface QuestionDetailModalProps {
  question: Question | null;
  currentRole: UserRole;
  onClose: () => void;
  onEdit: (question: Question) => void;
  onSubmitForReview?: (question: Question) => void;
  onApprove?: (question: Question) => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question,
  currentRole,
  onClose,
  onEdit,
  onSubmitForReview,
  onApprove,
}) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/75">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono font-bold text-slate-900">
                {question.id}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-800">
                {question.courseCode} ({question.courseTitle})
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{question.questionType.replace('_', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-700">{question.status}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              {question.topic} - {question.subtopic}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div id="printable-question-card" className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-800">
          {/* Print-only university header */}
          <div className="print-only pb-4 border-b-2 border-slate-900 text-center space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              BSCpE Question Data Bank · Official Assessment Item Specification
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {question.courseCode}: {question.courseTitle}
            </div>
            <div className="text-xs text-slate-700">
              Item Code: <strong className="font-mono">{question.id}</strong> · Status: <strong>{question.status}</strong> · Version: v{question.version}
            </div>
          </div>
          {/* Question Text Prompt */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Question Statement
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-base leading-relaxed whitespace-pre-line">
              {question.questionText}
            </div>
          </div>

          {/* Type-Specific Contents */}

          {/* 1. Multiple Choice Choices */}
          {question.questionType === 'multiple_choice' && question.choices && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Answer Choices
              </h3>
              <div className="grid gap-2">
                {question.choices.map((choice, idx) => {
                  const isCorrect = question.correctAnswer === idx;
                  const letter = String.fromCharCode(65 + idx);

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 font-medium'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {letter}
                      </span>
                      <div className="flex-1 text-sm pt-0.5">{choice}</div>
                      {isCorrect && (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. True or False */}
          {question.questionType === 'true_false' && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Correct Boolean Evaluation
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 ${
                    question.correctAnswer === true
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}
                >
                  True {question.correctAnswer === true && '✓'}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 ${
                    question.correctAnswer === false
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}
                >
                  False {question.correctAnswer === false && '✓'}
                </div>
              </div>
            </div>
          )}

          {/* 3. Matching Type */}
          {question.questionType === 'matching' && question.matchingPairs && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Matching Pairs (List A & List B)
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-1/3 font-semibold">List A (Premise)</th>
                      <th className="p-3 font-semibold">List B (Matching Characteristic)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {question.matchingPairs.map((pair, idx) => (
                      <tr key={pair.id || idx}>
                        <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                          {idx + 1}. {pair.itemA}
                        </td>
                        <td className="p-3 text-slate-700 font-normal">
                          → {pair.itemB}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Fill in the Blank */}
          {question.questionType === 'fill_in_blank' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Accepted Answers
              </h3>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Primary Expected Answer: </span>
                  <code className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {String(question.correctAnswer)}
                  </code>
                </div>
                {question.alternativeAnswers && question.alternativeAnswers.length > 0 && (
                  <div>
                    <span className="text-slate-500">Alternative Valid Answers: </span>
                    <span className="font-mono text-emerald-800">
                      {question.alternativeAnswers.join(', ')}
                    </span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500">
                  Case sensitivity: {question.isCaseSensitive ? 'Enforced (Exact case required)' : 'Ignored (Case-insensitive)'}
                </div>
              </div>
            </div>
          )}

          {/* 5. Code Snippet & Output Prediction */}
          {(question.questionType === 'code_snippet' || question.questionType === 'code_completion') && question.codeSnippet && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Code Snippet ({question.programmingLanguage || 'C++'})
              </h3>
              <CodeEditorViewer
                code={question.codeSnippet}
                language={question.programmingLanguage || 'c++'}
              />
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <span className="font-semibold text-emerald-950">Expected Output / Code: </span>
                <code className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {String(question.correctAnswer)}
                </code>
              </div>
            </div>
          )}

          {/* 6. Coding Problem & Test Cases */}
          {question.questionType === 'coding_problem' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-700 mb-1">Input Specification</div>
                  <div className="text-slate-600">{question.inputSpecification || 'Standard console input'}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-700 mb-1">Output Specification</div>
                  <div className="text-slate-600">{question.outputSpecification || 'Standard console output'}</div>
                </div>
              </div>

              {question.constraints && (
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Constraints: </span>
                  <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{question.constraints}</code>
                </div>
              )}

              {/* Sample I/O */}
              {(question.sampleInput || question.sampleOutput) && (
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                    <span className="text-[11px] font-sans font-bold text-slate-500 block mb-1">Sample Input</span>
                    <pre className="text-slate-900">{question.sampleInput}</pre>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                    <span className="text-[11px] font-sans font-bold text-slate-500 block mb-1">Sample Output</span>
                    <pre className="text-emerald-900 font-semibold">{question.sampleOutput}</pre>
                  </div>
                </div>
              )}

              {/* Expected Solution Code */}
              {question.expectedSolution && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Author Model Solution ({question.programmingLanguage})
                  </h4>
                  <CodeEditorViewer
                    code={question.expectedSolution}
                    language={question.programmingLanguage || 'c++'}
                    maxHeight="250px"
                  />
                </div>
              )}

              {/* Interactive Test Cases Suite */}
              {question.testCases && question.testCases.length > 0 && (
                <TestCaseRunner
                  testCases={question.testCases}
                  language={question.programmingLanguage}
                  solutionCode={question.expectedSolution}
                  points={question.points}
                />
              )}
            </div>
          )}

          {/* 7. Debugging */}
          {question.questionType === 'debugging' && (
            <div className="space-y-3">
              {question.buggyCode && (
                <div>
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                    Buggy Code with Issue
                  </h4>
                  <CodeEditorViewer
                    code={question.buggyCode}
                    language={question.programmingLanguage || 'c++'}
                    maxHeight="220px"
                  />
                </div>
              )}

              {question.expectedBehavior && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <span className="font-bold text-slate-700">Expected Behavior: </span>
                  <span className="text-slate-800">{question.expectedBehavior}</span>
                </div>
              )}

              {question.debugHints && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <span className="font-bold">Debugging Hint: </span>
                  <span>{question.debugHints}</span>
                </div>
              )}

              {question.correctAnswer && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <span className="font-bold text-emerald-950 block mb-1">Bug Resolution & Fix:</span>
                  <pre className="font-mono text-emerald-900 whitespace-pre-wrap">{String(question.correctAnswer)}</pre>
                </div>
              )}
            </div>
          )}

          {/* 8. Flowchart */}
          {question.questionType === 'flowchart' && question.flowchartNodes && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Flowchart Architecture Diagram
              </h3>
              <FlowchartViewer nodes={question.flowchartNodes} />
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <span className="font-bold text-emerald-950">Correct Analysis / Outcome: </span>
                <span className="text-emerald-900 font-medium">{String(question.correctAnswer)}</span>
              </div>
            </div>
          )}

          {/* 9. Algorithm Tracing & Pseudocode */}
          {(question.questionType === 'algorithm_tracing' || question.questionType === 'pseudocode') && (
            <div className="space-y-3">
              {question.codeSnippet && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Algorithm / Pseudocode
                  </h4>
                  <CodeEditorViewer
                    code={question.codeSnippet}
                    language={question.programmingLanguage || 'c++'}
                    maxHeight="250px"
                  />
                </div>
              )}
              {question.correctAnswer && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <span className="font-bold text-emerald-950">Final State / Trace Result: </span>
                  <code className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {String(question.correctAnswer)}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* 10. Problem Solving */}
          {question.questionType === 'problem_solving' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-emerald-950">Correct Final Solution: </span>
              <div className="font-mono text-emerald-900 font-bold text-sm">
                {String(question.correctAnswer)}
              </div>
            </div>
          )}

          {/* Rationale / Explanation Section */}
          <div className="space-y-1.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Explanation & Pedagogical Rationale
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {question.explanation}
            </p>
          </div>

          {/* Complete Academic Metadata Grid */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1.5">
              Course Specification & Alignment Metadata
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Difficulty</span>
                <span className="font-semibold text-slate-800">{question.difficultyLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Cognitive Level (Bloom's)</span>
                <span className="font-semibold text-slate-800">{question.cognitiveLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Points Weight</span>
                <span className="font-semibold font-mono text-slate-800 tabular-nums">{question.points} pts</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assessment Type</span>
                <span className="font-semibold text-slate-800">{question.assessmentType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Academic Term</span>
                <span className="text-slate-800">{question.academicYear} · {question.semester}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Author</span>
                <span className="text-slate-800 font-medium">{question.author}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Validator / Reviewer</span>
                <span className="text-slate-800 font-medium">{question.reviewer || 'Pending validation'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Version & Updated</span>
                <span className="text-slate-800 font-mono">v{question.version} · {question.dateModified}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 block text-[11px]">Course Learning Outcome (CLO)</span>
              <span className="text-slate-700 font-medium">{question.learningOutcome}</span>
            </div>
          </div>

          {/* Review Feedback if available */}
          {question.reviewFeedback && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1 text-amber-900">
              <span className="font-bold">Reviewer Feedback:</span>
              <p>{question.reviewFeedback}</p>
              {question.reviewRecommendations && (
                <p className="italic text-amber-800">Recommendation: {question.reviewRecommendations}</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <button
              id="question-detail-close-btn"
              name="closeQuestionDetailBtn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            <button
              id="question-print-card-btn"
              name="printQuestionCardBtn"
              type="button"
              onClick={() => {
                printElementById('printable-question-card', {
                  documentTitle: `BSCpE_Question_${question.id}`,
                });
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-xs transition-colors"
              title="Print Official Question Item Card with pedagogical outcomes"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Item Card</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {(currentRole === 'faculty_author' || currentRole === 'admin') && question.status === 'Draft' && onSubmitForReview && (
              <button
                type="button"
                onClick={() => onSubmitForReview(question)}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Submit for Validation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {(currentRole === 'reviewer' || currentRole === 'admin') && (question.status === 'Submitted' || question.status === 'For Review') && onApprove && (
              <button
                type="button"
                onClick={() => onApprove(question)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Question</span>
              </button>
            )}

            {(currentRole === 'faculty_author' || currentRole === 'admin') && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(question);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Question</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
