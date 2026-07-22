/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface AnatomyChapter {
  id: string;
  title: string;
  system: "skeletal" | "muscular" | "nervous" | "organs" | "vessels";
  estimatedReadingTime: number; // in minutes
  introduction: string;
  theory: string;
  clinicalImportance: string;
  vivaQuestions: VivaQuestion[];
  mcqs: MCQ[];
  references: string[];
}

export interface XrayPositioningItem {
  id: string;
  region: "chest" | "abdomen" | "skull" | "spine" | "upper-limb" | "lower-limb";
  projection: string; // e.g. "PA View", "Lateral View", "AP Erect"
  indications: string[];
  positioningSteps: string[];
  technicalFactors: {
    kvp: string;
    mas: string;
    sid: string; // Source Image Distance e.g. "180 cm"
    grid: boolean;
  };
  commonErrors: string[];
  notes: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: "normal" | "fracture" | "chest" | "pediatric" | "other";
  history: string;
  findings: string;
  impression: string;
  explanation: string;
  differentialDiagnosis: string[];
  learningPoints: string[];
  normalImageUrl: string;
  abnormalImageUrl: string; // for side by side comparison
  isCaseOfTheDay?: boolean;
}

export interface XrayReportTemplate {
  id: string;
  title: string;
  patientHistory: string;
  findings: string;
  impression: string;
  simplifiedExplanation: string;
  anatomyKeywords: string[];
  commonMistakes: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: "technology" | "AI" | "research" | "career";
  date: string;
  summary: string;
  content: string;
  author: string;
}

export interface JobItem {
  id: string;
  title: string;
  type: "internship" | "job" | "higher-studies" | "government";
  organization: string;
  location: string;
  eligibility: string;
  description: string;
  applyLink: string;
}

export interface UserStats {
  dailyStudyTime: number; // in minutes
  weeklyStudyTime: number[]; // 7 numbers for Mon-Sun
  totalHoursStudied: number;
  studyStreak: number;
  appOpeningStreak: number;
  xpPoints: number;
  level: number;
  completedChapters: string[]; // list of chapter ids
  savedNotes: string[]; // bookmarked items or topics
  quizScores: { [quizTopic: string]: number }; // score percentages
}

export interface StudyGoal {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
}

export interface PlannerEvent {
  id: string;
  title: string;
  date: string;
  type: "exam" | "viva" | "practical" | "assignment";
}

export interface DiscussionThread {
  id: string;
  title: string;
  author: string;
  role: "Student" | "Senior" | "Professor" | "Admin";
  content: string;
  date: string;
  upvotes: number;
  comments: Array<{
    author: string;
    role: string;
    content: string;
    date: string;
  }>;
}
