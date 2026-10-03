import React from 'react';
import { Examination, ExamSet, Question } from '../../types';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface ExamAnswerKeyDocumentProps {
  exam: Examination;
  set: ExamSet;
  activeSetCode: 'A' | 'B' | 'C' | 'D';
  questions: Question[];
  institutionName: string;
  collegeName: string;
  departmentName: string;
  examinerName: string;
  id?: string;
  className?: string;
  isSeparatePrintPage?: boolean;
}

export const ExamAnswerKeyDocument: React.FC<ExamAnswerKeyDocumentProps> = ({
  exam,
  set,
  activeSetCode,
  questions,
  institutionName,
  collegeName,
  departmentName,
  examinerName,
  id = 'exam-answer-key-container',
  className = '',
  isSeparatePrintPage = true,
}) => {
  return (
    <div
      id={id}
      className={`bg-white border border-slate-300 shadow-md max-w-4xl mx-auto p-8 sm:p-12 text-slate-900 print:shadow-none print:border-none print:p-0 ${
        isSeparatePrintPage ? 'page-break-before' : ''
      } ${className}`}
      style={isSeparatePrintPage ? { pageBreakBefore: 'always', breakBefore: 'page' } : undefined}
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
        <div className="text-base font-extrabold uppercase pt-2 text-slate-900">
          {exam.courseCode}: {exam.courseTitle}
        </div>
        <div className="text-xs font-medium text-slate-700">
          {exam.assessmentType} · {exam.semester}, Academic Year {exam.academicYear}
        </div>
      </div>

      {/* Confidentiality Warning & Key Info Banner */}
      <div className="my-4 border-2 border-slate-900 p-3 bg-slate-50">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-300">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white font-mono text-xs px-2 py-0.5 font-bold uppercase rounded-xs">
              CONFIDENTIAL · FACULTY USE ONLY
            </span>
            <span className="font-extrabold text-xs tracking-wider uppercase text-slate-900">
              OFFICIAL MASTER ANSWER KEY & SCORING SPECIFICATION
            </span>
          </div>
          <div className="font-mono font-bold text-sm text-slate-900">
            KEY FOR SET {activeSetCode}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-800">
          <div>
            <span className="font-semibold text-slate-600">Total Exam Items:</span>{' '}
            <strong>{set.questions.length} items</strong>
          </div>
          <div>
            <span className="font-semibold text-slate-600">Total Points:</span>{' '}
            <strong>{exam.totalPoints} points</strong>
          </div>
          <div>
            <span className="font-semibold text-slate-600">Examiner:</span>{' '}
            <strong>{examinerName}</strong>
          </div>
          <div>
            <span className="font-semibold text-slate-600">Examination Date:</span>{' '}
            <strong>{exam.examDate}</strong>
          </div>
        </div>
      </div>

      {/* SECTION 1: RAPID SCORING SUMMARY MATRIX (FOR QUICK GRADING) */}
      <div className="mb-6 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 inline" />
          <span>Part I: Rapid Scoring Quick-Key Matrix</span>
        </h3>
        <p className="text-[11px] text-slate-600">
          Quick-reference key for multiple choice, true/false, matching, and fill-in-the-blank items.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-2 w-12 text-center border-r border-slate-300">#</th>
                <th className="p-2 w-28 border-r border-slate-300">Question ID</th>
                <th className="p-2 w-28 border-r border-slate-300">Format</th>
                <th className="p-2 border-r border-slate-300">Correct Answer / Key Solution</th>
                <th className="p-2 w-16 text-center border-r border-slate-300">Pts</th>
                <th className="p-2 w-28 text-center">Bloom Domain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {set.answerKey.map((key) => {
                const origQ = questions.find((q) => q.id === key.questionId);
                return (
                  <tr key={key.questionNumber} className="hover:bg-slate-50">
                    <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-200">
                      {key.questionNumber}
                    </td>
                    <td className="p-2 text-slate-600 border-r border-slate-200">
                      {key.questionId}
                    </td>
                    <td className="p-2 font-sans capitalize text-slate-700 border-r border-slate-200">
                      {key.type.replace('_', ' ')}
                    </td>
                    <td className="p-2 text-emerald-900 font-bold font-sans border-r border-slate-200">
                      <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        {key.answer}
                      </span>
                    </td>
                    <td className="p-2 text-center font-sans font-bold tabular-nums text-slate-800 border-r border-slate-200">
                      {key.points}
                    </td>
                    <td className="p-2 text-center font-sans text-slate-600 text-[11px]">
                      {origQ?.cognitiveLevel || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: COMPREHENSIVE ITEM-BY-ITEM SOLUTIONS & RATIONALES */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300">
          Part II: Detailed Solutions, Explanations, and Grading Criteria
        </h3>

        <div className="space-y-4">
          {set.questions.map((q, idx) => {
            const keyInfo = set.answerKey.find((k) => k.questionNumber === idx + 1);
            return (
              <div key={q.id || idx} className="avoid-break p-3.5 border border-slate-300 rounded-xs bg-slate-50/50 space-y-2 text-xs">
                {/* Item header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-1.5">
                  <div className="font-semibold text-slate-900 leading-snug">
                    <span className="font-bold mr-1">Item #{idx + 1}:</span>
                    {q.questionText}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold font-mono text-slate-800">
                      {q.points} pt{q.points > 1 ? 's' : ''}
                    </span>
                    <span className="block text-[10px] text-slate-500 capitalize">
                      {q.questionType.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Official Answer Box */}
                <div className="bg-emerald-50/70 border border-emerald-300 p-2.5 rounded text-emerald-950">
                  <strong className="block text-emerald-900 font-bold mb-0.5">
                    Official Correct Answer / Solution:
                  </strong>
                  <div className="font-semibold text-slate-900">
                    {keyInfo?.answer || q.correctAnswer}
                  </div>
                </div>

                {/* Explanation / Rationale */}
                {q.explanation && (
                  <div className="text-slate-700 bg-white border border-slate-200 p-2.5 rounded leading-relaxed">
                    <strong className="text-slate-900 font-semibold block mb-0.5">
                      Pedagogical Rationale & Clarification:
                    </strong>
                    {q.explanation}
                  </div>
                )}

                {/* For Coding Problems: Test Cases & Solution Code */}
                {q.questionType === 'coding_problem' && (
                  <div className="space-y-2 pt-1">
                    {q.expectedSolution && (
                      <div>
                        <strong className="text-slate-800 text-[11px] block mb-1">
                          Model Reference Solution ({q.programmingLanguage || 'C++'}):
                        </strong>
                        <pre className="p-2.5 bg-slate-900 text-slate-100 font-mono text-[11px] rounded whitespace-pre overflow-x-auto leading-relaxed">
                          <code>{q.expectedSolution}</code>
                        </pre>
                      </div>
                    )}

                    {q.testCases && q.testCases.length > 0 && (
                      <div>
                        <strong className="text-slate-800 text-[11px] block mb-1">
                          Official Evaluation Test Cases:
                        </strong>
                        <table className="w-full text-left text-[11px] border border-slate-300 border-collapse bg-white">
                          <thead>
                            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold">
                              <th className="p-1.5 w-12 text-center border-r border-slate-300">Case</th>
                              <th className="p-1.5 border-r border-slate-300">Input Specification</th>
                              <th className="p-1.5 border-r border-slate-300">Expected Output</th>
                              <th className="p-1.5 w-16 text-center">Weight</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-mono">
                            {q.testCases.map((tc, tcIdx) => (
                              <tr key={tc.id || tcIdx}>
                                <td className="p-1.5 text-center font-bold border-r border-slate-200">{tcIdx + 1}</td>
                                <td className="p-1.5 border-r border-slate-200">{tc.input || '(None)'}</td>
                                <td className="p-1.5 border-r border-slate-200 text-emerald-800 font-bold">{tc.expectedOutput}</td>
                                <td className="p-1.5 text-center font-sans border-slate-200">{tc.weight}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* For Matching Type: Pair Breakdown */}
                {q.questionType === 'matching' && q.matchingPairs && (
                  <div className="bg-white border border-slate-200 p-2 rounded text-[11px]">
                    <strong className="text-slate-800 block mb-1">Matched Key Mapping:</strong>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {q.matchingPairs.map((p, pIdx) => (
                        <div key={p.id}>
                          <span className="font-bold">{pIdx + 1}. {p.itemA}</span> →{' '}
                          <span className="text-emerald-800 font-semibold">{p.itemB}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Sign-off & Verification Block */}
      <div className="avoid-break mt-10 pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs text-center">
        <div>
          <div className="border-b border-slate-900 pb-8 font-bold text-slate-900 uppercase">
            {examinerName}
          </div>
          <div className="pt-1 text-[11px] text-slate-600">Faculty Examiner / Prepared By</div>
        </div>

        <div>
          <div className="border-b border-slate-900 pb-8 font-bold text-slate-900 uppercase">
            QA & Curriculum Validator
          </div>
          <div className="pt-1 text-[11px] text-slate-600">Peer Reviewed & Verified</div>
        </div>

        <div>
          <div className="border-b border-slate-900 pb-8 font-bold text-slate-900 uppercase">
            Department Chairperson
          </div>
          <div className="pt-1 text-[11px] text-slate-600">Approved for Examination Release</div>
        </div>
      </div>

      <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
        Official Document Generated via BSCpE Examination Question Data Bank System · Set {activeSetCode} Answer Key
      </div>
    </div>
  );
};
