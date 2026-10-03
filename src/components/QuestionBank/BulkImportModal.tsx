import React, { useState } from 'react';
import { Question, Course } from '../../types';
import { X, Upload, Download, Check, AlertCircle, FileText } from 'lucide-react';

interface BulkImportModalProps {
  courses: Course[];
  authorName: string;
  onClose: () => void;
  onImport: (questions: Question[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  courses,
  authorName,
  onClose,
  onImport,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewList, setPreviewList] = useState<Partial<Question>[] | null>(null);

  const sampleTemplate = [
    {
      courseCode: "CPE 101",
      topic: "Functions & Recursion",
      subtopic: "Recursive Baselines",
      questionType: "multiple_choice",
      questionText: "What condition occurs if a recursive function does not define a valid base case terminating execution?",
      choices: [
        "Stack Overflow error",
        "Heap fragmentation",
        "Memory bus parity exception",
        "Compilation syntax error"
      ],
      correctAnswer: 0,
      explanation: "Without a terminating base case, recursive stack frames continuously consume memory until the call stack exceeds its allocated memory ceiling, triggering a stack overflow.",
      difficultyLevel: "Easy",
      cognitiveLevel: "Understanding",
      learningOutcome: "CLO 2: Analyze call stack execution and recursion bounds.",
      assessmentType: "Midterm Exam",
      points: 1
    },
    {
      courseCode: "CPE 211",
      topic: "Combinational Logic",
      subtopic: "Adders & Decoders",
      questionType: "fill_in_blank",
      questionText: "A Full Adder circuit accepts 3 one-bit binary inputs and produces two outputs: Sum and ________.",
      correctAnswer: "Carry",
      alternativeAnswers: ["Carry Out", "Cout", "C_out"],
      isCaseSensitive: false,
      explanation: "A Full Adder computes the arithmetic sum of inputs A, B, and Carry-In (Cin), yielding Sum = A XOR B XOR Cin and Cout = AB + Cin(A XOR B).",
      difficultyLevel: "Easy",
      cognitiveLevel: "Remembering",
      learningOutcome: "CLO 1: Explain the truth tables and logic expressions for binary adders.",
      assessmentType: "Quiz",
      points: 1
    }
  ];

  const handleDownloadSample = () => {
    const blob = new Blob([JSON.stringify(sampleTemplate, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bscpe_questions_bulk_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleValidate = () => {
    setErrorMsg(null);
    setPreviewList(null);

    if (!jsonText.trim()) {
      setErrorMsg('Please paste JSON data or load a file.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      if (items.length === 0) {
        setErrorMsg('The provided JSON array is empty.');
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.questionText) {
          setErrorMsg(`Item #${i + 1} is missing the required 'questionText' property.`);
          return;
        }
      }

      setPreviewList(items);
    } catch (e: any) {
      setErrorMsg(`JSON Parse Error: ${e.message}`);
    }
  };

  const handleConfirmImport = () => {
    if (!previewList || previewList.length === 0) return;

    const imported: Question[] = previewList.map((item, idx) => {
      const matchedCourse = courses.find((c) => c.code === item.courseCode) || courses[0];
      const qId = item.id || `BSCPE-${(item.courseCode || 'GEN').replace(/\s+/g, '')}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      return {
        id: qId,
        program: 'Bachelor of Science in Computer Engineering',
        courseCode: item.courseCode || matchedCourse.code,
        courseTitle: item.courseTitle || matchedCourse.title,
        topic: item.topic || matchedCourse.topics[0]?.name || 'General',
        subtopic: item.subtopic || 'Core',
        questionType: item.questionType || 'multiple_choice',
        questionText: item.questionText || '',
        choices: item.choices,
        correctAnswer: item.correctAnswer !== undefined ? item.correctAnswer : 0,
        explanation: item.explanation || 'Pedagogical explanation.',
        matchingPairs: item.matchingPairs,
        alternativeAnswers: item.alternativeAnswers,
        isCaseSensitive: item.isCaseSensitive || false,
        programmingLanguage: item.programmingLanguage,
        codeSnippet: item.codeSnippet,
        inputSpecification: item.inputSpecification,
        outputSpecification: item.outputSpecification,
        constraints: item.constraints,
        sampleInput: item.sampleInput,
        sampleOutput: item.sampleOutput,
        expectedSolution: item.expectedSolution,
        testCases: item.testCases,
        difficultyLevel: item.difficultyLevel || 'Medium',
        cognitiveLevel: item.cognitiveLevel || 'Understanding',
        learningOutcome: item.learningOutcome || 'CLO 1: Master computer engineering fundamentals.',
        assessmentType: item.assessmentType || 'Midterm Exam',
        points: item.points || 1,
        author: item.author || authorName,
        academicYear: item.academicYear || '2025-2026',
        semester: item.semester || '1st Semester',
        status: item.status || 'Draft',
        dateCreated: item.dateCreated || new Date().toISOString().slice(0, 10),
        dateModified: new Date().toISOString().slice(0, 10),
        version: 1,
      };
    });

    onImport(imported);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/75">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Bulk Upload Questions
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

        <div className="p-6 space-y-4 text-xs text-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">
              Paste questions formatted as a JSON array of question objects:
            </span>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="flex items-center gap-1 text-slate-800 font-semibold hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample JSON Template</span>
            </button>
          </div>

          <textarea
            rows={10}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`[\n  {\n    "courseCode": "CPE 101",\n    "topic": "Pointers",\n    "questionType": "multiple_choice",\n    "questionText": "What does the unary operator & return in C++?",\n    "choices": ["Memory address", "Dereferenced value", "Bitwise AND result", "Boolean status"],\n    "correctAnswer": 0,\n    "explanation": "The & address-of operator yields memory address of operand."\n  }\n]`}
            className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none"
            spellCheck={false}
          />

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {previewList && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
                <Check className="w-4 h-4" /> Validated {previewList.length} question(s) successfully!
              </div>
              <p className="text-[11px] text-emerald-700">
                Ready to append into the question data bank. Click "Import {previewList.length} Questions" below.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!previewList ? (
              <button
                type="button"
                onClick={handleValidate}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Validate JSON
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                Import {previewList.length} Questions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
