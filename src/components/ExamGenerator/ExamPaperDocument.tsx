import React from 'react';
import { Examination, ExamSet } from '../../types';
import { FlowchartViewer } from '../Common/FlowchartViewer';

interface ExamPaperDocumentProps {
  exam: Examination;
  set: ExamSet;
  activeSetCode: 'A' | 'B' | 'C' | 'D';
  institutionName: string;
  collegeName: string;
  departmentName: string;
  id?: string;
  className?: string;
}

export const ExamPaperDocument: React.FC<ExamPaperDocumentProps> = ({
  exam,
  set,
  activeSetCode,
  institutionName,
  collegeName,
  departmentName,
  id = 'exam-paper-container',
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`bg-white border border-slate-300 shadow-md max-w-4xl mx-auto p-8 sm:p-12 text-slate-900 print:shadow-none print:border-none print:p-0 ${className}`}
    >
      {/* University & Department Header */}
      <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
        <div className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
          {institutionName}
        </div>
        <div className="text-xs font-bold tracking-wide uppercase">
          {collegeName}
        </div>
        <div className="text-sm font-bold tracking-tight uppercase">
          {departmentName}
        </div>
        <div className="text-base font-extrabold uppercase pt-2">
          {exam.courseCode}: {exam.courseTitle}
        </div>
        <div className="text-xs font-medium text-slate-700">
          {exam.assessmentType} · {exam.semester}, Academic Year {exam.academicYear}
        </div>
      </div>

      {/* Student Information Banner */}
      <div className="grid grid-cols-12 gap-2 my-4 p-3 border border-slate-400 text-xs">
        <div className="col-span-7">
          <span className="font-bold">Student Name:</span> _________________________________________________
        </div>
        <div className="col-span-5 text-right font-mono font-bold text-sm text-slate-900">
          EXAM SET {activeSetCode}
        </div>
        <div className="col-span-4">
          <span className="font-bold">Student ID No.:</span> _____________________
        </div>
        <div className="col-span-4">
          <span className="font-bold">Section:</span> ________________
        </div>
        <div className="col-span-4 text-right">
          <span className="font-bold">Date:</span> {exam.examDate}
        </div>
        <div className="col-span-8">
          <span className="font-bold">Time Limit:</span> {exam.timeDurationMinutes} minutes
        </div>
        <div className="col-span-4 text-right">
          <span className="font-bold">Score:</span> _______ / {exam.totalPoints} pts
        </div>
      </div>

      {/* General Instructions */}
      <div className="p-3 bg-slate-50 border border-slate-300 text-xs text-slate-800 leading-relaxed mb-6">
        <strong className="text-slate-900">GENERAL INSTRUCTIONS: </strong>
        {exam.instructions}
      </div>

      {/* Questions Sequence */}
      <div className="space-y-6">
        {set.questions.map((q, idx) => {
          return (
            <div key={q.id || idx} className="avoid-break space-y-2 pb-4 border-b border-slate-200">
              {/* Question Header & Points */}
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="font-semibold text-slate-900 flex-1 leading-snug">
                  <span className="font-bold mr-1.5">{idx + 1}.</span>
                  {q.questionText}
                </div>
                <span className="font-mono text-xs text-slate-600 shrink-0 font-medium">
                  ({q.points} pt{q.points > 1 ? 's' : ''})
                </span>
              </div>

              {/* Multiple Choice Choices */}
              {q.questionType === 'multiple_choice' && (q.randomizedChoices || q.choices) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5 pt-1 text-xs">
                  {(q.randomizedChoices || q.choices || []).map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      <span className="font-bold font-mono text-slate-900">
                        {String.fromCharCode(65 + cIdx)}.
                      </span>
                      <span className="text-slate-800">{choice}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* True or False */}
              {q.questionType === 'true_false' && (
                <div className="pl-5 pt-1 text-xs flex items-center gap-8 text-slate-800 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-4 h-4 border border-slate-500 rounded-xs"></span>
                    <span>TRUE</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-4 h-4 border border-slate-500 rounded-xs"></span>
                    <span>FALSE</span>
                  </span>
                </div>
              )}

              {/* Matching Type */}
              {q.questionType === 'matching' && q.matchingPairs && (
                <div className="pl-5 pt-2 text-xs">
                  <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 bg-slate-50">
                    <div>
                      <span className="font-bold block mb-1 text-slate-900 border-b border-slate-200 pb-1">
                        Column A (Premises / Items)
                      </span>
                      {q.matchingPairs.map((p, mIdx) => (
                        <div key={p.id} className="py-1">
                          <span className="font-bold mr-1">{mIdx + 1}.</span> {p.itemA}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="font-bold block mb-1 text-slate-900 border-b border-slate-200 pb-1">
                        Column B (Responses)
                      </span>
                      {(q.randomizedListB || q.matchingPairs.map((p) => ({ id: p.id, text: p.itemB }))).map(
                        (p, bIdx) => (
                          <div key={p.id || bIdx} className="py-1">
                            <span className="font-bold mr-1">{String.fromCharCode(65 + bIdx)}.</span> {p.text}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 italic">
                    Write the letter of the correct matching response before each number.
                  </div>
                </div>
              )}

              {/* Fill in Blank blank line */}
              {q.questionType === 'fill_in_blank' && (
                <div className="pl-5 pt-1 text-xs font-mono text-slate-700">
                  Answer: __________________________________________________
                </div>
              )}

              {/* Code Snippet / Output Prediction */}
              {q.codeSnippet && (
                <div className="pl-5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-600 mb-1">
                    Given Code ({q.programmingLanguage || 'C/C++'}):
                  </div>
                  <pre className="p-3 bg-slate-100 border border-slate-300 font-mono text-xs text-slate-900 rounded whitespace-pre overflow-x-auto leading-relaxed">
                    <code>{q.codeSnippet}</code>
                  </pre>
                  {(q.questionType === 'code_snippet' || q.questionType === 'debugging') && (
                    <div className="mt-2 text-xs font-mono text-slate-600">
                      Output / Corrected Line: __________________________________________________
                    </div>
                  )}
                </div>
              )}

              {/* Flowchart Diagram */}
              {q.questionType === 'flowchart' && q.flowchartNodes && (
                <div className="pl-5 pt-2">
                  <div className="text-[11px] font-semibold text-slate-600 mb-1">
                    System Logic Flowchart:
                  </div>
                  <FlowchartViewer nodes={q.flowchartNodes} />
                </div>
              )}

              {/* Coding Problem Specs */}
              {q.questionType === 'coding_problem' && (
                <div className="pl-5 pt-1 space-y-2 text-xs">
                  <div className="text-slate-600 italic">
                    Language: <span className="font-bold font-mono">{q.programmingLanguage || 'C++'}</span> · Time Limit: {q.timeLimitMs || 1000}ms · Memory Limit: {q.memoryLimitMb || 128}MB
                  </div>
                  {q.constraints && (
                    <div>
                      <strong>Constraints: </strong>
                      <code className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">{q.constraints}</code>
                    </div>
                  )}
                  {(q.sampleInput || q.sampleOutput) && (
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="border border-slate-300 p-2 bg-slate-50">
                        <strong className="block text-slate-700 mb-0.5">Sample Input:</strong>
                        <pre className="whitespace-pre-wrap">{q.sampleInput || '(No input)'}</pre>
                      </div>
                      <div className="border border-slate-300 p-2 bg-slate-50">
                        <strong className="block text-slate-700 mb-0.5">Sample Output:</strong>
                        <pre className="whitespace-pre-wrap">{q.sampleOutput || '(No output)'}</pre>
                      </div>
                    </div>
                  )}
                  <div className="h-36 border border-dashed border-slate-400 p-3 text-slate-400 font-mono text-[11px] flex flex-col justify-between">
                    <div>[Space for student source code implementation / algorithm draft]</div>
                    <div className="text-right text-[10px] text-slate-400">Continue on official bluebook if additional space is needed</div>
                  </div>
                </div>
              )}

              {/* Algorithm Tracing / Problem Solving */}
              {(q.questionType === 'algorithm_tracing' || q.questionType === 'problem_solving') && !q.codeSnippet && (
                <div className="pl-5 pt-1">
                  <div className="h-28 border border-dashed border-slate-300 p-2 text-slate-400 font-mono text-[11px]">
                    [Step-by-step solution / state trace workspace]
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End of Examination Footer */}
      <div className="mt-8 pt-4 border-t-2 border-slate-900 text-center text-xs font-bold uppercase tracking-wider text-slate-900">
        *** END OF EXAMINATION · SET {activeSetCode} ***
      </div>
    </div>
  );
};
