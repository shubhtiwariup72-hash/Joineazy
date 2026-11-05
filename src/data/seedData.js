import { getDateOffset } from '../utils/dateUtils';

export const SEED_USERS = [
  {
    id: 'admin1',
    name: 'Prof. Sarah Jenkins',
    email: 'admin1@joineazy.com',
    role: 'admin',
    department: 'Computer Science & AI',
    title: 'Lead Instructor & Systems Architect',
    avatar: 'SJ',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'admin2',
    name: 'Prof. David Miller',
    email: 'admin2@joineazy.com',
    role: 'admin',
    department: 'Software Engineering',
    title: 'Associate Professor of Distributed Systems',
    avatar: 'DM',
    color: 'from-indigo-600 to-violet-700',
  },
  {
    id: 'student1',
    name: 'Alex Johnson',
    email: 'student1@joineazy.com',
    role: 'student',
    studentIdNum: 'CS-2024-001',
    avatar: 'AJ',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'student2',
    name: 'Bella Chen',
    email: 'student2@joineazy.com',
    role: 'student',
    studentIdNum: 'CS-2024-002',
    avatar: 'BC',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'student3',
    name: 'Carlos Rodriguez',
    email: 'student3@joineazy.com',
    role: 'student',
    studentIdNum: 'CS-2024-003',
    avatar: 'CR',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'student4',
    name: 'Divya Patel',
    email: 'student4@joineazy.com',
    role: 'student',
    studentIdNum: 'CS-2024-004',
    avatar: 'DP',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'student5',
    name: 'Ethan Wright',
    email: 'student5@joineazy.com',
    role: 'student',
    studentIdNum: 'CS-2024-005',
    avatar: 'EW',
    color: 'from-cyan-500 to-blue-600',
  },
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-101',
    title: 'Cloud Native Microservices Architecture Case Study',
    description:
      'Design a resilient microservices infrastructure for an e-commerce platform handling 50k RPS. Submit an architectural diagram (C4 Model) and an executive summary covering circuit breakers, distributed tracing, and data consistency.',
    dueDate: getDateOffset(4, 23, 59),
    submissionUrl: 'https://drive.google.com/drive/folders/joineazy-cloud-case-study',
    createdBy: 'admin1',
    assignedStudentIds: ['student1', 'student2', 'student3', 'student4', 'student5'],
    createdAt: getDateOffset(-5, 10, 0),
    submissions: {
      student1: {
        status: 'SUBMITTED',
        submittedAt: getDateOffset(-2, 14, 30),
      },
      student2: {
        status: 'SUBMITTED',
        submittedAt: getDateOffset(-1, 19, 15),
      },
      student3: {
        status: 'PENDING',
        submittedAt: null,
      },
      student4: {
        status: 'PENDING',
        submittedAt: null,
      },
      student5: {
        status: 'PENDING',
        submittedAt: null,
      },
    },
  },
  {
    id: 'asg-102',
    title: 'Interactive Frontend Dashboard with Tailwind CSS & React',
    description:
      'Implement an accessible SaaS assignment management dashboard conforming to WCAG 2.1 AA standards. Ensure clean state management, responsive layouts across mobile/desktop, and robust data persistence in localStorage.',
    dueDate: getDateOffset(-2, 18, 0),
    submissionUrl: 'https://drive.google.com/drive/folders/joineazy-frontend-dashboard',
    createdBy: 'admin1',
    assignedStudentIds: ['student1', 'student2', 'student3'],
    createdAt: getDateOffset(-7, 9, 0),
    submissions: {
      student1: {
        status: 'SUBMITTED',
        submittedAt: getDateOffset(-3, 11, 20),
      },
      student2: {
        status: 'PENDING',
        submittedAt: null,
      },
      student3: {
        status: 'PENDING',
        submittedAt: null,
      },
    },
  },
  {
    id: 'asg-103',
    title: 'Distributed SQL Indexing & Query Latency Optimization',
    description:
      'Analyze query execution plans on a 10M record Postgres cluster. Submit benchmark scripts, EXPLAIN ANALYZE comparison logs, and an analysis of composite vs partial indexes.',
    dueDate: getDateOffset(7, 23, 59),
    submissionUrl: 'https://drive.google.com/drive/folders/joineazy-db-indexing-benchmarks',
    createdBy: 'admin1',
    assignedStudentIds: ['student4', 'student5'],
    createdAt: getDateOffset(-3, 11, 30),
    submissions: {
      student4: {
        status: 'PENDING',
        submittedAt: null,
      },
      student5: {
        status: 'SUBMITTED',
        submittedAt: getDateOffset(-1, 16, 45),
      },
    },
  },
  {
    id: 'asg-201',
    title: 'Compiler Construction: Lexical Analysis & Abstract Syntax Tree',
    description:
      'Build a recursive descent parser for an arithmetic and control-flow grammar. Ensure thorough unit test coverage for tokenizer error handling and semantic AST generation.',
    dueDate: getDateOffset(3, 20, 0),
    submissionUrl: 'https://drive.google.com/drive/folders/joineazy-compiler-ast-parser',
    createdBy: 'admin2',
    assignedStudentIds: ['student1', 'student3', 'student5'],
    createdAt: getDateOffset(-4, 15, 0),
    submissions: {
      student1: {
        status: 'PENDING',
        submittedAt: null,
      },
      student3: {
        status: 'SUBMITTED',
        submittedAt: getDateOffset(-1, 10, 0),
      },
      student5: {
        status: 'PENDING',
        submittedAt: null,
      },
    },
  },
];
