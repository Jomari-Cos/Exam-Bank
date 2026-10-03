export type UserRole = 'admin' | 'faculty_author' | 'reviewer' | 'examiner';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'matching'
  | 'fill_in_blank'
  | 'coding_problem'
  | 'code_completion'
  | 'code_snippet'
  | 'debugging'
  | 'problem_solving'
  | 'algorithm_tracing'
  | 'pseudocode'
  | 'flowchart';

export type QuestionStatus =
  | 'Draft'
  | 'Submitted'
  | 'For Review'
  | 'Approved'
  | 'Published'
  | 'Archived';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type CognitiveLevel =
  | 'Remembering'
  | 'Understanding'
  | 'Applying'
  | 'Analyzing'
  | 'Evaluating'
  | 'Creating';

export type AssessmentType =
  | 'Quiz'
  | 'Prelim Exam'
  | 'Midterm Exam'
  | 'Final Exam'
  | 'Practical Laboratory';

export type CourseCategory =
  | 'Programming'
  | 'CE Fundamentals'
  | 'Computing Systems'
  | 'Advanced Specialized';

export interface CourseTopic {
  id: string;
  name: string;
  subtopics: string[];
}

export interface Course {
  code: string;
  title: string;
  category: CourseCategory;
  description: string;
  topics: CourseTopic[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  weight: number;
  isHidden?: boolean;
}

export interface MatchingPair {
  id: string;
  itemA: string;
  itemB: string;
}

export interface FlowchartNode {
  id: string;
  type: 'terminal' | 'process' | 'decision' | 'io';
  label: string;
  yesNext?: string;
  noNext?: string;
  next?: string;
}

export interface Question {
  id: string; // e.g., BSCPE-PROG-2026-001
  program: string; // "Bachelor of Science in Computer Engineering"
  courseCode: string; // "CPE 201"
  courseTitle: string; // "Object-Oriented Programming"
  topic: string;
  subtopic: string;
  questionType: QuestionType;
  questionText: string;
  
  // Type-specific contents
  choices?: string[]; // for multiple_choice
  correctAnswer?: string | number | boolean; // string or index or bool
  explanation: string;
  
  // Matching
  matchingPairs?: MatchingPair[];
  instructions?: string;
  
  // Fill in blanks
  alternativeAnswers?: string[];
  isCaseSensitive?: boolean;
  
  // Coding / Code Snippets / Debugging
  programmingLanguage?: 'C' | 'C++' | 'Python' | 'Java' | 'Verilog' | 'Assembly' | 'Pseudocode';
  codeSnippet?: string;
  inputSpecification?: string;
  outputSpecification?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  expectedSolution?: string;
  testCases?: TestCase[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
  
  // Debugging specifics
  buggyCode?: string;
  expectedBehavior?: string;
  debugHints?: string;
  
  // Flowchart specifics
  flowchartNodes?: FlowchartNode[];
  
  // Algorithm tracing specifics
  traceVariables?: string[];
  traceTableHeaders?: string[];
  expectedTraceSteps?: { step: number; values: Record<string, string> }[];
  
  // Metadata
  difficultyLevel: DifficultyLevel;
  cognitiveLevel: CognitiveLevel;
  learningOutcome: string; // e.g. "CLO 2: Implement polymorphic behavior in C++"
  assessmentType: AssessmentType;
  points: number;
  author: string;
  reviewer?: string;
  academicYear: string; // "2025-2026"
  semester: '1st Semester' | '2nd Semester' | 'Summer';
  status: QuestionStatus;
  dateCreated: string;
  dateModified: string;
  version: number;
  
  // Review notes
  reviewFeedback?: string;
  reviewRecommendations?: string;
}

export interface ReviewLog {
  id: string;
  questionId: string;
  reviewer: string;
  action: 'Approved' | 'Returned' | 'Rejected';
  comments: string;
  recommendations?: string;
  timestamp: string;
}

export interface TableOfSpecificationItem {
  topic: string;
  hoursSpent: number;
  weightPct: number;
  cognitiveCounts: {
    Remembering: number;
    Understanding: number;
    Applying: number;
    Analyzing: number;
    Evaluating: number;
    Creating: number;
  };
  totalItems: number;
  itemNumbers: number[];
}

export interface RandomizedQuestion extends Question {
  displayNumber: number;
  randomizedChoices?: string[];
  randomizedListB?: { id: string; text: string }[];
  scrambledAnswerKey?: string;
}

export interface ExamSet {
  setCode: 'A' | 'B' | 'C' | 'D';
  questions: RandomizedQuestion[];
  answerKey: { questionNumber: number; questionId: string; answer: string; points: number; type: QuestionType }[];
}

export interface Examination {
  id: string;
  title: string;
  program: string;
  courseCode: string;
  courseTitle: string;
  academicYear: string;
  semester: string;
  assessmentType: AssessmentType;
  examDate: string;
  timeDurationMinutes: number;
  instructions: string;
  totalPoints: number;
  totalItems: number;
  sets: ExamSet[];
  tosMatrix: TableOfSpecificationItem[];
  createdBy: string;
  createdAt: string;
  status: 'Draft' | 'Finalized' | 'Printed';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  entityType: 'Question' | 'Exam' | 'Course' | 'Setting' | 'User';
  entityId: string;
  details: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  title?: string;
  designation?: string;
  password?: string;
  avatar?: string;
  permissions?: string[];
}
