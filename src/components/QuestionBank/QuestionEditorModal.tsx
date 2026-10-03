import React, { useState } from 'react';
import {
  Question,
  QuestionType,
  Course,
  DifficultyLevel,
  CognitiveLevel,
  AssessmentType,
  TestCase,
  MatchingPair,
  FlowchartNode,
} from '../../types';
import { X, Plus, Trash2, Code, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { CodeEditorViewer } from '../Common/CodeEditorViewer';

interface QuestionEditorModalProps {
  initialQuestion?: Question | null;
  courses: Course[];
  authorName: string;
  onClose: () => void;
  onSave: (question: Question, submitForReview: boolean) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  initialQuestion,
  courses,
  authorName,
  onClose,
  onSave,
}) => {
  const isEditing = !!initialQuestion;

  // Selected course & topics
  const defaultCourse = courses[0];
  const [courseCode, setCourseCode] = useState(
    initialQuestion?.courseCode || defaultCourse?.code || 'CPE 101'
  );

  const currentCourse = courses.find((c) => c.code === courseCode) || defaultCourse;

  const [topic, setTopic] = useState(
    initialQuestion?.topic || currentCourse?.topics[0]?.name || 'General'
  );
  const [subtopic, setSubtopic] = useState(
    initialQuestion?.subtopic || currentCourse?.topics[0]?.subtopics[0] || 'Core Concepts'
  );

  // Core metadata
  const [questionType, setQuestionType] = useState<QuestionType>(
    initialQuestion?.questionType || 'multiple_choice'
  );
  const [questionText, setQuestionText] = useState(
    initialQuestion?.questionText || ''
  );
  const [explanation, setExplanation] = useState(
    initialQuestion?.explanation || ''
  );
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(
    initialQuestion?.difficultyLevel || 'Medium'
  );
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>(
    initialQuestion?.cognitiveLevel || 'Understanding'
  );
  const [learningOutcome, setLearningOutcome] = useState(
    initialQuestion?.learningOutcome || 'CLO 1: Demonstrate mastery of computer engineering core principles.'
  );
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(
    initialQuestion?.assessmentType || 'Midterm Exam'
  );
  const [points, setPoints] = useState<number>(initialQuestion?.points || 1);
  const [academicYear, setAcademicYear] = useState(
    initialQuestion?.academicYear || '2025-2026'
  );
  const [semester, setSemester] = useState<'1st Semester' | '2nd Semester' | 'Summer'>(
    initialQuestion?.semester || '1st Semester'
  );

  // Type-specific state

  // 1. Multiple Choice
  const [choices, setChoices] = useState<string[]>(
    initialQuestion?.choices || [
      'First option choice A',
      'Second option choice B',
      'Third option choice C',
      'Fourth option choice D',
    ]
  );
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>(
    typeof initialQuestion?.correctAnswer === 'number'
      ? initialQuestion.correctAnswer
      : 0
  );

  // 2. True / False
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean>(
    typeof initialQuestion?.correctAnswer === 'boolean'
      ? initialQuestion.correctAnswer
      : true
  );

  // 3. Matching Type
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>(
    initialQuestion?.matchingPairs || [
      { id: '1', itemA: 'Premise 1', itemB: 'Matching definition 1' },
      { id: '2', itemA: 'Premise 2', itemB: 'Matching definition 2' },
      { id: '3', itemA: 'Premise 3', itemB: 'Matching definition 3' },
    ]
  );

  // 4. Fill in the Blank
  const [blankAnswer, setBlankAnswer] = useState<string>(
    typeof initialQuestion?.correctAnswer === 'string'
      ? initialQuestion.correctAnswer
      : ''
  );
  const [alternativeAnswersStr, setAlternativeAnswersStr] = useState<string>(
    initialQuestion?.alternativeAnswers?.join(', ') || ''
  );
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(
    initialQuestion?.isCaseSensitive || false
  );

  // 5. Code & Programming
  const [programmingLanguage, setProgrammingLanguage] = useState<'C' | 'C++' | 'Python' | 'Java' | 'Verilog' | 'Assembly' | 'Pseudocode'>(
    initialQuestion?.programmingLanguage || 'C++'
  );
  const [codeSnippet, setCodeSnippet] = useState<string>(
    initialQuestion?.codeSnippet || ''
  );
  const [inputSpec, setInputSpec] = useState<string>(
    initialQuestion?.inputSpecification || ''
  );
  const [outputSpec, setOutputSpec] = useState<string>(
    initialQuestion?.outputSpecification || ''
  );
  const [constraints, setConstraints] = useState<string>(
    initialQuestion?.constraints || ''
  );
  const [sampleInput, setSampleInput] = useState<string>(
    initialQuestion?.sampleInput || ''
  );
  const [sampleOutput, setSampleOutput] = useState<string>(
    initialQuestion?.sampleOutput || ''
  );
  const [expectedSolution, setExpectedSolution] = useState<string>(
    initialQuestion?.expectedSolution || ''
  );
  const [testCases, setTestCases] = useState<TestCase[]>(
    initialQuestion?.testCases || [
      { id: 'tc1', input: '10', expectedOutput: '20', weight: 2, isHidden: false },
      { id: 'tc2', input: '0', expectedOutput: '0', weight: 2, isHidden: false },
      { id: 'tc3', input: '100', expectedOutput: '200', weight: 3, isHidden: true },
    ]
  );
  const [timeLimitMs, setTimeLimitMs] = useState<number>(
    initialQuestion?.timeLimitMs || 1000
  );
  const [memoryLimitMb, setMemoryLimitMb] = useState<number>(
    initialQuestion?.memoryLimitMb || 128
  );

  // 6. Debugging
  const [buggyCode, setBuggyCode] = useState<string>(
    initialQuestion?.buggyCode || ''
  );
  const [expectedBehavior, setExpectedBehavior] = useState<string>(
    initialQuestion?.expectedBehavior || ''
  );
  const [debugHints, setDebugHints] = useState<string>(
    initialQuestion?.debugHints || ''
  );

  // 7. Flowchart Nodes
  const [flowchartNodes, setFlowchartNodes] = useState<FlowchartNode[]>(
    initialQuestion?.flowchartNodes || [
      { id: 'n1', type: 'terminal', label: 'Start Operation', next: 'n2' },
      { id: 'n2', type: 'process', label: 'Initialize registers and sensors', next: 'n3' },
      { id: 'n3', type: 'decision', label: 'Threshold Exceeded?', yesNext: 'n4', noNext: 'n2' },
      { id: 'n4', type: 'terminal', label: 'Raise Hardware Alarm', next: undefined },
    ]
  );

  // Error validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When course changes, update topic list
  const handleCourseChange = (newCode: string) => {
    setCourseCode(newCode);
    const c = courses.find((course) => course.code === newCode);
    if (c && c.topics.length > 0) {
      setTopic(c.topics[0].name);
      setSubtopic(c.topics[0].subtopics[0] || 'Fundamentals');
    }
  };

  // Submit handler
  const handleSubmit = (submitForReview: boolean) => {
    if (!questionText.trim()) {
      setErrorMsg('Please enter the question text/statement.');
      return;
    }
    if (!explanation.trim()) {
      setErrorMsg('Please provide an explanation / pedagogical rationale.');
      return;
    }

    // Determine correct answer based on type
    let finalCorrectAnswer: string | number | boolean = '';
    if (questionType === 'multiple_choice') {
      finalCorrectAnswer = correctChoiceIndex;
    } else if (questionType === 'true_false') {
      finalCorrectAnswer = trueFalseAnswer;
    } else if (questionType === 'fill_in_blank') {
      if (!blankAnswer.trim()) {
        setErrorMsg('Please provide the expected blank answer.');
        return;
      }
      finalCorrectAnswer = blankAnswer.trim();
    } else if (questionType === 'code_snippet' || questionType === 'code_completion') {
      finalCorrectAnswer = blankAnswer || 'See solution';
    } else if (questionType === 'debugging') {
      finalCorrectAnswer = expectedSolution || 'See fix';
    } else if (questionType === 'coding_problem') {
      finalCorrectAnswer = 'Unit test cases verification';
    } else {
      finalCorrectAnswer = blankAnswer || 'Expected outcome';
    }

    const questionId =
      initialQuestion?.id ||
      `BSCPE-${courseCode.replace(/\s+/g, '')}-${new Date().getFullYear()}-${Math.floor(
        100 + Math.random() * 900
      )}`;

    const newQuestion: Question = {
      id: questionId,
      program: 'Bachelor of Science in Computer Engineering',
      courseCode,
      courseTitle: currentCourse.title,
      topic,
      subtopic,
      questionType,
      questionText,
      explanation,
      difficultyLevel,
      cognitiveLevel,
      learningOutcome,
      assessmentType,
      points,
      author: initialQuestion?.author || authorName,
      academicYear,
      semester,
      status: submitForReview ? 'Submitted' : initialQuestion?.status || 'Draft',
      dateCreated: initialQuestion?.dateCreated || new Date().toISOString().slice(0, 10),
      dateModified: new Date().toISOString().slice(0, 10),
      version: initialQuestion ? initialQuestion.version + 1 : 1,

      // Type specifics
      choices: questionType === 'multiple_choice' ? choices : undefined,
      correctAnswer: finalCorrectAnswer,
      matchingPairs: questionType === 'matching' ? matchingPairs : undefined,
      alternativeAnswers:
        questionType === 'fill_in_blank' && alternativeAnswersStr
          ? alternativeAnswersStr.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
      isCaseSensitive: questionType === 'fill_in_blank' ? isCaseSensitive : undefined,

      programmingLanguage: [
        'coding_problem',
        'code_snippet',
        'code_completion',
        'debugging',
        'algorithm_tracing',
        'pseudocode',
      ].includes(questionType)
        ? programmingLanguage
        : undefined,
      codeSnippet: ['code_snippet', 'code_completion', 'algorithm_tracing', 'pseudocode'].includes(
        questionType
      )
        ? codeSnippet
        : undefined,
      inputSpecification: questionType === 'coding_problem' ? inputSpec : undefined,
      outputSpecification: questionType === 'coding_problem' ? outputSpec : undefined,
      constraints: questionType === 'coding_problem' ? constraints : undefined,
      sampleInput: questionType === 'coding_problem' ? sampleInput : undefined,
      sampleOutput: questionType === 'coding_problem' ? sampleOutput : undefined,
      expectedSolution: ['coding_problem', 'debugging', 'code_completion'].includes(questionType)
        ? expectedSolution
        : undefined,
      testCases: questionType === 'coding_problem' ? testCases : undefined,
      timeLimitMs: questionType === 'coding_problem' ? timeLimitMs : undefined,
      memoryLimitMb: questionType === 'coding_problem' ? memoryLimitMb : undefined,

      buggyCode: questionType === 'debugging' ? buggyCode : undefined,
      expectedBehavior: questionType === 'debugging' ? expectedBehavior : undefined,
      debugHints: questionType === 'debugging' ? debugHints : undefined,

      flowchartNodes: questionType === 'flowchart' ? flowchartNodes : undefined,
    };

    onSave(newQuestion, submitForReview);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? `Edit Question: ${initialQuestion?.id}` : 'Create Examination Question'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter question text, pedagogical metadata, test cases, and correct resolution.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-800">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Course & Curriculum Classification */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              1. Course & Topic Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  BSCpE Course
                </label>
                <select
                  id="question-course-select"
                  name="courseCode"
                  value={courseCode}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-900"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Topic
                </label>
                <input
                  id="question-topic-input"
                  name="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Combinational Logic"
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Subtopic
                </label>
                <input
                  id="question-subtopic-input"
                  name="subtopic"
                  type="text"
                  value={subtopic}
                  onChange={(e) => setSubtopic(e.target.value)}
                  placeholder="e.g. Karnaugh Maps"
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Question Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Question Format Type (12 Supported Types)
            </label>
            <select
              id="question-type-select"
              name="questionType"
              value={questionType}
              onChange={(e) => {
                setQuestionType(e.target.value as QuestionType);
                if (e.target.value === 'coding_problem') {
                  setPoints(10);
                } else if (e.target.value === 'matching') {
                  setPoints(4);
                } else if (e.target.value === 'multiple_choice' || e.target.value === 'true_false') {
                  setPoints(1);
                }
              }}
              className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 font-semibold focus:ring-1 focus:ring-slate-900"
            >
              <option value="multiple_choice">Multiple Choice (4+ Choices, Randomizable)</option>
              <option value="true_false">True or False</option>
              <option value="matching">Matching Type (List A & List B)</option>
              <option value="fill_in_blank">Fill in the Blanks (Alternative Acceptances)</option>
              <option value="coding_problem">Coding Problem (Language, Test Cases Suite, Constraints)</option>
              <option value="code_completion">Code Completion (Template with Blank Slots)</option>
              <option value="code_snippet">Code Snippet / Output Prediction</option>
              <option value="debugging">Debugging (Buggy Code, Expected Behavior, Fix)</option>
              <option value="problem_solving">Problem Solving (Calculations & Rubric)</option>
              <option value="algorithm_tracing">Algorithm Tracing (Trace Table & State)</option>
              <option value="pseudocode">Pseudocode (Algorithmic Logic Analysis)</option>
              <option value="flowchart">Flowchart-based Question (Interactive Nodes Diagram)</option>
            </select>
          </div>

          {/* Section 3: Question Text */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Question Statement / Problem Description
            </label>
            <textarea
              id="question-text-input"
              name="questionText"
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="State the examination question clearly and without ambiguity..."
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 text-sm focus:ring-1 focus:ring-slate-900 leading-relaxed"
            />
          </div>

          {/* Section 4: Format-Specific Answer & Details Fields */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              4. Answer Specifications ({questionType.replace('_', ' ')})
            </h3>

            {/* 4.1 Multiple Choice */}
            {questionType === 'multiple_choice' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">
                    Provide 4 or more choices and designate the correct answer:
                  </span>
                  <button
                    type="button"
                    onClick={() => setChoices([...choices, `New Choice ${String.fromCharCode(65 + choices.length)}`])}
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Choice
                  </button>
                </div>

                <div className="space-y-2">
                  {choices.map((choice, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-choice"
                        checked={correctChoiceIndex === idx}
                        onChange={() => setCorrectChoiceIndex(idx)}
                        className="text-slate-900 focus:ring-slate-900 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="w-6 font-mono font-bold text-slate-500 text-center">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) => {
                          const updated = [...choices];
                          updated[idx] = e.target.value;
                          setChoices(updated);
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-slate-900"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      />
                      {choices.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = choices.filter((_, i) => i !== idx);
                            setChoices(updated);
                            if (correctChoiceIndex >= updated.length) {
                              setCorrectChoiceIndex(0);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4.2 True / False */}
            {questionType === 'true_false' && (
              <div className="flex items-center gap-6 py-2">
                <span className="text-slate-700 font-medium">Designate correct statement:</span>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-900">
                  <input
                    type="radio"
                    name="tf-answer"
                    checked={trueFalseAnswer === true}
                    onChange={() => setTrueFalseAnswer(true)}
                    className="text-slate-900 focus:ring-slate-900"
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-900">
                  <input
                    type="radio"
                    name="tf-answer"
                    checked={trueFalseAnswer === false}
                    onChange={() => setTrueFalseAnswer(false)}
                    className="text-slate-900 focus:ring-slate-900"
                  />
                  <span>False</span>
                </label>
              </div>
            )}

            {/* 4.3 Matching Type */}
            {questionType === 'matching' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Define matching pairs:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setMatchingPairs([
                        ...matchingPairs,
                        { id: String(Date.now()), itemA: `Premise ${matchingPairs.length + 1}`, itemB: `Definition ${matchingPairs.length + 1}` },
                      ])
                    }
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Pair
                  </button>
                </div>

                <div className="space-y-2">
                  {matchingPairs.map((pair, idx) => (
                    <div key={pair.id || idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-slate-400 font-mono font-semibold">{idx + 1}.</span>
                        <input
                          type="text"
                          value={pair.itemA}
                          onChange={(e) => {
                            const updated = [...matchingPairs];
                            updated[idx].itemA = e.target.value;
                            setMatchingPairs(updated);
                          }}
                          placeholder="List A Item"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded py-1 px-2 text-slate-900"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={pair.itemB}
                          onChange={(e) => {
                            const updated = [...matchingPairs];
                            updated[idx].itemB = e.target.value;
                            setMatchingPairs(updated);
                          }}
                          placeholder="List B Matching Target"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded py-1 px-2 text-slate-900"
                        />
                        {matchingPairs.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setMatchingPairs(matchingPairs.filter((_, i) => i !== idx))}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4.4 Fill in the Blank */}
            {questionType === 'fill_in_blank' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Primary Expected Answer
                    </label>
                    <input
                      type="text"
                      value={blankAnswer}
                      onChange={(e) => setBlankAnswer(e.target.value)}
                      placeholder="e.g. O(log n)"
                      className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3 font-mono text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Alternative Accepted Answers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={alternativeAnswersStr}
                      onChange={(e) => setAlternativeAnswersStr(e.target.value)}
                      placeholder="e.g. O(logn), logarithmic, O(log N)"
                      className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3 font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="case-sensitive"
                    checked={isCaseSensitive}
                    onChange={(e) => setIsCaseSensitive(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <label htmlFor="case-sensitive" className="cursor-pointer select-none text-slate-700">
                    Enforce Case-Sensitive Evaluation
                  </label>
                </div>
              </div>
            )}

            {/* 4.5 Coding Problem */}
            {questionType === 'coding_problem' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Programming Language
                    </label>
                    <select
                      value={programmingLanguage}
                      onChange={(e) => setProgrammingLanguage(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 font-semibold text-slate-900"
                    >
                      <option value="C++">C++ (ISO Standard)</option>
                      <option value="C">C (C99/C11)</option>
                      <option value="Python">Python 3</option>
                      <option value="Java">Java SE</option>
                      <option value="Verilog">Verilog HDL</option>
                      <option value="Assembly">Assembly (MIPS/x86)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Time Limit (ms)
                    </label>
                    <input
                      type="number"
                      value={timeLimitMs}
                      onChange={(e) => setTimeLimitMs(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Memory Limit (MB)
                    </label>
                    <input
                      type="number"
                      value={memoryLimitMb}
                      onChange={(e) => setMemoryLimitMb(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Input Specification
                    </label>
                    <textarea
                      rows={2}
                      value={inputSpec}
                      onChange={(e) => setInputSpec(e.target.value)}
                      placeholder="e.g. Single integer N (0 <= N <= 1000)"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Output Specification
                    </label>
                    <textarea
                      rows={2}
                      value={outputSpec}
                      onChange={(e) => setOutputSpec(e.target.value)}
                      placeholder="e.g. Print result followed by a newline"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                {/* Sample I/O */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Sample Input
                    </label>
                    <textarea
                      rows={2}
                      value={sampleInput}
                      onChange={(e) => setSampleInput(e.target.value)}
                      placeholder="13"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Sample Output
                    </label>
                    <textarea
                      rows={2}
                      value={sampleOutput}
                      onChange={(e) => setSampleOutput(e.target.value)}
                      placeholder="ODD_PARITY 3"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                {/* Expected Solution Code */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Expected Author Solution Code
                  </label>
                  <textarea
                    rows={6}
                    value={expectedSolution}
                    onChange={(e) => setExpectedSolution(e.target.value)}
                    placeholder="#include <iostream>..."
                    className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none"
                    spellCheck={false}
                  />
                </div>

                {/* Test Cases Table Builder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      Unit Test Cases Suite ({testCases.length} Cases)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTestCases([
                          ...testCases,
                          {
                            id: `tc${Date.now()}`,
                            input: '0',
                            expectedOutput: '0',
                            weight: 2,
                            isHidden: false,
                          },
                        ])
                      }
                      className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Test Case
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="p-2 w-12">#</th>
                          <th className="p-2">Input</th>
                          <th className="p-2">Expected Output</th>
                          <th className="p-2 w-20">Weight</th>
                          <th className="p-2 w-24">Hidden</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {testCases.map((tc, idx) => (
                          <tr key={tc.id || idx}>
                            <td className="p-2 text-slate-500 font-semibold">{idx + 1}</td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={tc.input}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].input = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={tc.expectedOutput}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].expectedOutput = e.target.value;
                                  setTestCases(updated);
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-emerald-800 font-semibold"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={tc.weight}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].weight = Number(e.target.value);
                                  setTestCases(updated);
                                }}
                                className="w-16 bg-slate-50 border border-slate-200 rounded p-1 font-sans"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="checkbox"
                                checked={tc.isHidden || false}
                                onChange={(e) => {
                                  const updated = [...testCases];
                                  updated[idx].isHidden = e.target.checked;
                                  setTestCases(updated);
                                }}
                                className="rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                              />
                            </td>
                            <td className="p-2 text-right">
                              {testCases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setTestCases(testCases.filter((_, i) => i !== idx))}
                                  className="text-slate-400 hover:text-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4.6 Code Snippets / Output Prediction & Completion */}
            {(questionType === 'code_snippet' || questionType === 'code_completion') && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-slate-600 font-medium">Programming Language:</label>
                  <select
                    value={programmingLanguage}
                    onChange={(e) => setProgrammingLanguage(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded px-2 py-1 font-semibold"
                  >
                    <option value="C++">C++</option>
                    <option value="C">C</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="Verilog">Verilog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Code Snippet
                  </label>
                  <textarea
                    rows={5}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="int x = 10; printf('%d', x % 3);"
                    className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800"
                    spellCheck={false}
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Expected Output / Missing Code Value
                  </label>
                  <input
                    type="text"
                    value={blankAnswer}
                    onChange={(e) => setBlankAnswer(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* 4.7 Debugging */}
            {questionType === 'debugging' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Buggy Source Code
                  </label>
                  <textarea
                    rows={5}
                    value={buggyCode}
                    onChange={(e) => setBuggyCode(e.target.value)}
                    placeholder="Source code containing logic or memory bug..."
                    className="w-full bg-slate-950 text-rose-300 font-mono text-xs p-3 rounded-lg border border-slate-800"
                    spellCheck={false}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Expected Correct Behavior
                    </label>
                    <input
                      type="text"
                      value={expectedBehavior}
                      onChange={(e) => setExpectedBehavior(e.target.value)}
                      placeholder="e.g. Free dynamically allocated nodes without memory leak"
                      className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Debug Hints (Optional)
                    </label>
                    <input
                      type="text"
                      value={debugHints}
                      onChange={(e) => setDebugHints(e.target.value)}
                      placeholder="e.g. Check Rule of Three destructor vs copy constructor"
                      className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Correct Fixed Code / Solution
                  </label>
                  <textarea
                    rows={4}
                    value={expectedSolution}
                    onChange={(e) => setExpectedSolution(e.target.value)}
                    placeholder="Fixed code snippet..."
                    className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* 4.8 Flowchart Builder */}
            {questionType === 'flowchart' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Flowchart Nodes Sequence:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFlowchartNodes([
                        ...flowchartNodes,
                        {
                          id: `n${Date.now()}`,
                          type: 'process',
                          label: 'Next Hardware Step',
                          next: undefined,
                        },
                      ])
                    }
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Node
                  </button>
                </div>

                <div className="space-y-2">
                  {flowchartNodes.map((node, idx) => (
                    <div key={node.id || idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                      <select
                        value={node.type}
                        onChange={(e) => {
                          const updated = [...flowchartNodes];
                          updated[idx].type = e.target.value as any;
                          setFlowchartNodes(updated);
                        }}
                        className="bg-slate-50 border border-slate-300 rounded py-1 px-2 font-medium"
                      >
                        <option value="terminal">Start / End (Oval)</option>
                        <option value="process">Process (Rectangle)</option>
                        <option value="decision">Decision (Diamond)</option>
                        <option value="io">I/O (Parallelogram)</option>
                      </select>
                      <input
                        type="text"
                        value={node.label}
                        onChange={(e) => {
                          const updated = [...flowchartNodes];
                          updated[idx].label = e.target.value;
                          setFlowchartNodes(updated);
                        }}
                        placeholder="Node Text"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded py-1 px-2"
                      />
                      {flowchartNodes.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setFlowchartNodes(flowchartNodes.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Correct Analysis / Outcome Answer
                  </label>
                  <input
                    type="text"
                    value={blankAnswer}
                    onChange={(e) => setBlankAnswer(e.target.value)}
                    placeholder="e.g. System enters interrupt loop due to uncleared flag"
                    className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3"
                  />
                </div>
              </div>
            )}

            {/* 4.9 Problem Solving / Algorithm Tracing / Pseudocode generic answers */}
            {['problem_solving', 'algorithm_tracing', 'pseudocode'].includes(questionType) && (
              <div className="space-y-3">
                {['algorithm_tracing', 'pseudocode'].includes(questionType) && (
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Algorithm / Pseudocode Text
                    </label>
                    <textarea
                      rows={5}
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="Algorithm or pseudocode..."
                      className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800"
                      spellCheck={false}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Expected Final Answer / State
                  </label>
                  <input
                    type="text"
                    value={blankAnswer}
                    onChange={(e) => setBlankAnswer(e.target.value)}
                    placeholder="Expected calculated value, state array, or answer..."
                    className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-3 font-mono font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Explanation & Pedagogical Rationale */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              5. Explanation / Pedagogical Rationale
            </label>
            <textarea
              id="question-explanation-input"
              name="explanation"
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why the answer is correct and cite the relevant architectural or theoretical principles..."
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 text-xs focus:ring-1 focus:ring-slate-900 leading-relaxed"
            />
          </div>

          {/* Section 6: Outcome-Based Education (OBE) & Bloom's Taxonomy Metadata */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              6. OBE & Examination Blueprint Parameters
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Difficulty Level
                </label>
                <select
                  id="question-difficulty-select"
                  name="difficultyLevel"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevel)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 font-medium"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Cognitive Level (Bloom's)
                </label>
                <select
                  id="question-cognitive-select"
                  name="cognitiveLevel"
                  value={cognitiveLevel}
                  onChange={(e) => setCognitiveLevel(e.target.value as CognitiveLevel)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 font-medium"
                >
                  <option value="Remembering">Remembering</option>
                  <option value="Understanding">Understanding</option>
                  <option value="Applying">Applying</option>
                  <option value="Analyzing">Analyzing</option>
                  <option value="Evaluating">Evaluating</option>
                  <option value="Creating">Creating</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Assessment Type
                </label>
                <select
                  id="question-assessment-type-select"
                  name="assessmentType"
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 font-medium"
                >
                  <option value="Quiz">Quiz</option>
                  <option value="Prelim Exam">Prelim Exam</option>
                  <option value="Midterm Exam">Midterm Exam</option>
                  <option value="Final Exam">Final Exam</option>
                  <option value="Practical Laboratory">Practical Laboratory</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Points Weight
                </label>
                <input
                  id="question-points-input"
                  name="points"
                  type="number"
                  min={1}
                  max={50}
                  value={points}
                  onChange={(e) => setPoints(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Course Learning Outcome (CLO)
                </label>
                <input
                  id="question-clo-input"
                  name="learningOutcome"
                  type="text"
                  value={learningOutcome}
                  onChange={(e) => setLearningOutcome(e.target.value)}
                  placeholder="e.g. CLO 2: Analyze combinational logic circuits..."
                  className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Academic Year
                  </label>
                  <input
                    id="question-academic-year-input"
                    name="academicYear"
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Semester
                  </label>
                  <select
                    id="question-semester-select"
                    name="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 font-medium"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            id="question-cancel-btn"
            name="cancelQuestion"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              id="question-save-draft-btn"
              name="saveDraft"
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              id="question-submit-review-btn"
              name="submitReview"
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Submit for Validation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
