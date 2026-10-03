import React, { useState, useMemo, useEffect } from 'react';
import {
  Question,
  Course,
  Examination,
  ExamSet,
  RandomizedQuestion,
  TableOfSpecificationItem,
  CognitiveLevel,
  AssessmentType,
  UserRole,
} from '../../types';
import {
  FileText,
  Printer,
  Download,
  Shuffle,
  CheckCircle2,
  Layers,
  Settings,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  BookOpen,
  Loader2,
  FileDown,
  X,
  Check,
} from 'lucide-react';
import { CodeEditorViewer } from '../Common/CodeEditorViewer';
import { FlowchartViewer } from '../Common/FlowchartViewer';
import { generateExamPDF } from '../../utils/pdfExport';
import { printElementById } from '../../utils/printUtils';
import { ExamPaperDocument } from './ExamPaperDocument';
import { ExamAnswerKeyDocument } from './ExamAnswerKeyDocument';

interface ExamGeneratorViewProps {
  questions: Question[];
  courses: Course[];
  currentRole: UserRole;
  examinerName: string;
}

export const ExamGeneratorView: React.FC<ExamGeneratorViewProps> = ({
  questions,
  courses,
  currentRole,
  examinerName,
}) => {
  // Only Approved / Published questions are eligible for exam generation
  const approvedQuestions = useMemo(() => {
    return questions.filter((q) => q.status === 'Approved' || q.status === 'Published');
  }, [questions]);

  // Active view tab inside Exam Generator
  const [activeTab, setActiveTab] = useState<'config' | 'custom_print' | 'preview_paper' | 'answer_key' | 'tos_matrix' | 'omr_sheet'>('config');

  // Generator Configuration State
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(courses[0]?.code || 'CPE 211');
  const [examTitle, setExamTitle] = useState<string>('Midterm Examination');
  const [academicYear, setAcademicYear] = useState<string>('2025-2026');
  const [semester, setSemester] = useState<string>('1st Semester');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('Midterm Exam');
  const [timeDurationMinutes, setTimeDurationMinutes] = useState<number>(120);
  const [institutionName, setInstitutionName] = useState<string>('REPUBLIC OF THE PHILIPPINES · STATE UNIVERSITY');
  const [collegeName, setCollegeName] = useState<string>('COLLEGE OF ENGINEERING AND ARCHITECTURE');
  const [departmentName, setDepartmentName] = useState<string>('DEPARTMENT OF COMPUTER ENGINEERING');
  const [generalInstructions, setGeneralInstructions] = useState<string>(
    'INSTRUCTIONS: Read each question carefully. Write your answers legibly on the provided official answer sheet. Electronic calculators are permitted for problem solving sections. Use of unauthorized mobile phones, smartwatches, or network-capable devices will result in automatic disqualification.'
  );

  // Generation parameters
  const [targetItems, setTargetItems] = useState<number>(10);
  const [randomizeQuestions, setRandomizeQuestions] = useState<boolean>(true);
  const [randomizeChoices, setRandomizeChoices] = useState<boolean>(true);
  const [randomizeMatchingListB, setRandomizeMatchingListB] = useState<boolean>(true);
  const [generateSets, setGenerateSets] = useState<{ A: boolean; B: boolean; C: boolean; D: boolean }>({
    A: true,
    B: true,
    C: false,
    D: false,
  });

  // Selected questions (manual selection or generated)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Generated examination sets state
  const [generatedExam, setGeneratedExam] = useState<Examination | null>(null);
  const [activeSetCode, setActiveSetCode] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const selectedCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];
  const courseQuestions = approvedQuestions.filter((q) => q.courseCode === selectedCourseCode);

  // Helper to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Automated Smart Generator handler
  const handleAutoGenerateExam = () => {
    // Pool questions from this course first, or all approved if not enough
    let pool = approvedQuestions.filter((q) => q.courseCode === selectedCourseCode);
    if (pool.length === 0) {
      pool = approvedQuestions; // fallback to full bank
    }

    if (pool.length === 0) {
      alert('There are no Approved questions in the Question Bank yet to generate an examination.');
      return;
    }

    // Select target count
    const countToPick = Math.min(targetItems, pool.length);
    const chosenQuestions = shuffleArray(pool).slice(0, countToPick);
    setSelectedQuestionIds(chosenQuestions.map((q) => q.id));

    // Generate sets (A, B, C, D)
    const setsToGenerate: ('A' | 'B' | 'C' | 'D')[] = [];
    if (generateSets.A) setsToGenerate.push('A');
    if (generateSets.B) setsToGenerate.push('B');
    if (generateSets.C) setsToGenerate.push('C');
    if (generateSets.D) setsToGenerate.push('D');
    if (setsToGenerate.length === 0) setsToGenerate.push('A');

    const createdSets: ExamSet[] = setsToGenerate.map((setCode) => {
      // Scramble question order if enabled (Set A can be baseline, Set B, C, D permuted)
      const qOrder = randomizeQuestions && setCode !== 'A'
        ? shuffleArray(chosenQuestions)
        : [...chosenQuestions];

      const randomizedQuestions: RandomizedQuestion[] = qOrder.map((q, idx) => {
        let randomizedChoices: string[] | undefined = undefined;
        let randomizedListB: { id: string; text: string }[] | undefined = undefined;
        let scrambledKey: string = '';

        // Scramble multiple choice choices
        if (q.questionType === 'multiple_choice' && q.choices && q.choices.length > 0) {
          if (randomizeChoices) {
            const originalChoicesWithFlag = q.choices.map((c, i) => ({
              text: c,
              isOriginalCorrect: q.correctAnswer === i,
            }));
            const shuffled = shuffleArray(originalChoicesWithFlag);
            randomizedChoices = shuffled.map((s) => s.text);
            const newCorrectIndex = shuffled.findIndex((s) => s.isOriginalCorrect);
            scrambledKey = String.fromCharCode(65 + Math.max(0, newCorrectIndex));
          } else {
            randomizedChoices = [...q.choices];
            scrambledKey = String.fromCharCode(65 + Number(q.correctAnswer || 0));
          }
        } else if (q.questionType === 'true_false') {
          scrambledKey = q.correctAnswer ? 'TRUE' : 'FALSE';
        } else if (q.questionType === 'matching' && q.matchingPairs) {
          if (randomizeMatchingListB) {
            randomizedListB = shuffleArray(
              q.matchingPairs.map((p) => ({ id: p.id, text: p.itemB }))
            );
          }
          scrambledKey = 'See Matching Matrix';
        } else {
          scrambledKey = String(q.correctAnswer || 'See rubric');
        }

        return {
          ...q,
          displayNumber: idx + 1,
          randomizedChoices,
          randomizedListB,
          scrambledAnswerKey: scrambledKey,
        };
      });

      // Construct answer key
      const answerKey = randomizedQuestions.map((rq) => ({
        questionNumber: rq.displayNumber,
        questionId: rq.id,
        answer: rq.scrambledAnswerKey || String(rq.correctAnswer || ''),
        points: rq.points,
        type: rq.questionType,
      }));

      return {
        setCode,
        questions: randomizedQuestions,
        answerKey,
      };
    });

    // Compute Table of Specifications (TOS)
    const topicMap: Record<string, { questions: RandomizedQuestion[] }> = {};
    chosenQuestions.forEach((q) => {
      const t = q.topic || 'General';
      if (!topicMap[t]) topicMap[t] = { questions: [] };
      topicMap[t].questions.push(q as any);
    });

    const tosMatrix: TableOfSpecificationItem[] = Object.keys(topicMap).map((topicName) => {
      const qList = topicMap[topicName].questions;
      const count = qList.length;
      const weight = Math.round((count / chosenQuestions.length) * 100);

      const cognitiveCounts = {
        Remembering: qList.filter((q) => q.cognitiveLevel === 'Remembering').length,
        Understanding: qList.filter((q) => q.cognitiveLevel === 'Understanding').length,
        Applying: qList.filter((q) => q.cognitiveLevel === 'Applying').length,
        Analyzing: qList.filter((q) => q.cognitiveLevel === 'Analyzing').length,
        Evaluating: qList.filter((q) => q.cognitiveLevel === 'Evaluating').length,
        Creating: qList.filter((q) => q.cognitiveLevel === 'Creating').length,
      };

      return {
        topic: topicName,
        hoursSpent: Math.round(weight * 0.45) + 3,
        weightPct: weight,
        cognitiveCounts,
        totalItems: count,
        itemNumbers: [1, 2], // placement indices
      };
    });

    const totalPts = chosenQuestions.reduce((acc, q) => acc + (q.points || 1), 0);

    const newExam: Examination = {
      id: `EXAM-${selectedCourseCode.replace(/\s+/g, '')}-${academicYear}-${Date.now().toString().slice(-4)}`,
      title: `${selectedCourse.title} - ${examTitle}`,
      program: 'Bachelor of Science in Computer Engineering',
      courseCode: selectedCourseCode,
      courseTitle: selectedCourse.title,
      academicYear,
      semester,
      assessmentType,
      examDate: new Date().toISOString().slice(0, 10),
      timeDurationMinutes,
      instructions: generalInstructions,
      totalPoints: totalPts,
      totalItems: chosenQuestions.length,
      sets: createdSets,
      tosMatrix,
      createdBy: examinerName,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'Finalized',
    };

    setGeneratedExam(newExam);
    setActiveSetCode(createdSets[0].setCode);
    setActiveTab('custom_print');
  };

  // Auto-generate initial exam on mount if approved questions exist and none is generated yet
  useEffect(() => {
    if (!generatedExam && approvedQuestions.length > 0) {
      // Small timeout to allow state to settle
      const timer = setTimeout(() => {
        handleAutoGenerateExam();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  // Toggle question selection in manual mode
  const handleToggleQuestion = (qId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Active examination set
  const currentSet = generatedExam?.sets.find((s) => s.setCode === activeSetCode) || generatedExam?.sets[0];

  // Print Dialog & Quick Options state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocumentTarget, setPrintDocumentTarget] = useState<'both' | 'paper' | 'key' | 'tos' | 'omr'>('both');
  const [isPrinting, setIsPrinting] = useState(false);

  // Single-Click Print Both (Exam Paper + Master Answer Key with page-break-before)
  const handlePrintBoth = async () => {
    if (!generatedExam) {
      handleAutoGenerateExam();
    }
    setActiveTab('custom_print');
    setIsPrinting(true);
    try {
      await printElementById('exam-combined-print-container', {
        documentTitle: `${selectedCourseCode}_${examTitle.replace(/\s+/g, '_')}_SET_${activeSetCode}_PACKAGE`,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  // Print Examination Paper Only
  const handlePrintPaperOnly = async () => {
    if (!generatedExam) {
      handleAutoGenerateExam();
    }
    setActiveTab('preview_paper');
    setIsPrinting(true);
    try {
      await printElementById('exam-paper-container', {
        documentTitle: `${selectedCourseCode}_${examTitle.replace(/\s+/g, '_')}_SET_${activeSetCode}_PAPER`,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  // Print Master Answer Key Only
  const handlePrintKeyOnly = async () => {
    if (!generatedExam) {
      handleAutoGenerateExam();
    }
    setActiveTab('answer_key');
    setIsPrinting(true);
    try {
      await printElementById('exam-answer-key-container', {
        documentTitle: `${selectedCourseCode}_${examTitle.replace(/\s+/g, '_')}_SET_${activeSetCode}_ANSWER_KEY`,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  // Print Table of Specifications (TOS) Matrix
  const handlePrintTOS = async () => {
    if (!generatedExam) {
      handleAutoGenerateExam();
    }
    setActiveTab('tos_matrix');
    setIsPrinting(true);
    try {
      await printElementById('exam-tos-container', {
        documentTitle: `${selectedCourseCode}_${examTitle.replace(/\s+/g, '_')}_TOS_MATRIX`,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  // Print Student OMR Bubble Sheet
  const handlePrintOMR = async () => {
    if (!generatedExam) {
      handleAutoGenerateExam();
    }
    setActiveTab('omr_sheet');
    setIsPrinting(true);
    try {
      await printElementById('exam-omr-container', {
        documentTitle: `${selectedCourseCode}_${examTitle.replace(/\s+/g, '_')}_OMR_SHEET`,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  // Default print triggers single-click print both if on custom_print, or current view
  const handlePrint = () => {
    if (activeTab === 'preview_paper') {
      handlePrintPaperOnly();
    } else if (activeTab === 'answer_key') {
      handlePrintKeyOnly();
    } else if (activeTab === 'tos_matrix') {
      handlePrintTOS();
    } else if (activeTab === 'omr_sheet') {
      handlePrintOMR();
    } else {
      handlePrintBoth();
    }
  };

  // PDF Export State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportProgressMsg, setExportProgressMsg] = useState('');
  const [exportOptions, setExportOptions] = useState({
    includePaper: true,
    includeAnswerKey: true,
    includeTOS: true,
    targetSet: 'A' as 'A' | 'B' | 'C' | 'D',
  });

  const exportSet = generatedExam?.sets.find((s) => s.setCode === (exportOptions.targetSet || activeSetCode)) || currentSet;

  // Handler to export formatted PDF
  const handleExportPDF = async () => {
    if (!generatedExam) return;
    setIsExportingPDF(true);
    setExportProgressMsg('Preparing document components for PDF export...');

    try {
      // If user selected a different set for export, ensure current view aligns
      const setCode = exportOptions.targetSet || activeSetCode;
      
      const paperStageId = document.getElementById('export-paper-stage') ? 'export-paper-stage' : 'exam-paper-container';
      const keyStageId = document.getElementById('export-key-stage') ? 'export-key-stage' : 'exam-answer-key-container';
      const tosStageId = document.getElementById('export-tos-stage') ? 'export-tos-stage' : 'exam-tos-container';

      await generateExamPDF(
        exportOptions.includePaper ? paperStageId : '',
        exportOptions.includeAnswerKey ? keyStageId : null,
        exportOptions.includeTOS ? tosStageId : null,
        {
          exam: generatedExam,
          setCode,
          onProgress: (msg) => setExportProgressMsg(msg),
        }
      );

      setTimeout(() => {
        setIsExportingPDF(false);
        setIsExportModalOpen(false);
        setExportProgressMsg('');
      }, 500);
    } catch (err: any) {
      console.error(err);
      alert('Encountered an issue compiling the PDF document: ' + (err?.message || 'Unknown error'));
      setIsExportingPDF(false);
      setExportProgressMsg('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            BSCpE Examination & Test Paper Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate multi-set examinations with question and choice randomization, Table of Specifications (TOS), and synchronized answer keys.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {generatedExam && (
            <>
              {/* PRIMARY SINGLE-CLICK ACTION: Print Exam & Answer Key */}
              <button
                id="exam-print-both-btn"
                name="printBothBtn"
                type="button"
                onClick={handlePrintBoth}
                disabled={isPrinting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 rounded-lg shadow-sm transition-colors"
                title="Single-Click Print Both Examination Paper & Master Answer Key"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isPrinting ? 'Printing Package...' : 'Print Exam & Answer Key'}</span>
                <span className="ml-1 px-1.5 py-0.2 bg-indigo-900/60 rounded text-[10px] font-mono font-normal">
                  Both
                </span>
              </button>

              <button
                id="exam-export-pdf-modal-btn"
                name="exportPdfModalBtn"
                type="button"
                onClick={() => {
                  setExportOptions((prev) => ({ ...prev, targetSet: activeSetCode }));
                  setIsExportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
                title="Export Exam Paper & Answer Key to PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                id="exam-print-paper-btn"
                name="printPaperBtn"
                type="button"
                onClick={handlePrintPaperOnly}
                disabled={isPrinting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-60 rounded-lg transition-colors"
                title="Print Examination Paper Only"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Paper Only</span>
              </button>

              <button
                id="exam-print-key-btn"
                name="printKeyBtn"
                type="button"
                onClick={handlePrintKeyOnly}
                disabled={isPrinting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-60 rounded-lg transition-colors"
                title="Print Master Answer Key Only"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Key Only</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center flex-wrap gap-1 p-1 bg-slate-100 rounded-lg w-fit border border-slate-200 text-xs no-print">
        <button
          id="exam-tab-config"
          name="examTab"
          type="button"
          onClick={() => setActiveTab('config')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            activeTab === 'config'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Generator Blueprint
        </button>

        <button
          id="exam-tab-custom_print"
          name="examTab"
          type="button"
          onClick={() => setActiveTab('custom_print')}
          disabled={!generatedExam}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors ${
            activeTab === 'custom_print'
              ? 'bg-white text-indigo-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          <Printer className="w-3.5 h-3.5 text-indigo-600" />
          <span>Custom Print Layout (Exam + Key)</span>
        </button>

        <button
          id="exam-tab-preview_paper"
          name="examTab"
          type="button"
          onClick={() => setActiveTab('preview_paper')}
          disabled={!generatedExam}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            activeTab === 'preview_paper'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          Exam Paper Preview
        </button>

        <button
          id="exam-tab-answer_key"
          name="examTab"
          type="button"
          onClick={() => setActiveTab('answer_key')}
          disabled={!generatedExam}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            activeTab === 'answer_key'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          Master Answer Key
        </button>

        <button
          id="exam-tab-tos_matrix"
          name="examTab"
          type="button"
          onClick={() => setActiveTab('tos_matrix')}
          disabled={!generatedExam}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            activeTab === 'tos_matrix'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          Table of Specifications (TOS)
        </button>

        <button
          id="exam-tab-omr_sheet"
          name="examTab"
          type="button"
          onClick={() => setActiveTab('omr_sheet')}
          disabled={!generatedExam}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            activeTab === 'omr_sheet'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          Student Answer Grid
        </button>
      </div>

      {/* TAB 1: CONFIGURATION & BLUEPRINT BUILDER */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Settings Left Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Examination Parameters & OBE Blueprint</span>
            </h2>

            {/* Course & Term Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Target BSCpE Course
                </label>
                <select
                  id="exam-course-select"
                  name="courseCode"
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-900 font-semibold focus:ring-1 focus:ring-slate-900"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Examination Term
                </label>
                <select
                  id="exam-term-select"
                  name="examTitle"
                  value={examTitle}
                  onChange={(e) => {
                    setExamTitle(e.target.value);
                    setAssessmentType(e.target.value as any);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-900 font-semibold focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Prelim Examination">Prelim Examination</option>
                  <option value="Midterm Examination">Midterm Examination</option>
                  <option value="Final Examination">Final Examination</option>
                  <option value="Comprehensive Practical Exam">Comprehensive Practical Exam</option>
                  <option value="Departmental Diagnostic Test">Departmental Diagnostic Test</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Academic Year
                </label>
                <input
                  id="exam-academic-year-input"
                  name="academicYear"
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Semester & Time Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    id="exam-semester-select"
                    name="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2 text-slate-900"
                  >
                    <option value="1st Semester">1st Sem</option>
                    <option value="2nd Semester">2nd Sem</option>
                    <option value="Summer">Summer</option>
                  </select>
                  <input
                    id="exam-time-duration-input"
                    name="timeDurationMinutes"
                    type="number"
                    value={timeDurationMinutes}
                    onChange={(e) => setTimeDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2 font-mono text-center"
                    title="Duration in minutes"
                  />
                </div>
              </div>
            </div>

            {/* University & Department Header Settings */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <span className="font-semibold text-slate-700 block">
                Official University Examination Header Format
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  id="exam-institution-name-input"
                  name="institutionName"
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="bg-white border border-slate-300 rounded p-1.5 text-[11px]"
                  placeholder="Institution Name"
                />
                <input
                  id="exam-college-name-input"
                  name="collegeName"
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="bg-white border border-slate-300 rounded p-1.5 text-[11px]"
                  placeholder="College Name"
                />
                <input
                  id="exam-department-name-input"
                  name="departmentName"
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="bg-white border border-slate-300 rounded p-1.5 text-[11px]"
                  placeholder="Department Name"
                />
              </div>
            </div>

            {/* General Instructions Textarea */}
            <div>
              <label className="block text-slate-600 font-medium text-xs mb-1">
                General Examination Directions & Conduct
              </label>
              <textarea
                id="exam-instructions-input"
                name="instructions"
                rows={2}
                value={generalInstructions}
                onChange={(e) => setGeneralInstructions(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            {/* Randomization & Multi-Set Toggles */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Randomization & Multi-Set Configurations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="exam-randomize-questions-checkbox"
                    name="randomizeQuestions"
                    type="checkbox"
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-slate-800 font-medium">
                    Randomize question sequence across sets
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="exam-randomize-choices-checkbox"
                    name="randomizeChoices"
                    type="checkbox"
                    checked={randomizeChoices}
                    onChange={(e) => setRandomizeChoices(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-slate-800 font-medium">
                    Randomize Multiple Choice options (A-D)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="exam-randomize-matching-checkbox"
                    name="randomizeMatchingListB"
                    type="checkbox"
                    checked={randomizeMatchingListB}
                    onChange={(e) => setRandomizeMatchingListB(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-slate-800 font-medium">
                    Randomize Matching Type (List B)
                  </span>
                </label>
              </div>

              {/* Multi-set checkboxes */}
              <div className="pt-2 border-t border-slate-200 flex items-center gap-4">
                <span className="text-slate-700 font-medium">Generate Sets:</span>
                {(['A', 'B', 'C', 'D'] as const).map((set) => (
                  <label key={set} className="flex items-center gap-1.5 cursor-pointer font-semibold font-mono">
                    <input
                      id={`exam-set-checkbox-${set}`}
                      name={`generateSet${set}`}
                      type="checkbox"
                      checked={generateSets[set]}
                      onChange={(e) =>
                        setGenerateSets({ ...generateSets, [set]: e.target.checked })
                      }
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span>Set {set}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Items slider / count */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs">
                <span className="font-semibold text-slate-700">Target Total Items: </span>
                <span className="font-mono font-bold text-slate-900">{targetItems} questions</span>
                <span className="text-slate-400 ml-2">
                  (Available approved pool: {courseQuestions.length} for this course, {approvedQuestions.length} total)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="exam-target-items-slider"
                  name="targetItems"
                  type="range"
                  min={2}
                  max={Math.max(10, approvedQuestions.length)}
                  value={targetItems}
                  onChange={(e) => setTargetItems(Number(e.target.value))}
                  className="w-32 accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            {/* 1-Click Generate Button */}
            <button
              id="exam-auto-generate-btn"
              name="generateExamBtn"
              type="button"
              onClick={handleAutoGenerateExam}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Generate Examination Sets & Synchronized Answer Keys</span>
            </button>
          </div>

          {/* Right Column: Approved Pool & Selection Review (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Eligible Approved Questions ({courseQuestions.length})
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedQuestionIds.length} chosen
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Questions must be validated and in <strong>Approved</strong> status to be eligible. You can let the generator pick automatically or manually select below.
            </p>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {courseQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                        <span className="font-bold text-slate-900">{q.id}</span>
                      </div>
                      <span>{q.points} pt{q.points > 1 ? 's' : ''}</span>
                    </div>

                    <div className="text-slate-800 font-medium line-clamp-2">
                      {q.questionText}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <span>{q.topic}</span>
                      <span>·</span>
                      <span>{q.difficultyLevel}</span>
                      <span>·</span>
                      <span>{q.cognitiveLevel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM PRINT LAYOUT (EXAM PAPER + SEPARATED ANSWER KEY WITH PAGE-BREAK-BEFORE) */}
      {activeTab === 'custom_print' && generatedExam && currentSet && (
        <div className="space-y-6">
          {/* Controls Bar (no-print) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 no-print shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Active Examination Set:</span>
                <div className="flex items-center gap-1">
                  {generatedExam.sets.map((s) => (
                    <button
                      key={s.setCode}
                      type="button"
                      onClick={() => setActiveSetCode(s.setCode)}
                      className={`px-3 py-1 font-mono text-xs font-bold rounded-md transition-colors ${
                        activeSetCode === s.setCode
                          ? 'bg-indigo-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Set {s.setCode}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Custom print layout combining official Examination Paper and Master Answer Key. The Answer Key incorporates explicit <code className="bg-slate-100 px-1 py-0.5 font-mono text-slate-700 rounded font-semibold">page-break-before</code> styling to ensure separation onto a clean physical sheet.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={handlePrintBoth}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors shadow-xs"
                title="Single-Click Print Both Examination Paper & Master Answer Key"
              >
                <Printer className="w-4 h-4" />
                <span>Single-Click Print Both (Exam + Key)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExportOptions({
                    includePaper: true,
                    includeAnswerKey: true,
                    includeTOS: false,
                    targetSet: activeSetCode,
                  });
                  setIsExportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors"
                title="Export Both Documents to PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Unified Printable Container */}
          <div id="exam-combined-print-container" className="space-y-0">
            {/* DOCUMENT PART 1: Official Examination Paper */}
            <div className="print-exam-paper-section">
              <ExamPaperDocument
                exam={generatedExam}
                set={currentSet}
                activeSetCode={activeSetCode}
                institutionName={institutionName}
                collegeName={collegeName}
                departmentName={departmentName}
                id="exam-paper-container"
              />
            </div>

            {/* SCREEN-ONLY VISUAL PAGE BREAK SEPARATOR */}
            <div className="no-print my-8 py-4 px-6 border-2 border-dashed border-amber-300 bg-amber-50/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight text-amber-950 flex items-center gap-2">
                    <span>Physical Page Break Boundary</span>
                    <span className="text-[10px] font-mono uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-semibold">
                      page-break-before: always
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800/90 mt-0.5">
                    When printed to paper or saved to PDF, the official Master Answer Key begins cleanly at the top of a new sheet.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrintBoth}
                  className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Both Now</span>
                </button>
              </div>
            </div>

            {/* DOCUMENT PART 2: Official Master Answer Key & Scoring Guide (with page-break-before) */}
            <div className="print-answer-key-section page-break-before">
              <ExamAnswerKeyDocument
                exam={generatedExam}
                set={currentSet}
                activeSetCode={activeSetCode}
                questions={questions}
                institutionName={institutionName}
                collegeName={collegeName}
                departmentName={departmentName}
                examinerName={examinerName}
                id="exam-answer-key-container"
                isSeparatePrintPage={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXAMINATION PAPER PREVIEW ONLY */}
      {activeTab === 'preview_paper' && generatedExam && currentSet && (
        <div className="space-y-4">
          {/* Sets switcher header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Previewing Exam Set:</span>
              <div className="flex items-center gap-1">
                {generatedExam.sets.map((s) => (
                  <button
                    key={s.setCode}
                    type="button"
                    onClick={() => setActiveSetCode(s.setCode)}
                    className={`px-3 py-1 font-mono text-xs font-bold rounded-md transition-colors ${
                      activeSetCode === s.setCode
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Set {s.setCode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-500">
                Items: <strong>{currentSet.questions.length}</strong> · Points: <strong>{generatedExam.totalPoints} pts</strong>
              </span>

              <button
                type="button"
                onClick={handlePrintBoth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 text-white rounded font-medium hover:bg-indigo-800 transition-colors"
                title="Single-Click Print Both Examination Paper & Answer Key"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Both (Exam + Key)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPaperOnly}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
                title="Print Exam Paper Only"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Paper Only</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExportOptions({
                    includePaper: true,
                    includeAnswerKey: false,
                    includeTOS: false,
                    targetSet: activeSetCode,
                  });
                  setIsExportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 transition-colors"
                title="Export Set to PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <ExamPaperDocument
            exam={generatedExam}
            set={currentSet}
            activeSetCode={activeSetCode}
            institutionName={institutionName}
            collegeName={collegeName}
            departmentName={departmentName}
            id="exam-paper-container"
          />
        </div>
      )}

      {/* TAB 4: MASTER ANSWER KEY ONLY */}
      {activeTab === 'answer_key' && generatedExam && currentSet && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Answer Key For:</span>
              <div className="flex items-center gap-1">
                {generatedExam.sets.map((s) => (
                  <button
                    key={s.setCode}
                    type="button"
                    onClick={() => setActiveSetCode(s.setCode)}
                    className={`px-3 py-1 font-mono text-xs font-bold rounded-md transition-colors ${
                      activeSetCode === s.setCode
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Key: Set {s.setCode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={handlePrintBoth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 text-white rounded font-medium hover:bg-indigo-800 transition-colors"
                title="Single-Click Print Both Examination Paper & Answer Key"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Both (Exam + Key)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintKeyOnly}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
                title="Print Answer Key Only"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Key Only</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExportOptions({
                    includePaper: false,
                    includeAnswerKey: true,
                    includeTOS: false,
                    targetSet: activeSetCode,
                  });
                  setIsExportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 transition-colors"
                title="Export Master Answer Key to PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Key PDF</span>
              </button>
            </div>
          </div>

          <ExamAnswerKeyDocument
            exam={generatedExam}
            set={currentSet}
            activeSetCode={activeSetCode}
            questions={questions}
            institutionName={institutionName}
            collegeName={collegeName}
            departmentName={departmentName}
            examinerName={examinerName}
            id="exam-answer-key-container"
            isSeparatePrintPage={false}
          />
        </div>
      )}

      {/* TAB 4: TABLE OF SPECIFICATIONS (TOS) */}
      {activeTab === 'tos_matrix' && generatedExam && (
        <div id="exam-tos-container" className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Academic Table of Specifications (TOS) Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Curricular alignment across Bloom's Taxonomy cognitive domains (Outcome-Based Education Standard).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setExportOptions({
                  includePaper: false,
                  includeAnswerKey: false,
                  includeTOS: true,
                  targetSet: activeSetCode,
                });
                setIsExportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 transition-colors"
              title="Export Table of Specifications to PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export TOS PDF</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-left">Course Topic / Module</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-16">Hours</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-16">Weight %</th>
                  <th colSpan={6} className="p-2 border-b border-slate-300">Bloom's Cognitive Domain Distribution</th>
                  <th rowSpan={2} className="p-2.5 border-l border-slate-300 w-16">Total Items</th>
                </tr>
                <tr className="bg-slate-50 text-[11px] text-slate-700 font-semibold border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-200">Rem (R)</th>
                  <th className="p-1.5 border-r border-slate-200">Und (U)</th>
                  <th className="p-1.5 border-r border-slate-200">App (Ap)</th>
                  <th className="p-1.5 border-r border-slate-200">Ana (An)</th>
                  <th className="p-1.5 border-r border-slate-200">Eva (E)</th>
                  <th className="p-1.5">Cre (C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {generatedExam.tosMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/75">
                    <td className="p-2.5 text-left font-sans font-medium text-slate-800 border-r border-slate-200">
                      {item.topic}
                    </td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.hoursSpent}h</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.weightPct}%</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Remembering || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Understanding || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Applying || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Analyzing || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Evaluating || '-'}</td>
                    <td className="p-2 tabular-nums">{item.cognitiveCounts.Creating || '-'}</td>
                    <td className="p-2 border-l border-slate-200 font-bold text-slate-900 tabular-nums">
                      {item.totalItems}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="p-2.5 text-left border-r border-slate-300">TOTAL SUMMARY</td>
                  <td className="p-2 border-r border-slate-300 font-mono">
                    {generatedExam.tosMatrix.reduce((a, b) => a + b.hoursSpent, 0)}h
                  </td>
                  <td className="p-2 border-r border-slate-300 font-mono">100%</td>
                  <td className="p-2 border-r border-slate-200 font-mono">
                    {generatedExam.tosMatrix.reduce((a, b) => a + b.cognitiveCounts.Remembering, 0)}
                  </td>
                  <td className="p-2 border-r border-slate-200 font-mono">
                    {generatedExam.tosMatrix.reduce((a, b) => a + b.cognitiveCounts.Understanding, 0)}
                  </td>
                  <td className="p-2 border-r border-slate-200 font-mono">
                    {generatedExam.tosMatrix.reduce((a, b) => a + b.cognitiveCounts.Applying, 0)}
                  </td>
                  <td className="p-2 border-r border-slate-200 font-mono">
                    {generatedExam.tosMatrix.reduce((a, b) => a + b.cognitiveCounts.Analyzing, 0)}
                  </td>
                  <td className="p-2 border-r border-slate-200 font-mono">
                    {generatedExam.tosMatrix.reduce((a, b) => a + b.cognitiveCounts.Evaluating, 0)}
                  </td>
                  <td className="p-2 font-mono">
                    {generatedExam.tosMatrix.reduce((a, b) => a + b.cognitiveCounts.Creating, 0)}
                  </td>
                  <td className="p-2 border-l border-slate-300 font-mono text-emerald-800">
                    {generatedExam.totalItems} Items
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT OMR BUBBLE ANSWER SHEET */}
      {activeTab === 'omr_sheet' && generatedExam && (
        <div className="bg-white border border-slate-300 shadow-md max-w-3xl mx-auto p-8 text-slate-900 print:shadow-none print:border-none print:p-0">
          <div className="text-center pb-3 border-b-2 border-slate-900">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              OFFICIAL EXAMINATION ANSWER GRID SHEET
            </h2>
            <h3 className="text-sm font-extrabold uppercase mt-1">
              {generatedExam.courseCode}: {generatedExam.courseTitle}
            </h3>
            <p className="text-[11px] text-slate-600">
              Shade the bubble corresponding to your answer completely using a No. 2 pencil or black pen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4 p-3 border border-slate-300 text-xs">
            <div>Student Name: _____________________________________</div>
            <div>Student ID: _________________________________</div>
            <div>Exam Set: [ &nbsp; ] A &nbsp;&nbsp; [ &nbsp; ] B &nbsp;&nbsp; [ &nbsp; ] C &nbsp;&nbsp; [ &nbsp; ] D</div>
            <div>Date & Score: _______________________________</div>
          </div>

          {/* Bubble Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {Array.from({ length: generatedExam.totalItems }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 border border-slate-200 rounded font-mono text-xs">
                <span className="font-bold w-6">{i + 1}.</span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center font-semibold">A</span>
                  <span className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center font-semibold">B</span>
                  <span className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center font-semibold">C</span>
                  <span className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center font-semibold">D</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-300 text-center text-[11px] text-slate-500">
            For coding and problem solving sections, utilize official examination bluebook booklet.
          </div>
        </div>
      )}

      {/* Offscreen Staging Area for Seamless PDF Export of any Set / Components */}
      {generatedExam && exportSet && (
        <div
          id="pdf-export-staging-area"
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-10000px',
            top: '0',
            width: '900px',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -9999,
          }}
        >
          <div id="export-paper-stage">
            <ExamPaperDocument
              exam={generatedExam}
              set={exportSet}
              activeSetCode={exportSet.setCode}
              institutionName={institutionName}
              collegeName={collegeName}
              departmentName={departmentName}
            />
          </div>

          <div id="export-key-stage">
            <ExamAnswerKeyDocument
              exam={generatedExam}
              set={exportSet}
              activeSetCode={exportSet.setCode}
              questions={questions}
              institutionName={institutionName}
              collegeName={collegeName}
              departmentName={departmentName}
              examinerName={examinerName}
              isSeparatePrintPage={true}
            />
          </div>

          <div id="export-tos-stage" className="bg-white p-8 text-slate-900">
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900 mb-4">
              <div className="text-xs font-bold uppercase">{institutionName}</div>
              <div className="text-xs font-semibold uppercase">{collegeName} · {departmentName}</div>
              <div className="text-sm font-bold uppercase">{generatedExam.courseCode}: {generatedExam.courseTitle}</div>
              <div className="text-xs font-medium text-slate-600">Table of Specifications (TOS) · {generatedExam.assessmentType}</div>
            </div>

            <table className="w-full text-center text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 text-left">Course Topic / Module</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-16">Hours</th>
                  <th rowSpan={2} className="p-2.5 border-r border-slate-300 w-16">Weight %</th>
                  <th colSpan={6} className="p-2 border-b border-slate-300">Bloom's Cognitive Domain Distribution</th>
                  <th rowSpan={2} className="p-2.5 border-l border-slate-300 w-16">Total Items</th>
                </tr>
                <tr className="bg-slate-50 text-[11px] text-slate-700 font-semibold border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-200">Rem (R)</th>
                  <th className="p-1.5 border-r border-slate-200">Und (U)</th>
                  <th className="p-1.5 border-r border-slate-200">App (Ap)</th>
                  <th className="p-1.5 border-r border-slate-200">Ana (An)</th>
                  <th className="p-1.5 border-r border-slate-200">Eva (E)</th>
                  <th className="p-1.5">Cre (C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {generatedExam.tosMatrix.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-left font-sans font-medium text-slate-800 border-r border-slate-200">
                      {item.topic}
                    </td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.hoursSpent}h</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.weightPct}%</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Remembering || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Understanding || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Applying || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Analyzing || '-'}</td>
                    <td className="p-2 border-r border-slate-200 tabular-nums">{item.cognitiveCounts.Evaluating || '-'}</td>
                    <td className="p-2 tabular-nums">{item.cognitiveCounts.Creating || '-'}</td>
                    <td className="p-2 font-bold border-l border-slate-200 tabular-nums">{item.totalItems}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PDF Export Configuration & Progress Modal */}
      {isExportModalOpen && generatedExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Export Examination Package to PDF
                </h3>
              </div>
              {!isExportingPDF && (
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Set Selection */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-800">
                Examination Set to Export:
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {generatedExam.sets.map((s) => (
                  <button
                    key={s.setCode}
                    type="button"
                    disabled={isExportingPDF}
                    onClick={() => {
                      setExportOptions((prev) => ({ ...prev, targetSet: s.setCode }));
                      setActiveSetCode(s.setCode);
                    }}
                    className={`py-2 text-center rounded-lg border font-bold transition-colors ${
                      (exportOptions.targetSet || activeSetCode) === s.setCode
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Set {s.setCode}
                  </button>
                ))}
              </div>
            </div>

            {/* Components Selection */}
            <div className="space-y-2.5 text-xs">
              <label className="block font-semibold text-slate-800">
                Include in PDF Document:
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includePaper}
                    disabled={isExportingPDF}
                    onChange={(e) =>
                      setExportOptions((prev) => ({ ...prev, includePaper: e.target.checked }))
                    }
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 block">Examination Paper</span>
                    <span className="text-[11px] text-slate-500">
                      Standard university header, instructions, questions ({generatedExam.totalItems} items), and problem solving / code prompts
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeAnswerKey}
                    disabled={isExportingPDF}
                    onChange={(e) =>
                      setExportOptions((prev) => ({ ...prev, includeAnswerKey: e.target.checked }))
                    }
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 block">Master Answer Key & Scoring Guide</span>
                    <span className="text-[11px] text-slate-500">
                      Synchronized answer resolutions and explanations for Set {exportOptions.targetSet || activeSetCode}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeTOS}
                    disabled={isExportingPDF}
                    onChange={(e) =>
                      setExportOptions((prev) => ({ ...prev, includeTOS: e.target.checked }))
                    }
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 block">Table of Specifications (TOS)</span>
                    <span className="text-[11px] text-slate-500">
                      Curricular matrix distributing items across Bloom's Taxonomy cognitive domains
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Document specs note */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Print-Optimized PDF Formatting:</div>
              <div>• Output: Standard ISO A4 (210mm × 297mm) multi-page vector layout</div>
              <div>• Resolution: 200% DPI rasterization with preserved typography and code spacing</div>
              <div>• File Name: <code className="font-mono text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">{generatedExam.courseCode.replace(/\s+/g, '_')}_{generatedExam.assessmentType.replace(/\s+/g, '_')}_SET_{exportOptions.targetSet || activeSetCode}.pdf</code></div>
            </div>

            {/* Progress indicator */}
            {isExportingPDF && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-3 text-xs text-emerald-900">
                <Loader2 className="w-4 h-4 text-emerald-700 animate-spin shrink-0" />
                <span className="font-medium">{exportProgressMsg || 'Generating PDF...'}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                disabled={isExportingPDF}
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  isExportingPDF ||
                  (!exportOptions.includePaper && !exportOptions.includeAnswerKey && !exportOptions.includeTOS)
                }
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Generate & Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
