/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Award, HelpCircle, ArrowRight, Check, X, Sparkles, Clock, 
  RotateCcw, ShieldCheck, Bookmark, Eye, BookOpen, Star, BarChart3, ChevronRight 
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizChapter {
  id: string;
  title: string;
  subject: "Anatomy" | "Physics" | "Positioning" | "Safety" | "Contrast Media" | "CT & MRI";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questions: Question[];
}

const builtInQuizzes: QuizChapter[] = [
  {
    id: "thoracic-cage",
    title: "Thoracic Cage & Sternal Landmarks",
    subject: "Anatomy",
    difficulty: "Beginner",
    questions: [
      {
        id: "tc-1",
        question: "Which anatomical landmark corresponds to the second rib costal cartilage anteriorly?",
        options: ["Sternal Angle of Louis", "Jugular Notch", "Xiphoid Process", "Clavicular Head"],
        correctIndex: 0,
        explanation: "The sternal angle (Angle of Louis) lies at the T4-T5 level and marks the articulation of the second rib costal cartilage, a key landmark for rib counting."
      },
      {
        id: "tc-2",
        question: "How many pairs of ribs are typically classified as 'true ribs' because they articulate directly with the sternum?",
        options: ["5 pairs", "7 pairs", "10 pairs", "12 pairs"],
        correctIndex: 1,
        explanation: "Ribs 1 through 7 are true (vertebrosternal) ribs that attach directly to the sternum via their own costal cartilages."
      },
      {
        id: "tc-3",
        question: "What is the primary indicator of patient rotation on an erect posteroanterior (PA) chest projection?",
        options: [
          "Asymmetry in distance between medial clavicle heads and spinous processes",
          "Elevation of the right hemidiaphragm border",
          "Overlapping of scapulae on the pulmonary fields",
          "Blunting of the lateral costophrenic recesses"
        ],
        correctIndex: 0,
        explanation: "Rotation is assessed by measuring the distance from the medial ends of the clavicles to the spine. Symmetry confirms a perfect non-rotated PA view."
      }
    ]
  },
  {
    id: "xray-safety",
    title: "ALARA & Radiation Protection Physics",
    subject: "Safety",
    difficulty: "Intermediate",
    questions: [
      {
        id: "safe-1",
        question: "The 'ALARA' principle in radiological protection stands for which of the following?",
        options: [
          "As Low As Reasonably Achievable",
          "As Large As Reasonably Acceptable",
          "Average Limit of Radiation Absorption",
          "Approved Lead Apron Required Always"
        ],
        correctIndex: 0,
        explanation: "ALARA stands for As Low As Reasonably Achievable, which guides all radiographers to minimize dose through time, distance, and shielding."
      },
      {
        id: "safe-2",
        question: "If a radiographer doubles their distance from an X-ray source, what happens to their radiation exposure according to the inverse square law?",
        options: [
          "It is reduced to half (1/2)",
          "It is reduced to one-third (1/3)",
          "It is reduced to one-quarter (1/4)",
          "It remains completely identical"
        ],
        correctIndex: 2,
        explanation: "The inverse square law states that radiation intensity is inversely proportional to the square of the distance. Doubling distance reduces exposure to (1/2)^2 = 1/4th."
      }
    ]
  },
  {
    id: "contrast-agents",
    title: "GI Fluoroscopy & Contrast Selection",
    subject: "Contrast Media",
    difficulty: "Advanced",
    questions: [
      {
        id: "cnt-1",
        question: "Which of the following is a classic clinical counter-indication for using Barium Sulfate contrast?",
        options: ["Suspected bowel perforation", "Mild hypertension", "Lactose intolerance", "Patient aged under 18"],
        correctIndex: 0,
        explanation: "If a patient has a suspected gastrointestinal tract perforation, Barium Sulfate is strictly contraindicated due to the risk of triggering severe barium peritonitis in the peritoneal cavity."
      },
      {
        id: "cnt-2",
        question: "What is the primary rescue medication administered for a patient experiencing severe bronchospasm from an iodinated contrast reaction?",
        options: ["Epinephrine (1:1000 intramuscular)", "Diphenhydramine", "Atropine", "Sodium bicarbonate"],
        correctIndex: 0,
        explanation: "Epinephrine is the primary drug of choice for severe contrast-induced anaphylactoid bronchospasms, relaxing airway smooth muscles rapidly."
      }
    ]
  },
  {
    id: "mri-relaxation",
    title: "MRI Relaxation Sequences & Contrast Timing",
    subject: "CT & MRI",
    difficulty: "Intermediate",
    questions: [
      {
        id: "mri-1",
        question: "What parameter timing is typically minimized to create a heavily T1-weighted MRI pulse sequence?",
        options: ["Repetition Time (TR) and Echo Time (TE)", "Flow compensation gradients", "B0 static field strength", "Number of signal averages (NSA)"],
        correctIndex: 0,
        explanation: "To maximize T1 weighting, both TR (repetition time) and TE (echo time) are kept short, minimizing T2 decay effects while highlighting differences in longitudinal recovery."
      },
      {
        id: "mri-2",
        question: "Which MRI sequence is specifically designed to suppress free fluid signals, making CSF appear dark while highlighting periventricular white matter lesions?",
        options: ["FLAIR (Fluid Attenuated Inversion Recovery)", "STIR (Short Tau Inversion Recovery)", "T1-weighted Spin Echo", "Gradient Recalled Echo (GRE)"],
        correctIndex: 0,
        explanation: "FLAIR employs an inversion pulse timed specifically to suppress water signals, enabling highly visible identification of demyelinating MS plaques."
      }
    ]
  }
];

