import {
  Course,
  Question,
  SystemUser,
  AuditLog,
  ReviewLog,
  Examination
} from '../types';

export const INITIAL_COURSES: Course[] = [
  // Programming Category
  {
    code: 'CPE 101',
    title: 'Programming Fundamentals',
    category: 'Programming',
    description: 'Introduction to algorithmic thinking, syntax, control flow, functions, arrays, and standard I/O in C/C++.',
    topics: [
      { id: 'cpe101-t1', name: 'Variables & Data Types', subtopics: ['Primitive types', 'Type casting', 'Format specifiers'] },
      { id: 'cpe101-t2', name: 'Control Structures', subtopics: ['Conditional branching', 'Loops (for, while, do-while)', 'Switch cases'] },
      { id: 'cpe101-t3', name: 'Functions & Recursion', subtopics: ['Pass by value/reference', 'Recursive baselines', 'Scope & lifetime'] },
      { id: 'cpe101-t4', name: 'Arrays & Pointers', subtopics: ['Pointer arithmetic', 'Array indexing', 'String manipulation'] },
    ]
  },
  {
    code: 'CPE 201',
    title: 'Object-Oriented Programming',
    category: 'Programming',
    description: 'Core OOP concepts including classes, objects, inheritance, polymorphism, encapsulation, abstraction, and memory management in C++ and Java.',
    topics: [
      { id: 'cpe201-t1', name: 'Encapsulation & Classes', subtopics: ['Constructors/Destructors', 'Access specifiers', 'This pointer'] },
      { id: 'cpe201-t2', name: 'Inheritance & Composition', subtopics: ['Single/Multiple inheritance', 'Diamond problem', 'Virtual base classes'] },
      { id: 'cpe201-t3', name: 'Polymorphism', subtopics: ['Virtual functions', 'Vtable & Vptr', 'Function & Operator overloading'] },
      { id: 'cpe201-t4', name: 'Templates & STL', subtopics: ['Template functions/classes', 'Vectors & maps', 'Exception handling'] },
    ]
  },
  {
    code: 'CPE 202',
    title: 'Data Structures and Algorithms',
    category: 'Programming',
    description: 'Linear and non-linear data structures, algorithm analysis, asymptotic notations, sorting, searching, trees, and graphs.',
    topics: [
      { id: 'cpe202-t1', name: 'Asymptotic Analysis', subtopics: ['Big-O, Big-Omega, Theta', 'Space & Time complexity', 'Recurrence relations'] },
      { id: 'cpe202-t2', name: 'Linked Lists, Stacks & Queues', subtopics: ['Singly/Doubly linked lists', 'Circular queues', 'Infix to postfix'] },
      { id: 'cpe202-t3', name: 'Trees & Heaps', subtopics: ['Binary Search Trees', 'AVL tree rotations', 'Min/Max Heaps'] },
      { id: 'cpe202-t4', name: 'Graph Algorithms', subtopics: ['BFS & DFS', 'Dijkstra shortest path', 'Prim/Kruskal MST'] },
    ]
  },

  // CE Fundamentals Category
  {
    code: 'CPE 211',
    title: 'Digital Logic Design',
    category: 'CE Fundamentals',
    description: 'Boolean algebra, logic gates, combinational circuit optimization, Karnaugh maps, sequential circuits, flip-flops, and finite state machines.',
    topics: [
      { id: 'cpe211-t1', name: 'Boolean Algebra & Logic Gates', subtopics: ['De Morgan laws', 'Canonical SOP & POS', 'Universal gates (NAND/NOR)'] },
      { id: 'cpe211-t2', name: 'Combinational Logic', subtopics: ['Karnaugh Maps (2 to 5 vars)', 'Multiplexers/Demux', 'Adders & Decoders'] },
      { id: 'cpe211-t3', name: 'Sequential Logic', subtopics: ['SR, D, JK, T Flip-Flops', 'Edge triggering', 'Registers & Counters'] },
      { id: 'cpe211-t4', name: 'Finite State Machines', subtopics: ['Mealy vs Moore machines', 'State transition tables', 'State minimization'] },
    ]
  },
  {
    code: 'CPE 311',
    title: 'Computer Organization and Architecture',
    category: 'CE Fundamentals',
    description: 'CPU instruction set architectures (MIPS/RISC-V), pipelining, hazards, memory hierarchy, cache mapping, and I/O organization.',
    topics: [
      { id: 'cpe311-t1', name: 'Instruction Set Architecture', subtopics: ['MIPS R/I/J formats', 'Addressing modes', 'Assembly programming'] },
      { id: 'cpe311-t2', name: 'Processor Datapath & Control', subtopics: ['Single-cycle datapath', 'ALU design', 'Control unit signals'] },
      { id: 'cpe311-t3', name: 'Pipelining & Hazards', subtopics: ['5-stage pipeline', 'Data hazards & Forwarding', 'Branch prediction'] },
      { id: 'cpe311-t4', name: 'Memory Hierarchy', subtopics: ['Direct vs Set-associative cache', 'Cache hit/miss latency', 'Virtual memory TLB'] },
    ]
  },
  {
    code: 'CPE 312',
    title: 'Microprocessors and Microcontrollers',
    category: 'CE Fundamentals',
    description: 'Microcontroller architecture (ARM Cortex, AVR, PIC), memory mapping, GPIO, interrupts, timers, ADC, and hardware interfacing.',
    topics: [
      { id: 'cpe312-t1', name: 'Architecture & Registers', subtopics: ['Core registers', 'Flash & SRAM layout', 'Bootloader process'] },
      { id: 'cpe312-t2', name: 'Interrupts & Timers', subtopics: ['Vector interrupt table', 'Prescaler calculation', 'PWM wave generation'] },
      { id: 'cpe312-t3', name: 'Serial Communication', subtopics: ['UART baud rate', 'SPI master-slave', 'I2C addressing & ACKs'] },
      { id: 'cpe312-t4', name: 'Peripheral Interfacing', subtopics: ['ADC sampling', 'DAC output', 'External sensor read'] },
    ]
  },
  {
    code: 'CPE 411',
    title: 'Embedded Systems',
    category: 'CE Fundamentals',
    description: 'Real-time operating systems (RTOS), embedded C programming, task scheduling, semaphores, power optimization, and system safety.',
    topics: [
      { id: 'cpe411-t1', name: 'RTOS Concepts', subtopics: ['Task scheduling', 'Rate Monotonic vs EDF', 'Priority inversion & inheritance'] },
      { id: 'cpe411-t2', name: 'Inter-Task Communication', subtopics: ['Binary/Counting semaphores', 'Message queues', 'Mutex & Deadlock avoidance'] },
      { id: 'cpe411-t3', name: 'Low Power & Safety', subtopics: ['Sleep modes & clock gating', 'Watchdog timer', 'Fail-safe architectures'] },
    ]
  },

  // Computing Systems Category
  {
    code: 'CPE 321',
    title: 'Operating Systems',
    category: 'Computing Systems',
    description: 'Process management, concurrency, CPU scheduling, deadlock characterization, memory virtualization, and file systems.',
    topics: [
      { id: 'cpe321-t1', name: 'Processes & Threads', subtopics: ['PCB structure', 'Context switching overhead', 'POSIX pthreads'] },
      { id: 'cpe321-t2', name: 'CPU Scheduling', subtopics: ['Round Robin', 'SJF / SRTF', 'Multi-level feedback queue'] },
      { id: 'cpe321-t3', name: 'Synchronization & Deadlocks', subtopics: ['Peterson algorithm', 'Coffman conditions', 'Banker algorithm'] },
      { id: 'cpe321-t4', name: 'Memory Management', subtopics: ['Paging & Page tables', 'Page fault replacement (LRU, FIFO)', 'Thrashing'] },
    ]
  },
  {
    code: 'CPE 322',
    title: 'Computer Networks',
    category: 'Computing Systems',
    description: 'OSI and TCP/IP stack, physical transmission, data link protocols, IP addressing/subnetting, routing, transport layer, and network security.',
    topics: [
      { id: 'cpe322-t1', name: 'Network Models & Physical Layer', subtopics: ['OSI 7 Layers', 'Bandwidth & Nyquist-Shannon', 'Transmission media'] },
      { id: 'cpe322-t2', name: 'Data Link & MAC', subtopics: ['CSMA/CD & CSMA/CA', 'Ethernet framing', 'Error detection (CRC)'] },
      { id: 'cpe322-t3', name: 'Network Layer & Subnetting', subtopics: ['IPv4 CIDR subnetting', 'IPv6 headers', 'Routing protocols (OSPF, BGP)'] },
      { id: 'cpe322-t4', name: 'Transport & Application', subtopics: ['TCP 3-way handshake', 'UDP vs TCP', 'DNS, HTTP/HTTPS'] },
    ]
  },
  {
    code: 'CPE 221',
    title: 'Database Systems',
    category: 'Computing Systems',
    description: 'Relational data modeling, SQL query language, normalization (1NF-BCNF), transaction ACID properties, indexing, and NoSQL fundamentals.',
    topics: [
      { id: 'cpe221-t1', name: 'Relational Model & SQL', subtopics: ['DDL, DML, DQL', 'Joins & Subqueries', 'Aggregate functions'] },
      { id: 'cpe221-t2', name: 'Database Normalization', subtopics: ['Functional dependencies', '1NF, 2NF, 3NF', 'BCNF decomposition'] },
      { id: 'cpe221-t3', name: 'Transactions & Concurrency', subtopics: ['ACID properties', 'Two-phase locking', 'Isolation levels'] },
    ]
  },

  // Advanced / Specialized Category
  {
    code: 'CPE 421',
    title: 'Internet of Things',
    category: 'Advanced Specialized',
    description: 'IoT architecture, MQTT/CoAP protocols, wireless sensor networks, edge compute gateways, cloud telemetry, and IoT cybersecurity.',
    topics: [
      { id: 'cpe421-t1', name: 'IoT Protocols', subtopics: ['MQTT publish/subscribe & QoS', 'CoAP RESTful model', 'LoRaWAN & Zigbee'] },
      { id: 'cpe421-t2', name: 'Edge Devices & Cloud', subtopics: ['ESP32 WiFi/BLE integration', 'Edge ML inference', 'Cloud ingest telemetry'] },
    ]
  },
  {
    code: 'CPE 323',
    title: 'HDL / Verilog / FPGA',
    category: 'Advanced Specialized',
    description: 'Hardware description languages, synthesizable Verilog HDL, behavioral & structural modeling, FPGA configuration, testbenches, and timing closure.',
    topics: [
      { id: 'cpe323-t1', name: 'Verilog Syntax & Data Types', subtopics: ['wire vs reg', 'always @ blocks', 'Blocking vs Non-blocking (= vs <=)'] },
      { id: 'cpe323-t2', name: 'Synthesizable Hardware', subtopics: ['Combinational multiplexers', 'Synchronous D-registers', 'Clock dividers'] },
      { id: 'cpe323-t3', name: 'FPGA Architecture & Testbenches', subtopics: ['LUTs & Slice architecture', 'Initial blocks & stimulus generation', 'Timing verification'] },
    ]
  },
  {
    code: 'CPE 422',
    title: 'Computer Security',
    category: 'Advanced Specialized',
    description: 'Cryptography, symmetric and asymmetric ciphers, buffer overflows, secure coding practices, hardware root-of-trust, and network defense.',
    topics: [
      { id: 'cpe422-t1', name: 'Applied Cryptography', subtopics: ['AES & RSA', 'SHA-256 Hashing', 'Digital certificates & PKI'] },
      { id: 'cpe422-t2', name: 'System Vulnerabilities', subtopics: ['Stack buffer overflows', 'Return-oriented programming (ROP)', 'Side-channel attacks'] },
    ]
  }
];

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'user-author-1',
    name: 'Engr. Maria Santos, MSc CPE',
    email: 'maria.santos@univ.edu.ph',
    password: 'password123',
    role: 'faculty_author',
    title: 'Assistant Professor & Course Lead',
    designation: 'Faculty Author',
    department: 'Computer Engineering Department',
    avatar: 'MS',
    permissions: [
      'Create and author 12 BSCpE question types',
      'Submit questions for peer and committee review',
      'Manage personal question bank drafts',
      'Test code snippets and test case runners'
    ]
  },
  {
    id: 'user-reviewer-1',
    name: 'Dr. Roberto Cruz, PhD CpE',
    email: 'roberto.cruz@univ.edu.ph',
    password: 'password123',
    role: 'reviewer',
    title: 'Associate Professor & Curriculum Reviewer',
    designation: 'Reviewer / Validator',
    department: 'Academic Curriculum Committee',
    avatar: 'RC',
    permissions: [
      'Evaluate questions in validation queue',
      'Approve, reject, or request revisions with rubrics',
      'Validate Bloom cognitive taxonomy & CLO mapping',
      'Audit test case coverage & answer keys'
    ]
  },
  {
    id: 'user-examiner-1',
    name: 'Engr. Juvy Reyes, MEng CpE',
    email: 'juvy.reyes@univ.edu.ph',
    password: 'password123',
    role: 'examiner',
    title: 'Senior Lecturer & Examination Officer',
    designation: 'Faculty Examiner',
    department: 'Examination & Assessment Unit',
    avatar: 'JR',
    permissions: [
      'Generate multi-set exams with automated scrambling',
      'Generate Table of Specifications (TOS) matrix',
      'Custom print layout (separated exam + answer keys)',
      'Export high-definition PDF and OMR bubble sheets'
    ]
  },
  {
    id: 'user-admin',
    name: 'Engr. Carlos Mendoza, PECE, MEng',
    email: 'carlos.mendoza@univ.edu.ph',
    password: 'password123',
    role: 'admin',
    title: 'CpE Department Chairperson & Chief Admin',
    designation: 'System Administrator',
    department: 'Computer Engineering Department',
    avatar: 'CM',
    permissions: [
      'Full administrative access across all modules',
      'Curriculum course catalog & syllabus management',
      'Security audit trail monitoring & user management',
      'Institutional accreditation & OBE compliance oversight'
    ]
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // 1. Multiple Choice: Digital Logic Design
  {
    id: 'BSCPE-DLD-2026-001',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 211',
    courseTitle: 'Digital Logic Design',
    topic: 'Combinational Logic',
    subtopic: 'Karnaugh Maps (2 to 5 vars)',
    questionType: 'multiple_choice',
    questionText: 'When simplifying a 4-variable Karnaugh map (variables A, B, C, D), how many adjacent minterm 1s must be grouped together to eliminate exactly two variables from the resulting product term?',
    choices: [
      '2 adjacent minterms',
      '4 adjacent minterms',
      '8 adjacent minterms',
      '16 adjacent minterms'
    ],
    correctAnswer: 1, // index 1 = 4 adjacent minterms
    explanation: 'In Karnaugh map minimization, a group of 2^k adjacent cells eliminates k variables. Grouping 4 adjacent minterms (2^2) eliminates 2 variables, producing a 2-literal product term in a 4-variable map.',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Understanding',
    learningOutcome: 'CLO 2: Apply graphical minimization techniques (K-maps) to reduce combinational Boolean expressions.',
    assessmentType: 'Midterm Exam',
    points: 1,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-10',
    dateModified: '2026-09-12',
    version: 1
  },

  // 2. True or False: Computer Organization & Architecture
  {
    id: 'BSCPE-COA-2026-002',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 311',
    courseTitle: 'Computer Organization and Architecture',
    topic: 'Pipelining & Hazards',
    subtopic: 'Data Hazards & Forwarding',
    questionType: 'true_false',
    questionText: 'In a standard 5-stage classic RISC pipeline (IF, ID, EX, MEM, WB), hardware forwarding (bypassing) alone can completely eliminate all stalls caused by a Load-Use data hazard.',
    correctAnswer: false,
    explanation: 'False. When an instruction immediately follows a Load instruction and consumes the loaded register value in EX stage, the data is only available at the end of the MEM stage. Even with forwarding from MEM/WB to EX, a 1-cycle pipeline bubble (stall) is unavoidably required.',
    difficultyLevel: 'Hard',
    cognitiveLevel: 'Analyzing',
    learningOutcome: 'CLO 3: Analyze pipeline stalls, data dependencies, and hazard resolution techniques in RISC architectures.',
    assessmentType: 'Midterm Exam',
    points: 1,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-11',
    dateModified: '2026-09-14',
    version: 1
  },

  // 3. Matching Type: Microcontrollers & Embedded Peripherals
  {
    id: 'BSCPE-MIC-2026-003',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 312',
    courseTitle: 'Microprocessors and Microcontrollers',
    topic: 'Serial Communication',
    subtopic: 'Communication Protocols',
    questionType: 'matching',
    questionText: 'Match each microcontroller communication bus protocol with its corresponding architectural characteristic.',
    instructions: 'Select the matching protocol characteristic from List B for each protocol item in List A.',
    matchingPairs: [
      { id: 'm1', itemA: 'UART', itemB: 'Asynchronous full-duplex protocol with start/stop bits and configurable baud rate; uses TX/RX lines' },
      { id: 'm2', itemA: 'SPI', itemB: 'Synchronous full-duplex 4-wire protocol (MOSI, MISO, SCK, CS/SS) supporting high-speed master-multi-slave' },
      { id: 'm3', itemA: 'I2C', itemB: 'Synchronous half-duplex 2-wire open-drain bus (SDA, SCL) with pull-up resistors and 7-bit/10-bit device addresses' },
      { id: 'm4', itemA: 'CAN Bus', itemB: 'Differential two-wire (CAN_H, CAN_L) multi-master vehicle bus with non-destructive bitwise arbitration' }
    ],
    explanation: 'UART is asynchronous 2-wire without clock; SPI uses 4 wires with explicit chip select; I2C is 2-wire open-drain synchronous; CAN bus is differential noise-immune automotive bus.',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Understanding',
    learningOutcome: 'CLO 4: Compare synchronous and asynchronous embedded communication protocols for peripheral sensor integration.',
    assessmentType: 'Final Exam',
    points: 4,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '2nd Semester',
    status: 'Approved',
    dateCreated: '2026-09-12',
    dateModified: '2026-09-15',
    version: 1
  },

  // 4. Fill in the Blanks: Operating Systems
  {
    id: 'BSCPE-OS-2026-004',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 321',
    courseTitle: 'Operating Systems',
    topic: 'Synchronization & Deadlocks',
    subtopic: 'Coffman Conditions',
    questionType: 'fill_in_blank',
    questionText: 'According to Coffman et al., the four necessary and sufficient conditions for a deadlock to occur are Mutual Exclusion, Hold and Wait, No Preemption, and ________.',
    correctAnswer: 'Circular Wait',
    alternativeAnswers: ['Circular-Wait', 'circular wait', 'circular waiting', 'Circular Waiting'],
    isCaseSensitive: false,
    explanation: 'The four Coffman conditions for deadlock are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait. Eliminating any one of these conditions prevents deadlocks.',
    difficultyLevel: 'Easy',
    cognitiveLevel: 'Remembering',
    learningOutcome: 'CLO 2: Identify the fundamental conditions that induce deadlock in multiprogrammed operating systems.',
    assessmentType: 'Prelim Exam',
    points: 2,
    author: 'Engr. Carlos Mendoza, PECE, MEng',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-14',
    dateModified: '2026-09-16',
    version: 1
  },

  // 5. Code Snippet / Output Prediction: C++ Object-Oriented Polymorphism
  {
    id: 'BSCPE-OOP-2026-005',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 201',
    courseTitle: 'Object-Oriented Programming',
    topic: 'Polymorphism',
    subtopic: 'Virtual Functions & Vtable',
    questionType: 'code_snippet',
    programmingLanguage: 'C++',
    questionText: 'Analyze the following C++ code snippet involving class inheritance and virtual methods. What will be the exact standard output printed to the console?',
    codeSnippet: `#include <iostream>
using namespace std;

class Sensor {
public:
    virtual void sample() { cout << "Base"; }
    void calibrate() { cout << "1"; }
};

class TempSensor : public Sensor {
public:
    void sample() override { cout << "Temp"; }
    void calibrate() { cout << "2"; }
};

int main() {
    Sensor* s = new TempSensor();
    s->sample();
    s->calibrate();
    delete s;
    return 0;
}`,
    correctAnswer: 'Temp1',
    explanation: 's->sample() is called via a pointer to Base, but sample() is declared virtual, so dynamic dispatch occurs at runtime via the vtable, invoking TempSensor::sample() which prints "Temp". Conversely, calibrate() is NON-virtual, so static binding resolves it at compile-time to Sensor::calibrate(), printing "1". Result: "Temp1".',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Applying',
    learningOutcome: 'CLO 3: Differentiate between runtime dynamic dispatch (vtable) and compile-time static binding in C++ object hierarchies.',
    assessmentType: 'Midterm Exam',
    points: 3,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-15',
    dateModified: '2026-09-18',
    version: 1
  },

  // 6. Coding Problem: Programming Fundamentals (C++) - Bitwise Parity Checker
  {
    id: 'BSCPE-PROG-2026-006',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 101',
    courseTitle: 'Programming Fundamentals',
    topic: 'Variables & Data Types',
    subtopic: 'Bitwise Operations',
    questionType: 'coding_problem',
    programmingLanguage: 'C++',
    questionText: 'Write a C++ program that reads an unsigned 32-bit integer and computes its bitwise population count (number of set bits `1`). If the count of set bits is even, output "EVEN_PARITY <count>". If odd, output "ODD_PARITY <count>".',
    inputSpecification: 'A single non-negative unsigned integer N (0 <= N <= 2^31 - 1) on standard input.',
    outputSpecification: 'A single line containing the parity label and the count separated by a space.',
    constraints: '0 <= N <= 2147483647; Time Limit: 1000ms; Memory Limit: 128MB.',
    sampleInput: '13',
    sampleOutput: 'ODD_PARITY 3',
    expectedSolution: `#include <iostream>
using namespace std;

int main() {
    unsigned int n;
    if (!(cin >> n)) return 0;
    int count = 0;
    unsigned int temp = n;
    while (temp > 0) {
        temp &= (temp - 1); // Brian Kernighan bit trick
        count++;
    }
    if (count % 2 == 0) {
        cout << "EVEN_PARITY " << count << endl;
    } else {
        cout << "ODD_PARITY " << count << endl;
    }
    return 0;
}`,
    testCases: [
      { id: 'tc1', input: '13', expectedOutput: 'ODD_PARITY 3', weight: 2, isHidden: false },
      { id: 'tc2', input: '0', expectedOutput: 'EVEN_PARITY 0', weight: 2, isHidden: false },
      { id: 'tc3', input: '15', expectedOutput: 'EVEN_PARITY 4', weight: 2, isHidden: true },
      { id: 'tc4', input: '255', expectedOutput: 'EVEN_PARITY 8', weight: 2, isHidden: true },
      { id: 'tc5', input: '1023', expectedOutput: 'EVEN_PARITY 10', weight: 2, isHidden: true }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128,
    explanation: 'Binary 13 is 1101_2, containing three 1s. Since 3 is odd, output is "ODD_PARITY 3". Can be efficiently calculated using Brian Kernighan bit trick n &= (n - 1) or bit shifts.',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Creating',
    learningOutcome: 'CLO 1: Implement low-level bitwise manipulation algorithms for hardware register validation.',
    assessmentType: 'Practical Laboratory',
    points: 10,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-16',
    dateModified: '2026-09-19',
    version: 1
  },

  // 7. Code Completion: Data Structures - Circular Queue Enqueue
  {
    id: 'BSCPE-DSA-2026-007',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 202',
    courseTitle: 'Data Structures and Algorithms',
    topic: 'Linked Lists, Stacks & Queues',
    subtopic: 'Circular Queues',
    questionType: 'code_completion',
    programmingLanguage: 'C++',
    questionText: 'Complete the missing modulo boundary arithmetic expression in the circular queue `enqueue` method below to ensure wrap-around behavior.',
    codeSnippet: `bool CircularQueue::enqueue(int value) {
    if (isFull()) {
        return false;
    }
    if (front == -1) {
        front = 0;
    }
    // TODO: Update rear with proper modulo wrap-around
    rear = /* ___BLANK_EXPRESSION___ */;
    data[rear] = value;
    size++;
    return true;
}`,
    correctAnswer: '(rear + 1) % capacity',
    alternativeAnswers: ['(rear + 1) % CAPACITY', '(rear + 1) % MAX_SIZE', '(rear+1)%capacity'],
    explanation: 'In a circular buffer array of fixed length `capacity`, moving the rear pointer forward with wrap-around is achieved via `(rear + 1) % capacity`.',
    difficultyLevel: 'Easy',
    cognitiveLevel: 'Applying',
    learningOutcome: 'CLO 2: Implement boundary conditions and pointer wrap-around logic in linear array-backed data structures.',
    assessmentType: 'Quiz',
    points: 2,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-17',
    dateModified: '2026-09-20',
    version: 1
  },

  // 8. Debugging: C++ Dynamic Pointer Memory Leak & Dangling Pointer
  {
    id: 'BSCPE-PROG-2026-008',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 201',
    courseTitle: 'Object-Oriented Programming',
    topic: 'Encapsulation & Classes',
    subtopic: 'Destructors & Deep Copy',
    questionType: 'debugging',
    programmingLanguage: 'C++',
    questionText: 'The following dynamic integer buffer class crashes with a double-free segmentation fault when an instance is passed by value to a function. Identify the missing component required by the C++ Rule of Three.',
    buggyCode: `class Buffer {
private:
    int* ptr;
    int size;
public:
    Buffer(int s) : size(s) {
        ptr = new int[s];
    }
    ~Buffer() {
        delete[] ptr;
    }
    // BUG: Missing User-defined Copy Constructor!
};

void processBuffer(Buffer b) {
    // b is destroyed here
}

int main() {
    Buffer buf(100);
    processBuffer(buf); // Segmentation fault on exit
    return 0;
}`,
    expectedBehavior: 'Buffer must perform a deep copy when copied, allocating a dedicated new int array rather than copying the raw pointer address.',
    debugHints: 'Look at the default copy constructor generated by the compiler. It performs a shallow copy of ptr.',
    correctAnswer: `Buffer(const Buffer& other) : size(other.size) {
    ptr = new int[size];
    for (int i = 0; i < size; i++) ptr[i] = other.ptr[i];
}`,
    explanation: 'By default, the compiler provides a memberwise shallow copy constructor. When buf is passed by value into processBuffer(Buffer b), b.ptr points to the same memory as buf.ptr. When processBuffer exits, b is destroyed and deletes the memory. Later, when buf goes out of scope in main(), its destructor tries to delete the already-freed pointer, causing a double-free crash. A custom copy constructor performing deep allocation resolves the bug.',
    difficultyLevel: 'Hard',
    cognitiveLevel: 'Analyzing',
    learningOutcome: 'CLO 4: Debug memory corruption, dangling pointers, and double-free exceptions in C++ manual memory management.',
    assessmentType: 'Midterm Exam',
    points: 5,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-18',
    dateModified: '2026-09-21',
    version: 1
  },

  // 9. Problem Solving: Computer Networks Subnetting (CIDR Calculation)
  {
    id: 'BSCPE-NET-2026-009',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 322',
    courseTitle: 'Computer Networks',
    topic: 'Network Layer & Subnetting',
    subtopic: 'IPv4 CIDR Subnetting',
    questionType: 'problem_solving',
    questionText: 'A university computer engineering lab is assigned the network block 192.168.10.0/24. The department needs to create 4 subnets of equal size for Embedded Systems Lab, Robotics Lab, Networks Lab, and Faculty Workstations. Determine: 1) The new subnet mask in dotted-decimal format, 2) The number of usable host addresses per subnet, and 3) The broadcast address of the third subnet (Subnet #2, 0-indexed).',
    correctAnswer: '1) 255.255.255.192 (/26); 2) 62 usable hosts; 3) 192.168.10.191',
    explanation: '1) To create 4 subnets: 2^2 = 4, so borrow 2 bits from the host portion: /24 + 2 = /26. /26 corresponds to mask 255.255.255.192. 2) Host bits remaining = 32 - 26 = 6 bits. Usable hosts = 2^6 - 2 = 64 - 2 = 62 hosts. 3) Subnet block size = 256 - 192 = 64. Subnet 0: 192.168.10.0 - .63. Subnet 1: 192.168.10.64 - .127. Subnet 2: 192.168.10.128 - .191. Hence, the broadcast address for the 3rd subnet is 192.168.10.191.',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Applying',
    learningOutcome: 'CLO 2: Calculate variable-length subnet masks, network IDs, host capacities, and broadcast boundaries.',
    assessmentType: 'Midterm Exam',
    points: 5,
    author: 'Engr. Carlos Mendoza, PECE, MEng',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-19',
    dateModified: '2026-09-22',
    version: 1
  },

  // 10. Algorithm Tracing: Sorting & Pointer Partitioning (Quicksort Lomuto)
  {
    id: 'BSCPE-DSA-2026-010',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 202',
    courseTitle: 'Data Structures and Algorithms',
    topic: 'Graph Algorithms',
    subtopic: 'Quicksort Lomuto Partition',
    questionType: 'algorithm_tracing',
    programmingLanguage: 'C++',
    questionText: 'Trace the state of the array `arr = [10, 80, 30, 90, 40, 50, 70]` during the execution of Lomuto partition where the pivot is the last element (70). What is the exact array arrangement immediately after the final pivot swap?',
    traceVariables: ['i', 'j', 'pivot', 'arr'],
    traceTableHeaders: ['Step', 'j', 'arr[j] <= pivot?', 'i', 'Array State'],
    expectedSolution: '[10, 30, 40, 50, 70, 90, 80]',
    correctAnswer: '[10, 30, 40, 50, 70, 90, 80]',
    explanation: 'Pivot = 70. Initially i = -1. Step 1: j=0, arr[0]=10 <= 70 -> i=0, swap(arr[0],arr[0]) -> [10,80,30,90,40,50,70]. Step 2: j=1, arr[1]=80 > 70. Step 3: j=2, arr[2]=30 <= 70 -> i=1, swap(arr[1],arr[2]) -> [10,30,80,90,40,50,70]. Step 4: j=3, arr[3]=90 > 70. Step 5: j=4, arr[4]=40 <= 70 -> i=2, swap(arr[2],arr[4]) -> [10,30,40,90,80,50,70]. Step 6: j=5, arr[5]=50 <= 70 -> i=3, swap(arr[3],arr[5]) -> [10,30,40,50,80,90,70]. End of loop: swap pivot arr[6]=70 with arr[i+1]=arr[4]=80 -> [10, 30, 40, 50, 70, 90, 80]. Pivot index returned is 4.',
    difficultyLevel: 'Hard',
    cognitiveLevel: 'Analyzing',
    learningOutcome: 'CLO 3: Trace step-by-step memory pointer states and partition invariants in divide-and-conquer algorithms.',
    assessmentType: 'Final Exam',
    points: 4,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-20',
    dateModified: '2026-09-23',
    version: 1
  },

  // 11. Pseudocode Analysis: Embedded Watchdog Timer Logic
  {
    id: 'BSCPE-EMB-2026-011',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 411',
    courseTitle: 'Embedded Systems',
    topic: 'Low Power & Safety',
    subtopic: 'Watchdog Timer',
    questionType: 'pseudocode',
    programmingLanguage: 'Pseudocode',
    questionText: 'Analyze the safety-critical watchdog service task pseudocode below. Under what operational scenario will the system enter an unhandled hardware reset loop?',
    codeSnippet: `FUNCTION Task_SensorMonitor():
    INIT watchdog_timeout = 500 ms
    START_WATCHDOG(watchdog_timeout)
    
    WHILE TRUE:
        TRY:
            sensor_data = READ_I2C_BUS(ADDR_0x68)
            IF VALIDATE_CHECKSUM(sensor_data) == FALSE:
                LOG_ERROR("Corrupt sensor telemetry")
                SLEEP_MS(600) // Fault recovery wait
                CONTINUE
            
            PROCESS_TELEMETRY(sensor_data)
            KICK_WATCHDOG() // Reset watchdog timer counter
            SLEEP_MS(100)
        CATCH BusException:
            RESET_I2C_CONTROLLER()
    END WHILE
END FUNCTION`,
    correctAnswer: 'When a checksum error occurs, SLEEP_MS(600) exceeds the 500ms watchdog timeout without calling KICK_WATCHDOG(), triggering a hardware MCU reset.',
    explanation: 'The watchdog timer timeout is set to 500ms. In the checksum failure branch, the code sleeps for 600ms before continuing, without refreshing the watchdog counter (`KICK_WATCHDOG()`). Because 600ms > 500ms, the hardware watchdog will expire during the sleep, firing a micro-controller reset interrupt.',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Evaluating',
    learningOutcome: 'CLO 3: Evaluate real-time system failure modes and timing hazards in watchdog-guarded embedded firmware.',
    assessmentType: 'Final Exam',
    points: 3,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '2nd Semester',
    status: 'Approved',
    dateCreated: '2026-09-21',
    dateModified: '2026-09-24',
    version: 1
  },

  // 12. Flowchart-based Question: Microcontroller Analog-to-Digital Converter Sampling
  {
    id: 'BSCPE-MIC-2026-012',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 312',
    courseTitle: 'Microprocessors and Microcontrollers',
    topic: 'Peripheral Interfacing',
    subtopic: 'ADC Sampling',
    questionType: 'flowchart',
    questionText: 'Observe the ADC interrupt conversion flowchart below. If the ADC Conversion Complete (ADIF) flag is polled rather than handled via ISR, what is the consequence of failing to clear the flag after reading ADCL and ADCH?',
    flowchartNodes: [
      { id: 'n1', type: 'terminal', label: 'Start ADC Conversion (ADSC = 1)', next: 'n2' },
      { id: 'n2', type: 'process', label: 'Sample-and-Hold charges internal capacitor', next: 'n3' },
      { id: 'n3', type: 'decision', label: 'ADIF == 1? (Conversion Complete)', yesNext: 'n4', noNext: 'n3' },
      { id: 'n4', type: 'process', label: 'Read ADCL (Low Byte) then ADCH (High Byte)', next: 'n5' },
      { id: 'n5', type: 'decision', label: 'Is ADIF cleared by software?', yesNext: 'n6', noNext: 'n7' },
      { id: 'n6', type: 'terminal', label: 'Trigger Next Sample on Schedule', next: undefined },
      { id: 'n7', type: 'terminal', label: 'Hazard: Next poll falsely detects instantaneous completion', next: undefined }
    ],
    correctAnswer: 'The next polling loop will immediately assume the subsequent conversion is already done without waiting for the ADC hardware, reading stale data.',
    explanation: 'In AVR and similar microcontrollers, when using polling mode, the ADIF flag is NOT automatically cleared by hardware on reading the data registers. If software fails to clear it (by writing a logical 1 to ADIF), the loop will immediately evaluate ADIF == 1 as true on the next sample cycle, leading to stale data capture.',
    difficultyLevel: 'Hard',
    cognitiveLevel: 'Analyzing',
    learningOutcome: 'CLO 4: Analyze hardware flag clearing invariants in memory-mapped peripheral control registers.',
    assessmentType: 'Midterm Exam',
    points: 4,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Approved',
    dateCreated: '2026-09-22',
    dateModified: '2026-09-25',
    version: 1
  },

  // 13. Verilog HDL Hardware Synthesis Question
  {
    id: 'BSCPE-HDL-2026-013',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 323',
    courseTitle: 'HDL / Verilog / FPGA',
    topic: 'Synthesizable Hardware',
    subtopic: 'Blocking vs Non-blocking (= vs <=)',
    questionType: 'multiple_choice',
    programmingLanguage: 'Verilog',
    questionText: 'In synthesizable Verilog, why MUST non-blocking assignments (`<=`) always be used when describing edge-triggered sequential logic inside an `always @(posedge clk)` block?',
    choices: [
      'To prevent race conditions between concurrently executing sequential blocks during simulation',
      'To force the synthesis tool to use combinational lookup tables instead of flip-flops',
      'Because blocking assignments cannot assign values to variables declared as reg',
      'To ensure that operations complete in zero physical nanoseconds during FPGA execution'
    ],
    correctAnswer: 0,
    explanation: 'Non-blocking assignments (`<=`) evaluate their right-hand sides concurrently and schedule updates at the end of the simulation time step. This models physical D flip-flop registers correctly and prevents simulation race conditions when multiple always blocks exchange clock-synchronized data.',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Understanding',
    learningOutcome: 'CLO 2: Apply proper IEEE-1364 Verilog coding standards to synthesize race-free synchronous digital circuits.',
    assessmentType: 'Final Exam',
    points: 1,
    author: 'Engr. Maria Santos, MSc CPE',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '2nd Semester',
    status: 'Approved',
    dateCreated: '2026-09-23',
    dateModified: '2026-09-26',
    version: 1
  },

  // 14. IoT MQTT QoS Level Multiple Choice
  {
    id: 'BSCPE-IOT-2026-014',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 421',
    courseTitle: 'Internet of Things',
    topic: 'IoT Protocols',
    subtopic: 'MQTT publish/subscribe & QoS',
    questionType: 'multiple_choice',
    questionText: 'An industrial IoT telemetry node monitors boiler pressure. If a message cannot be lost under any network disconnection scenario and duplicate delivery would cause erroneous actuator triggering, which MQTT Quality of Service (QoS) tier should be selected?',
    choices: [
      'QoS 0 (At most once / Fire and forget)',
      'QoS 1 (At least once / Acknowledged delivery with possible duplicate)',
      'QoS 2 (Exactly once / Four-step handshake PUBREC, PUBREL, PUBCOMP)',
      'QoS 3 (Ultra-reliable real-time streaming)'
    ],
    correctAnswer: 2,
    explanation: 'MQTT QoS 2 guarantees "Exactly Once" delivery through a rigorous two-tier four-packet handshake (PUBLISH -> PUBREC -> PUBREL -> PUBCOMP), ensuring no message loss and strictly zero duplicate execution.',
    difficultyLevel: 'Medium',
    cognitiveLevel: 'Applying',
    learningOutcome: 'CLO 1: Select appropriate transport and application layer IoT protocols matching reliability and latency constraints.',
    assessmentType: 'Final Exam',
    points: 1,
    author: 'Engr. Carlos Mendoza, PECE, MEng',
    reviewer: 'Dr. Roberto Cruz, PhD CpE',
    academicYear: '2025-2026',
    semester: '2nd Semester',
    status: 'Approved',
    dateCreated: '2026-09-24',
    dateModified: '2026-09-27',
    version: 1
  },

  // 15. Draft Question (For Review Queue Demonstration)
  {
    id: 'BSCPE-DLD-2026-015',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 211',
    courseTitle: 'Digital Logic Design',
    topic: 'Sequential Logic',
    subtopic: 'SR, D, JK, T Flip-Flops',
    questionType: 'multiple_choice',
    questionText: 'Which input condition causes an invalid or unpredictable state in an active-HIGH NOR-based SR Latch?',
    choices: [
      'S = 0, R = 0 (No change)',
      'S = 0, R = 1 (Reset)',
      'S = 1, R = 0 (Set)',
      'S = 1, R = 1 (Forbidden / Metasable state)'
    ],
    correctAnswer: 3,
    explanation: 'For a NOR-gate latch, when both S=1 and R=1, both outputs Q and Q_bar are forced to 0 simultaneously, violating the complementary property. If inputs transition back to 0 simultaneously, race condition results.',
    difficultyLevel: 'Easy',
    cognitiveLevel: 'Remembering',
    learningOutcome: 'CLO 3: Explain the excitation tables and forbidden operating regions of bistable multivibrators.',
    assessmentType: 'Quiz',
    points: 1,
    author: 'Engr. Maria Santos, MSc CPE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'For Review', // Needs Reviewer attention!
    dateCreated: '2026-09-28',
    dateModified: '2026-09-28',
    version: 1
  },

  // 16. Submitted Question (For Review Queue Demonstration)
  {
    id: 'BSCPE-COA-2026-016',
    program: 'Bachelor of Science in Computer Engineering',
    courseCode: 'CPE 311',
    courseTitle: 'Computer Organization and Architecture',
    topic: 'Memory Hierarchy',
    subtopic: 'Direct vs Set-associative Cache',
    questionType: 'fill_in_blank',
    questionText: 'A processor has a 32-bit byte-addressed memory space and a 64 KB direct-mapped cache with 64-byte cache lines. The number of bits allocated to the Cache Tag field is ________ bits.',
    correctAnswer: '16',
    alternativeAnswers: ['16 bits', '16-bit', '16bits'],
    isCaseSensitive: false,
    explanation: 'Line size = 64 bytes = 2^6 bytes -> Offset = 6 bits. Number of lines = Cache size / Line size = 64 KB / 64 B = 1024 lines = 2^10 lines -> Index = 10 bits. Total address bits = 32. Tag bits = 32 - Index - Offset = 32 - 10 - 6 = 16 bits.',
    difficultyLevel: 'Hard',
    cognitiveLevel: 'Applying',
    learningOutcome: 'CLO 4: Compute cache memory address fields (Tag, Set/Index, Byte Offset) for various mapping architectures.',
    assessmentType: 'Midterm Exam',
    points: 3,
    author: 'Engr. Maria Santos, MSc CPE',
    academicYear: '2025-2026',
    semester: '1st Semester',
    status: 'Submitted', // Needs Reviewer attention!
    dateCreated: '2026-09-28',
    dateModified: '2026-09-28',
    version: 1
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-28 09:15:32',
    user: 'Engr. Carlos Mendoza, PECE, MEng',
    role: 'admin',
    action: 'System Initialized',
    entityType: 'Setting',
    entityId: 'SYSTEM-ROOT',
    details: 'Configured BSCpE Curriculum catalog with 13 courses and OBE Bloom Taxonomy rubrics.'
  },
  {
    id: 'log-002',
    timestamp: '2026-09-28 10:20:11',
    user: 'Engr. Maria Santos, MSc CPE',
    role: 'faculty_author',
    action: 'Question Created',
    entityType: 'Question',
    entityId: 'BSCPE-PROG-2026-006',
    details: 'Created coding problem "Bitwise Parity Checker" with 5 weighted unit test cases.'
  },
  {
    id: 'log-003',
    timestamp: '2026-09-28 14:45:00',
    user: 'Dr. Roberto Cruz, PhD CpE',
    role: 'reviewer',
    action: 'Question Approved',
    entityType: 'Question',
    entityId: 'BSCPE-DLD-2026-001',
    details: 'Verified K-map minimization question; checked alignment with CLO 2 and Bloom level.'
  }
];