export default function QuizSystem() {
  const [quizMode, setQuizMode] = useState<"standard" | "ai">("standard");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [activeChapter, setActiveChapter] = useState<QuizChapter>(builtInQuizzes[0]);
  
  // Test taker state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(builtInQuizzes[0].questions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Bookmarking specific questions
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  const [pastScores, setPastScores] = useState<Array<{ topic: string; score: number; total: number; date: string }>>([]);

  // AI Quiz State
  const [aiTopicInput, setAiTopicInput] = useState("Radiographic Positioning for Shoulder trauma");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuizError, setAiQuizError] = useState<string | null>(null);

  // Load Bookmarks and Scores from Local Storage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("quiz_bookmarked_questions");
    if (savedBookmarks) {
      try { setBookmarkedQuestions(JSON.parse(savedBookmarks)); } catch(e){}
    }

    const savedScores = localStorage.getItem("quiz_history_scores");
    if (savedScores) {
      try { setPastScores(JSON.parse(savedScores)); } catch(e){}
    }
  }, []);

  const toggleBookmarkQuestion = (id: string) => {
    let updated: string[];
    if (bookmarkedQuestions.includes(id)) {
      updated = bookmarkedQuestions.filter(qId => qId !== id);
    } else {
      updated = [...bookmarkedQuestions, id];
    }
    setBookmarkedQuestions(updated);
    localStorage.setItem("quiz_bookmarked_questions", JSON.stringify(updated));
  };

  const startChapterQuiz = (chapter: QuizChapter) => {
    setActiveChapter(chapter);
    setActiveQuestions(chapter.questions);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setShowExplanation(false);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // Answer locked
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished! Save score log
      const score = getScore();
      const newScoreLog = {
        topic: quizMode === "ai" ? `AI Builder: ${aiTopicInput}` : activeChapter.title,
        score,
        total: activeQuestions.length,
        date: new Date().toLocaleDateString()
      };
      const updatedScores = [newScoreLog, ...pastScores].slice(0, 8); // Keep last 8 logs
      setPastScores(updatedScores);
      localStorage.setItem("quiz_history_scores", JSON.stringify(updatedScores));

      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setShowExplanation(false);
  };

  const getScore = () => {
    let score = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  // Generate dynamic AI quiz from backend
  const handleGenerateAIQuiz = async () => {
    if (!aiTopicInput.trim() || aiLoading) return;
    setAiLoading(true);
    setAiQuizError(null);
    setQuizFinished(false);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);

    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopicInput.trim() }),
      });

      if (!res.ok) {
        throw new Error("AI failed to generate quiz questions. Please check your network and Gemini configuration.");
      }

      const questions = await res.json();
      if (questions && questions.length > 0) {
        // Map ids dynamically
        const processed = questions.map((q: any, i: number) => ({
          id: `ai-q-${i}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation || "No explanation provided."
        }));
        setActiveQuestions(processed);
        setQuizMode("ai");
      } else {
        setAiQuizError("Received empty questions list. Please try again with a different topic.");
      }
    } catch (err: any) {
      setAiQuizError(err.message || "An unexpected error occurred during quiz generation.");
    } finally {
      setAiLoading(false);
    }
  };

  // Filtering built in chapters
  const filteredChapters = builtInQuizzes.filter((ch) => {
    const subMatch = selectedSubject === "all" || ch.subject === selectedSubject;
    const diffMatch = selectedDifficulty === "all" || ch.difficulty === selectedDifficulty;
    return subMatch && diffMatch;
  });

  return (
    <div id="quiz-system-module" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* 1. Left Sidebar Filter & History Controls */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Module Tab Header */}
        <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-3xl border border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => {
              setQuizMode("standard");
              startChapterQuiz(builtInQuizzes[0]);
            }}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              quizMode === "standard"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
            }`}
          >
            Curriculum Exams
          </button>
          <button
            onClick={() => setQuizMode("ai")}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              quizMode === "ai"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Exam Builder
          </button>
        </div>

        {/* Filters Panel (Standard mode only) */}
        {quizMode === "standard" && (
          <div className="premium-card-design flex flex-col gap-5">
            
            {/* Subject filter */}
            <div className="flex flex-col gap-2">
              <span className="caption-text">Filter Subject</span>
              <div className="flex flex-wrap gap-1.5">
                {["all", "Anatomy", "Physics", "Safety", "Contrast Media", "CT & MRI"].map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      selectedSubject === subj
                        ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                        : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {subj === "all" ? "All Subjects" : subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-900 pt-4">
              <span className="caption-text">Difficulty Level</span>
              <div className="flex flex-wrap gap-1.5">
                {["all", "Beginner", "Intermediate", "Advanced"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                        : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {diff === "all" ? "All Levels" : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter List */}
            <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-900 pt-4">
              <span className="caption-text">Available Chapters ({filteredChapters.length})</span>
              <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
                {filteredChapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => startChapterQuiz(ch)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex justify-between items-center cursor-pointer ${
                      activeChapter.id === ch.id
                        ? "bg-blue-50/55 border-blue-400 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/40 font-bold"
                        : "bg-white border-slate-100 text-slate-600 dark:bg-slate-950 dark:border-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="font-bold text-wrap break-words whitespace-normal text-slate-800 dark:text-slate-200">{ch.title}</span>
                      <span className="text-[10px] text-slate-450">{ch.subject} • {ch.difficulty}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  </button>
                ))}
                {filteredChapters.length === 0 && (
                  <span className="text-[11px] text-slate-400 italic text-center py-4">No matching chapters found.</span>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Quiz Past Performance Log */}
        <div className="premium-card-design flex flex-col gap-4">
          <span className="caption-text flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-blue-600" /> Assessment History Log
          </span>
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
            {pastScores.map((h, idx) => (
              <div key={idx} className="bg-slate-50/50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-900 flex justify-between items-center text-xs gap-3">
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <strong className="text-wrap break-words whitespace-normal text-slate-800 dark:text-slate-200 font-bold">{h.topic}</strong>
                  <span className="text-[9px] text-slate-400">{h.date}</span>
                </div>
                <span className="font-mono text-[10px] font-bold bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 px-2.5 py-1 rounded-xl text-blue-600 shadow-sm">
                  {h.score}/{h.total} ({Math.round((h.score / h.total) * 100)}%)
                </span>
              </div>
            ))}
            {pastScores.length === 0 && (
              <span className="text-[11px] text-slate-400 italic text-center py-4">No past exam history found.</span>
            )}
          </div>
        </div>

      </div>

      {/* 2. Right Quiz Taker / AI Generator Panel */}
      <div className="lg:col-span-8">
        
        {quizMode === "standard" ? (
          
          <div className="premium-card-design flex flex-col justify-between min-h-[460px]">
            {!quizFinished ? (
              <div className="flex-1 flex flex-col justify-between animate-premium-fade">
                <div>
                  
                  {/* Progress Headings */}
                  <div className="flex justify-between items-center text-[11px] text-slate-450 border-b border-slate-150 dark:border-slate-900 pb-3.5 mb-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">
                        Question {currentIdx + 1} of {activeQuestions.length}
                      </span>
                      {/* Visual Progress Bar */}
                      <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Bookmark current question */}
                      <button
                        onClick={() => toggleBookmarkQuestion(activeQuestions[currentIdx]?.id)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          bookmarkedQuestions.includes(activeQuestions[currentIdx]?.id)
                            ? "bg-amber-500/10 border-amber-400 text-amber-500"
                            : "bg-slate-50 border-slate-150 text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800"
                        }`}
                        title="Bookmark / Save Question"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarkedQuestions.includes(activeQuestions[currentIdx]?.id) ? "fill-amber-500" : ""}`} />
                      </button>

                      <span className="font-mono bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200/50 dark:border-slate-800 text-[10px] text-slate-500">
                        {activeChapter.subject.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Question Title */}
                  <h3 className="section-heading text-slate-900 dark:text-slate-100 mb-6 leading-relaxed">
                    {activeQuestions[currentIdx]?.question}
                  </h3>

                  {/* MCQ Options */}
                  <div className="flex flex-col gap-3">
                    {activeQuestions[currentIdx]?.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentIdx] === oIdx;
                      const isCorrect = oIdx === activeQuestions[currentIdx].correctIndex;
                      const hasAnswered = selectedAnswers[currentIdx] !== undefined;

                      let optColor = "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/65 text-slate-700 dark:text-slate-300";
                      let IndicatorIcon = null;

                      if (hasAnswered) {
                        if (isCorrect) {
                          optColor = "border-emerald-500 bg-emerald-50/40 text-emerald-950 dark:text-emerald-300 font-semibold";
                          IndicatorIcon = <Check className="w-4 h-4 text-emerald-600" />;
                        } else if (isSelected) {
                          optColor = "border-rose-500 bg-rose-50/40 text-rose-950 dark:text-rose-300 font-semibold";
                          IndicatorIcon = <X className="w-4 h-4 text-rose-600" />;
                        } else {
                          optColor = "border-slate-200 opacity-55 text-slate-400 dark:border-slate-850";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`option-${currentIdx}-${oIdx}`}
                          onClick={() => handleSelectAnswer(oIdx)}
                          className={`w-full text-left px-5 py-4 text-xs rounded-2xl border transition-all flex items-center justify-between font-medium cursor-pointer ${optColor}`}
                        >
                          <span className="leading-relaxed">{opt}</span>
                          {IndicatorIcon}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation and navigation */}
                <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-850 flex flex-col gap-4">
                  {showExplanation && (
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 mb-2 animate-premium-fade leading-relaxed">
                      <span className="font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px] text-blue-800 dark:text-blue-400">
                        <ShieldCheck className="w-4 h-4 text-blue-600" /> Correct Explanation
                      </span>
                      <p>{activeQuestions[currentIdx]?.explanation}</p>
                    </div>
                  )}

                  {selectedAnswers[currentIdx] !== undefined && (
                    <button
                      id="btn-quiz-next"
                      onClick={handleNextQuestion}
                      className="btn-primary-design self-end px-5 py-3 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentIdx === activeQuestions.length - 1 ? "Finish Test" : "Next Question"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Finished Panel */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-premium-fade">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 flex items-center justify-center mb-5 border border-emerald-100 dark:border-emerald-900">
                  <Award className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="section-heading text-slate-900 dark:text-slate-100">Chapter Assessment Complete</h3>
                <p className="body-text mt-2 max-w-sm">
                  You scored <strong className="text-slate-800 dark:text-slate-200">{getScore()} out of {activeQuestions.length}</strong> correct answers.
                </p>

                {/* Grade display */}
                <div className="my-6 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                  GRADE: {Math.round((getScore() / activeQuestions.length) * 100)}%
                </div>

                <button
                  id="btn-quiz-restart"
                  onClick={handleResetQuiz}
                  className="btn-primary-design px-5 py-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-take Quiz
                </button>
              </div>
            )}
          </div>

        ) : (
          
          /* AI Interactive Quiz Builder Panel */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-premium-fade">
            <div className="md:col-span-5 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-900 flex flex-col justify-between shadow-sm min-h-[400px]">
              <div>
                <span className="caption-text block mb-2">Custom Exam parameters</span>
                <input
                  id="ai-quiz-topic-input"
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder="e.g. Chest Lateral View, Spine Trauma, CT Scans..."
                  className="w-full px-4 py-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm mb-4"
                />
                <p className="body-text">
                  Provide any radiology topic, anatomy sector, or imaging technique. The server-side Gemini model will dynamically draft a personalized 5-question multi-choice exam with immediate clinical explanations.
                </p>
              </div>
              
              <button
                id="btn-trigger-ai-quiz"
                onClick={handleGenerateAIQuiz}
                disabled={aiLoading}
                className="btn-primary-design w-full py-3 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                {aiLoading ? "Constructing AI Exam..." : "Build Dynamic Exam"}
              </button>
            </div>

            {/* AI Test Taking Arena */}
            <div className="md:col-span-7 premium-card-design flex flex-col justify-between min-h-[400px]">
              {aiQuizError ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="bg-red-500/10 border border-red-400/30 text-red-600 dark:text-red-400 p-5 rounded-2xl text-xs max-w-sm flex flex-col items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <strong className="font-bold text-sm">Exam Construction Failed</strong>
                    <p className="leading-relaxed text-slate-500">{aiQuizError}</p>
                  </div>
                </div>
              ) : aiLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-pulse py-8">
                  <Sparkles className="w-10 h-10 text-blue-500 mb-3 animate-spin" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Writing Exam Script...</h4>
                  <p className="text-[10px] text-slate-400 max-w-xs mt-2 leading-relaxed">
                    Analyzing radiological journals and formulating unique diagnostic multiple choice options with custom justifications.
                  </p>
                </div>
              ) : !quizFinished ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-150 dark:border-slate-850 pb-3.5 mb-5">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">AI Question {currentIdx + 1} of {activeQuestions.length}</span>
                      <span className="font-mono text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/40 px-2.5 py-1 rounded flex items-center gap-1 text-[10px] border border-blue-150/40">
                        <Sparkles className="w-3 h-3 animate-pulse" /> DYNAMIC AI
                      </span>
                    </div>

                    <h3 className="section-heading text-slate-900 dark:text-slate-100 mb-6 leading-relaxed">
                      {activeQuestions[currentIdx]?.question}
                    </h3>

                    <div className="flex flex-col gap-3">
                      {activeQuestions[currentIdx]?.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[currentIdx] === oIdx;
                        const isCorrect = oIdx === activeQuestions[currentIdx].correctIndex;
                        const hasAnswered = selectedAnswers[currentIdx] !== undefined;

                        let optColor = "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/65 text-slate-750 dark:text-slate-300";
                        let IndicatorIcon = null;

                        if (hasAnswered) {
                          if (isCorrect) {
                            optColor = "border-emerald-500 bg-emerald-50/40 text-emerald-950 dark:text-emerald-300 font-semibold";
                            IndicatorIcon = <Check className="w-4 h-4 text-emerald-600" />;
                          } else if (isSelected) {
                            optColor = "border-rose-500 bg-rose-50/40 text-rose-950 dark:text-rose-300 font-semibold";
                            IndicatorIcon = <X className="w-4 h-4 text-rose-600" />;
                          } else {
                            optColor = "border-slate-200 opacity-55 text-slate-400 dark:border-slate-850";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            id={`ai-option-${currentIdx}-${oIdx}`}
                            onClick={() => handleSelectAnswer(oIdx)}
                            className={`w-full text-left px-5 py-4 text-xs rounded-2xl border transition-all flex items-center justify-between font-medium cursor-pointer ${optColor}`}
                          >
                            <span className="leading-relaxed">{opt}</span>
                            {IndicatorIcon}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-850 flex flex-col gap-4">
                    {showExplanation && (
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200 mb-2 animate-premium-fade leading-relaxed shadow-sm font-medium">
                        <span className="font-extrabold flex items-center gap-2 mb-2 uppercase tracking-wider text-[10px] text-emerald-900 dark:text-emerald-300 font-display">
                          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Clinical Rationale
                        </span>
                        <p>{activeQuestions[currentIdx]?.explanation}</p>
                      </div>
                    )}

                    {selectedAnswers[currentIdx] !== undefined && (
                      <button
                        id="btn-ai-quiz-next"
                        onClick={handleNextQuestion}
                        className="btn-primary-design self-end px-5 py-3 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{currentIdx === activeQuestions.length - 1 ? "Finish Exam" : "Next Question"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-premium-fade">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/30 flex items-center justify-center mb-5 border border-amber-100 dark:border-amber-900">
                    <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
                  </div>
                  <h3 className="section-heading text-slate-900 dark:text-slate-100">AI Exam Finished</h3>
                  <p className="body-text mt-2 max-w-sm">
                    You scored <strong className="text-slate-800 dark:text-slate-200">{getScore()} out of {activeQuestions.length}</strong> correct. Practice often to build diagnostic fluency!
                  </p>

                  <div className="my-6 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                    SCORE: {Math.round((getScore() / activeQuestions.length) * 100)}%
                  </div>

                  <button
                    id="btn-ai-quiz-regenerate"
                    onClick={handleGenerateAIQuiz}
                    className="btn-primary-design px-5 py-3 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate Another Exam
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
