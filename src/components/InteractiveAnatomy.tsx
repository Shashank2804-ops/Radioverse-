/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  RotateCw, ZoomIn, ZoomOut, Search, Eye, Info, 
  Layers, ShieldAlert, Activity, Sparkles, Bookmark,
  ChevronDown, ChevronRight, Award, HelpCircle, Download, 
  BookOpen, RefreshCw, Sliders, Sun, CheckCircle, AlertTriangle,
  Image as ImageIcon, Share2, Check, Lock, Compass, Droplet, Zap,
  MessageSquare, GitPullRequest, FileText, Scan, Grid, PlayCircle, Clock
} from "lucide-react";
import { anatomicalStructures, AnatomicalStructure } from "../data/anatomyData";
import { getEnrichedStructure, EnrichedStructure } from "../data/anatomyEnrichment";

// Simple highlighting component to highlight search matches
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-amber-200 dark:bg-amber-500/40 text-slate-900 dark:text-white px-0.5 rounded font-bold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// Academic level resolver to support guided top-navigation headers
function getAcademicMetadata(structure: AnatomicalStructure) {
  let semester = "Semester 1";
  let subject = "Gross Anatomy";
  let chapter = "Osteology";
  
  if (structure.category === "skeletal") {
    semester = "Semester 1";
    chapter = "Osteology";
  } else if (structure.category === "muscular") {
    semester = "Semester 1";
    chapter = "Myology";
  } else if (structure.category === "joints") {
    semester = "Semester 1";
    chapter = "Arthrology";
  } else if (structure.category === "nervous") {
    semester = "Semester 2";
    chapter = "Neuroanatomy";
  } else if (structure.category === "cardiovascular") {
    semester = "Semester 1";
    chapter = "Angiology";
  } else if (structure.category === "respiratory") {
    semester = "Semester 1";
    chapter = "Splanchnology";
  } else if (structure.category === "digestive") {
    semester = "Semester 2";
    chapter = "Gastrointestinal";
  } else if (structure.category === "urinary") {
    semester = "Semester 2";
    chapter = "Urogenital";
  } else if (structure.category === "reproductive") {
    semester = "Semester 2";
    chapter = "Reproductive System";
  }

  return {
    semester,
    subject,
    chapter,
    topic: structure.name
  };
}

export default function InteractiveAnatomy({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["skeletal"]);
  const [selectedStructureId, setSelectedStructureId] = useState<string>("skull");
  
  // Future-ready persistent state arrays
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [learningHistory, setLearningHistory] = useState<string[]>([]);
  
  // Viewer Control States
  const [viewerMode, setViewerMode] = useState<"2d" | "hologram" | "3d">("hologram");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [isXrayOverlay, setIsXrayOverlay] = useState(false);
  const [showPins, setShowPins] = useState(true);
  
  // Learning Area Tabs State
  const [activeTab, setActiveTab] = useState<"overview" | "attachments" | "blood" | "innervation" | "clinical" | "radiology" | "related">("overview");
  const [activeRadiologySubTab, setActiveRadiologySubTab] = useState<"xray" | "ct" | "mri">("xray");
  
  // Bookmark & Quiz States
  const [bookmarkedParts, setBookmarkedParts] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<Record<string, { answered: boolean; selectedIndex: number; correct: boolean }>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  // Learning Progress State
  const [learningProgress, setLearningProgress] = useState<Record<string, "not_started" | "in_progress" | "completed">>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedExamQuestions, setExpandedExamQuestions] = useState<Record<string, number[]>>({});
  const [expandedSection, setExpandedSection] = useState<number | null>(1);
  const [imageError, setImageError] = useState<boolean>(false);
  const [activeQuizAnswers, setActiveQuizAnswers] = useState<Record<string, Record<number, number>>>({});

  useEffect(() => {
    setImageError(false);
  }, [selectedStructureId]);

  // Load progress, bookmarks, and trackers on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("anatomy_hub_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedParts(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Error loading bookmarks:", e);
      }
    }

    const savedProgress = localStorage.getItem("anatomy_hub_progress");
    if (savedProgress) {
      try {
        setLearningProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Error loading progress:", e);
      }
    }

    const savedHistory = localStorage.getItem("anatomy_learning_history");
    if (savedHistory) {
      try {
        setLearningHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error loading history:", e);
      }
    }

    const savedRecently = localStorage.getItem("anatomy_recently_viewed");
    if (savedRecently) {
      try {
        setRecentlyViewed(JSON.parse(savedRecently));
      } catch (e) {
        console.error("Error loading recently viewed:", e);
      }
    }
  }, []);

  // Update history, recently viewed, and status on structure selection
  useEffect(() => {
    if (!selectedStructureId) return;

    // 1. Add to recently viewed (max 4, unique)
    setRecentlyViewed((prev) => {
      const updated = [selectedStructureId, ...prev.filter((id) => id !== selectedStructureId)].slice(0, 4);
      localStorage.setItem("anatomy_recently_viewed", JSON.stringify(updated));
      return updated;
    });

    // 2. Append to learning history logs
    setLearningHistory((prev) => {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const strName = anatomicalStructures.find((s) => s.id === selectedStructureId)?.name || selectedStructureId;
      const log = `${now} - Studied ${strName}`;
      const updated = [log, ...prev].slice(0, 20); // keep last 20
      localStorage.setItem("anatomy_learning_history", JSON.stringify(updated));
      return updated;
    });

    // 3. Mark lesson as "in_progress" automatically if it's currently "not_started" or undefined
    setLearningProgress((prev) => {
      const currentStatus = prev[selectedStructureId];
      if (!currentStatus || currentStatus === "not_started") {
        const updated = { ...prev, [selectedStructureId]: "in_progress" as const };
        localStorage.setItem("anatomy_hub_progress", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, [selectedStructureId]);

  // Toast message auto-cleanup
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const updateProgress = (structureId: string, status: "not_started" | "in_progress" | "completed") => {
    const updated = { ...learningProgress, [structureId]: status };
    setLearningProgress(updated);
    localStorage.setItem("anatomy_hub_progress", JSON.stringify(updated));
  };

  const toggleExamQuestion = (structureId: string, questionIndex: number) => {
    setExpandedExamQuestions((prev) => {
      const currentList = prev[structureId] || [];
      const updatedList = currentList.includes(questionIndex)
        ? currentList.filter((idx) => idx !== questionIndex)
        : [...currentList, questionIndex];
      return { ...prev, [structureId]: updatedList };
    });
  };

  // Get active structure details
  const selectedStructure = useMemo(() => {
    return (
      anatomicalStructures.find((s) => s.id === selectedStructureId) || 
      anatomicalStructures[0]
    );
  }, [selectedStructureId]);

  const enriched = useMemo(() => {
    return getEnrichedStructure(selectedStructure);
  }, [selectedStructure]);

  // Guided learning navigation memos
  const currentIndex = useMemo(() => {
    return anatomicalStructures.findIndex((s) => s.id === selectedStructureId);
  }, [selectedStructureId]);

  const previousTopic = useMemo(() => {
    return currentIndex > 0 ? anatomicalStructures[currentIndex - 1] : null;
  }, [currentIndex]);

  const nextTopic = useMemo(() => {
    return currentIndex < anatomicalStructures.length - 1 ? anatomicalStructures[currentIndex + 1] : null;
  }, [currentIndex]);

  const currentProgress = useMemo(() => {
    return learningProgress[selectedStructureId] || "not_started";
  }, [learningProgress, selectedStructureId]);

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem("anatomy_hub_bookmarks");
    if (saved) {
      try {
        setBookmarkedParts(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading bookmarks:", e);
      }
    }
  }, []);

  // Sync bookmarks
  const toggleBookmark = (id: string) => {
    const updated = bookmarkedParts.includes(id)
      ? bookmarkedParts.filter((bId) => bId !== id)
      : [...bookmarkedParts, id];
    setBookmarkedParts(updated);
    localStorage.setItem("anatomy_hub_bookmarks", JSON.stringify(updated));
    triggerToast(bookmarkedParts.includes(id) ? "Removed from bookmarks folder!" : "Added to study bookmarks!");
  };

  // Auto-expand categories containing matching structures on search
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const matchingCats = new Set(
        anatomicalStructures
          .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((s) => s.category)
      );
      setExpandedCategories(Array.from(matchingCats));
    }
  }, [searchQuery]);

  // Toggle single category accordion smooth expansion
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => 
      prev.includes(catId) 
        ? prev.filter((id) => id !== catId) 
        : [...prev, catId]
    );
  };

  // Group structures by category
  const categoriesList = useMemo(() => {
    return [
      { id: "skeletal", label: "Skeletal System", color: "text-amber-500 bg-amber-500/10" },
      { id: "muscular", label: "Muscular System", color: "text-rose-500 bg-rose-500/10" },
      { id: "joints", label: "Joints & Articulations", color: "text-emerald-500 bg-emerald-500/10" },
      { id: "nervous", label: "Nervous System", color: "text-indigo-500 bg-indigo-500/10" },
      { id: "cardiovascular", label: "Cardiovascular System", color: "text-red-500 bg-red-500/10" },
      { id: "respiratory", label: "Respiratory System", color: "text-sky-500 bg-sky-500/10" },
      { id: "digestive", label: "Digestive System", color: "text-orange-500 bg-orange-500/10" },
      { id: "urinary", label: "Urinary System", color: "text-blue-500 bg-blue-500/10" },
      { id: "reproductive", label: "Reproductive System", color: "text-purple-500 bg-purple-500/10" }
    ];
  }, []);

  // Filter categories and structures based on global search
  const filteredCategoryData = useMemo(() => {
    return categoriesList.map((cat) => {
      const structures = anatomicalStructures.filter(
        (s) => 
          s.category === cat.id && 
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...cat, structures };
    });
  }, [categoriesList, searchQuery]);

  // Study Note Generation (Real Client-side Markdown File Download)
  const handleDownloadNotes = () => {
    const s = getEnrichedStructure(selectedStructure);
    const markdownContent = `# Anatomy & Radiology Study Guide: ${s.name}
---
* **Scientific Name:** *${s.scientificName}*
* **Common Name:** ${s.commonName}
* **System/Category:** ${s.system}
* **Region:** ${s.region}
* **Difficulty Level:** ${selectedStructure.difficulty}
* **Suggested Study Time:** ${selectedStructure.studyTime}

## 1. Overview
${s.overview}

## 2. Location
${s.location}

## 3. Boundaries
${s.boundaries}

## 4. Relations
${s.relations}

## 5. Blood Supply
${s.bloodSupply}

## 6. Nerve Supply
${s.nerveSupply}

## 7. Lymphatic Drainage
${s.lymphaticDrainage}

## 8. Function
${s.function}

## 9. Surface Anatomy
${s.surfaceAnatomy}

## 10. Clinical Importance
${s.clinicalImportance}

## 11. Common Diseases
${s.commonDiseases}

## 12. Radiological Appearance
${s.radiologicalAppearance}

## 13. X-Ray Positioning & Views
${s.xrayView}

## 14. CT Appearance
${s.ctAppearance}

## 15. MRI Appearance
${s.mriAppearance}

---
*Generated by RadioVerse Anatomy Learning Hub.*`;

    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${s.id}_curriculum_notes.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Downloaded study notes for ${s.name}!`);
  };

  // Take Quiz actions
  const handleQuizAnswer = (optionIndex: number) => {
    const s = selectedStructure;
    if (!s.quizQuestions || s.quizQuestions.length === 0) return;
    
    const correct = s.quizQuestions[0].correctIndex === optionIndex;
    setQuizScore((prev) => ({
      ...prev,
      [s.id]: {
        answered: true,
        selectedIndex: optionIndex,
        correct
      }
    }));
  };

  const handleResetQuiz = () => {
    setQuizScore((prev) => {
      const updated = { ...prev };
      delete updated[selectedStructure.id];
      return updated;
    });
  };

  // Generate dynamic path fallback for images
  const displayImageSrc = useMemo(() => {
    return `/anatomy/${selectedStructure.category}/${selectedStructure.id}.jpg`;
  }, [selectedStructure]);

  return (
    <div id="anatomy-hub-root" className="flex flex-col gap-6 max-w-7xl mx-auto p-1 text-slate-850 dark:text-slate-100">
      
      {/* Header Banner - Sleek & Modern */}
      <div id="anatomy-hub-header" className="p-6 rounded-3xl bg-linear-to-r from-blue-900/10 via-indigo-900/10 to-transparent border border-slate-150 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] uppercase tracking-widest font-extrabold text-blue-200 dark:text-blue-100 bg-slate-900 dark:bg-slate-950 border border-slate-750 dark:border-slate-800 rounded-full shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Advanced Clinical Anatomy
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mt-2 font-sans">
            Interactive Anatomy Learning Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore premium high-fidelity anatomical structures, clinical correlations, and high-contrast diagnostic radiological plates.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Quiz Performance</span>
              <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                {Object.keys(quizScore).filter(key => quizScore[key]?.correct).length} / {Object.keys(quizScore).length} Mastered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BREADCRUMB NAVIGATION */}
      <nav id="anatomy-breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-3.5 px-5 rounded-2xl border border-slate-150 dark:border-slate-850/60 font-semibold shadow-xs">
        <button 
          onClick={() => onNavigate?.("home")}
          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors font-bold text-slate-600 dark:text-slate-350"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-350 shrink-0" />
        <button 
          onClick={() => {
            setSearchQuery("");
            setSelectedStructureId(anatomicalStructures[0].id);
          }}
          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors font-bold text-slate-600 dark:text-slate-350"
        >
          Anatomy
        </button>
        <ChevronRight className="w-3 h-3 text-slate-350 shrink-0" />
        <span className="text-slate-550 dark:text-slate-400 capitalize">
          {selectedStructure.category === "skeletal" ? "Skeletal System" : selectedStructure.category + " System"}
        </span>
        <ChevronRight className="w-3 h-3 text-slate-350 shrink-0" />
        <span className="text-blue-600 dark:text-blue-400 font-extrabold">
          {selectedStructure.name}
        </span>
      </nav>

      {/* CORE RESPONSIVE LAYOUT */}
      <div id="anatomy-hub-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ====================================================
            LEFT SIDEBAR: SEARCHABLE ANATOMY EXPLORER
            ==================================================== */}
        <div id="anatomy-left-sidebar" className="lg:col-span-3 flex flex-col gap-4 bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs h-fit">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Anatomical Systems
            </h3>
            
            {/* Search Input */}
            <div id="search-explorer-container" className="relative mt-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="search-anatomy-input"
                type="text"
                placeholder="Search Anatomy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 h-10 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Accordion List Container */}
          <div id="explorer-accordion-list" className="flex flex-col gap-3 pr-1 py-1">
            {filteredCategoryData.map((cat) => (
              <div 
                key={cat.id} 
                id={`accordion-group-${cat.id}`}
                className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/10 hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-200 shadow-xs hover:shadow-sm"
              >
                {/* Category Header */}
                <button
                  id={`btn-toggle-cat-${cat.id}`}
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between p-4 px-5 text-left transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/40 rounded-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-1.5 rounded-xl text-xs font-extrabold ${cat.color} min-w-[34px] text-center font-display`}>
                      {cat.id.substring(0, 2).toUpperCase()}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight font-display">
                      {cat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100/80 dark:bg-slate-900/80 px-2.5 py-0.5 rounded-md border border-slate-150 dark:border-slate-800">
                      {cat.structures.length}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                      expandedCategories.includes(cat.id) ? "rotate-180" : "rotate-0"
                    }`} />
                  </div>
                </button>

                {/* Smooth Animated Structures List */}
                <AnimatePresence initial={false}>
                  {expandedCategories.includes(cat.id) && (
                    <motion.div
                      key={`content-${cat.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden bg-white/50 dark:bg-slate-950/20 border-t border-slate-150/40 dark:border-slate-850/40"
                    >
                      <div className="p-4 flex flex-col gap-2">
                        {cat.structures.map((s) => (
                          <button
                            key={s.id}
                            id={`btn-structure-select-${s.id}`}
                            onClick={() => {
                              setSelectedStructureId(s.id);
                              // Reset active tab if it's unrelated
                              if (activeTab === "attachments" && !s.attachments) {
                                setActiveTab("overview");
                              }
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer border border-transparent ${
                              selectedStructureId === s.id
                                ? "bg-blue-600 border-blue-600 text-white font-semibold shadow-md"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 hover:border-slate-100 dark:hover:border-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span 
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  learningProgress[s.id] === "completed"
                                    ? "bg-emerald-500"
                                    : learningProgress[s.id] === "in_progress"
                                    ? "bg-amber-500"
                                    : "bg-slate-300 dark:bg-slate-700"
                                }`}
                                title={
                                  learningProgress[s.id] === "completed"
                                    ? "Completed"
                                    : learningProgress[s.id] === "in_progress"
                                    ? "In Progress"
                                    : "Not Started"
                                }
                              />
                              <span className="whitespace-normal break-words text-wrap pr-1 font-medium"><HighlightText text={s.name} highlight={searchQuery} /></span>
                            </div>
                            <span className={`text-[9px] font-mono font-bold rounded px-1.5 py-0.5 ${
                              selectedStructureId === s.id 
                                ? "bg-blue-750 text-white" 
                                : "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200"
                            }`}>
                              {s.difficulty[0]}
                            </span>
                          </button>
                        ))}
                        {cat.structures.length === 0 && (
                          <div className="p-4 text-center text-[11px] text-slate-400 italic">
                            No structures found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* ====================================================
            CENTER LEARNING AREA: VIEWER + EDUCATIONAL TABS
            ==================================================== */}
        <div id="anatomy-center-area" className="lg:col-span-6 flex flex-col gap-6">
          
          {/* TOP LESSON PATH NAVIGATION */}
          <div id="anatomy-lesson-top-nav" className="flex flex-wrap items-center gap-2 px-5 py-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850/60 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 shadow-xs">
            <span className="text-blue-600 dark:text-blue-400 uppercase font-mono tracking-wider">{getAcademicMetadata(selectedStructure).semester}</span>
            <ChevronRight className="w-3 h-3 text-slate-355 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">Anatomy</span>
            <ChevronRight className="w-3 h-3 text-slate-355 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">{getAcademicMetadata(selectedStructure).chapter}</span>
            <ChevronRight className="w-3 h-3 text-slate-355 shrink-0" />
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">{getAcademicMetadata(selectedStructure).topic}</span>
          </div>
          
          {/* Top Bar Actions */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Study Progress:</span>
              <div className="relative">
                <select
                  id="progress-selector"
                  value={learningProgress[selectedStructure.id] || "not_started"}
                  onChange={(e) => updateProgress(selectedStructure.id, e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                  <option value="not_started">⚪ Not Started</option>
                  <option value="in_progress">🟡 In Progress</option>
                  <option value="completed">🟢 Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Bookmark Button */}
              <button
                id="top-bookmark-btn"
                onClick={() => toggleBookmark(selectedStructure.id)}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  bookmarkedParts.includes(selectedStructure.id)
                    ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
                title="Bookmark Structure"
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedParts.includes(selectedStructure.id) ? "fill-amber-600" : ""}`} />
                <span className="hidden sm:inline">Bookmark</span>
              </button>

              {/* Share Button */}
              <button
                id="top-share-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `RadioVerse: ${selectedStructure.name}`,
                      text: `Study the anatomical structures of ${selectedStructure.name} on RadioVerse!`,
                      url: window.location.href
                    }).catch(err => console.log(err));
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    triggerToast("Sharing link copied to clipboard!");
                  }
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Share Reference"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Download Notes */}
              <button
                id="top-download-btn"
                onClick={handleDownloadNotes}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Download Study Notes"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Download Notes</span>
              </button>

              {/* Take Quiz */}
              <button
                id="top-quiz-btn"
                onClick={() => {
                  setExpandedSection(17);
                  setTimeout(() => {
                    const qEl = document.getElementById("anatomy-sec-17");
                    if (qEl) {
                      qEl.scrollIntoView({ behavior: "smooth", block: "center" });
                      triggerToast("Opened MCQ Practice Session!");
                    }
                  }, 150);
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Active-Recall MCQs"
              >
                <Award className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Take Quiz</span>
              </button>
            </div>
          </div>

          {/* Section 1: Anatomy Image */}
          <div id="anatomy-sec-1" className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 1 ? null : 1)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all text-left font-sans cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold px-2 py-0.5 rounded-md font-mono">1</span>
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Anatomy Image</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSection === 1 ? "rotate-180" : "rotate-0"}`} />
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 1 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-slate-100 dark:border-slate-900"
                >
                  <div className="p-5 flex flex-col gap-4">
                    {/* Viewer Header with Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                        <h2 className="text-xs font-bold tracking-tight text-slate-400 dark:text-slate-550 uppercase">
                          Interactive Visual Plate
                        </h2>
                      </div>
                      
                      {/* Mode selectors */}
                      <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-150 dark:border-slate-800 self-start sm:self-auto gap-1">
                        <button
                          id="btn-viewer-mode-2d"
                          onClick={() => setViewerMode("2d")}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            viewerMode === "2d"
                              ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                          }`}
                        >
                          Plate (2D)
                        </button>
                        <button
                          id="btn-viewer-mode-hologram"
                          onClick={() => setViewerMode("hologram")}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            viewerMode === "hologram"
                              ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xs"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                          }`}
                        >
                          Hologram Vector
                        </button>
                        
                        {/* Disabled 3D Button with Tooltip */}
                        <button
                          disabled
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg text-slate-300 dark:text-slate-750 cursor-not-allowed flex items-center gap-1 group relative bg-transparent"
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>Interactive 3D Viewer</span>
                          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-semibold py-1 px-2.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                            Available in a future update.
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Stage Canvas */}
                    <div className="relative w-full aspect-4/3 bg-slate-950 dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 shadow-inner overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-25 dark:opacity-35" />
                      <div className="absolute w-[280px] h-[280px] border border-dashed border-slate-800/15 dark:border-slate-400/10 rounded-full pointer-events-none flex items-center justify-center animate-spin-slow">
                        <div className="w-[180px] h-[180px] border border-dashed border-slate-800/25 dark:border-slate-400/15 rounded-full" />
                      </div>
                      <div className="absolute inset-y-8 w-[1px] border-l border-dashed border-slate-800/10 dark:border-slate-400/5 pointer-events-none" />
                      <div className="absolute inset-x-8 h-[1px] border-t border-dashed border-slate-800/10 dark:border-slate-400/5 pointer-events-none" />

                      <motion.div
                        style={{
                          filter: `brightness(${brightness}%) ${isXrayOverlay ? 'contrast(200%) invert(100%) grayscale(100%)' : ''}`
                        }}
                        animate={{
                          rotate: rotation,
                          scale: zoom
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative w-full h-full flex items-center justify-center p-6"
                      >
                        {viewerMode === "2d" && (
                          <div className="relative w-full h-full flex items-center justify-center">
                            {imageLoading[selectedStructure.id] && !imageError && (
                              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center z-10">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                            
                            {imageError ? (
                              <div className="flex flex-col items-center justify-center text-center p-4">
                                <ImageIcon className="w-10 h-10 text-slate-650 mb-2.5 stroke-[1.2]" />
                                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">Image Coming Soon</span>
                                <p className="text-[10px] text-slate-500 max-w-xs mt-1">
                                  Standard radiological plate of "{selectedStructure.name}" is being compiled for the database.
                                </p>
                              </div>
                            ) : (
                              <img
                                src={displayImageSrc}
                                alt={selectedStructure.name}
                                referrerPolicy="no-referrer"
                                onLoad={() => setImageLoading(prev => ({ ...prev, [selectedStructure.id]: false }))}
                                onError={() => setImageError(true)}
                                className="max-h-[85%] max-w-[85%] object-contain rounded-xl select-none"
                              />
                            )}
                          </div>
                        )}

                        {viewerMode === "hologram" && (
                          <div className="relative w-full h-full flex items-center justify-center select-none">
                            <svg className="w-48 h-48 drop-shadow-[0_0_15px_rgba(37,99,235,0.45)]" viewBox="0 0 100 100" fill="none">
                              {selectedStructure.category === "skeletal" && (
                                <>
                                  <path d="M50,15 C40,15 35,22 35,32 C35,42 42,46 50,46 C58,46 65,42 65,32 C65,22 60,15 50,15 Z" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 1" />
                                  <path d="M42,28 A2,2 0 1 0 42,27.9" fill="#2563eb" />
                                  <path d="M58,28 A2,2 0 1 0 58,27.9" fill="#2563eb" />
                                  <path d="M40,36 Q50,42 60,36" stroke="#ef4444" strokeWidth="1" />
                                  <path d="M50,46 L50,85" stroke="#3b82f6" strokeWidth="2.5" />
                                  <path d="M30,55 L70,55" stroke="#10b981" strokeWidth="1.5" />
                                  <circle cx="50" cy="46" r="3" fill="#60a5fa" />
                                  <circle cx="50" cy="85" r="3" fill="#60a5fa" />
                                </>
                              )}

                              {selectedStructure.category === "muscular" && (
                                <>
                                  <path d="M50,15 Q30,45 50,85 Q70,45 50,15" fill="url(#grad-muscle)" stroke="#f43f5e" strokeWidth="1.5" />
                                  <path d="M50,15 L50,85" stroke="#fda4af" strokeWidth="0.8" strokeDasharray="4 2" />
                                  <path d="M42,32 Q50,45 58,32" stroke="#fda4af" strokeWidth="0.5" />
                                  <path d="M38,48 Q50,60 62,48" stroke="#fda4af" strokeWidth="0.5" />
                                  <path d="M42,65 Q50,75 58,65" stroke="#fda4af" strokeWidth="0.5" />
                                </>
                              )}

                              {selectedStructure.category === "joints" && (
                                <>
                                  <rect x="47" y="15" width="6" height="30" rx="3" stroke="#10b981" strokeWidth="1.5" />
                                  <rect x="47" y="55" width="6" height="30" rx="3" stroke="#10b981" strokeWidth="1.5" />
                                  <circle cx="50" cy="50" r="8" stroke="#f59e0b" strokeWidth="2.5" fill="#f59e0b/10" />
                                  <path d="M38,50 Q50,38 62,50" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                                  <path d="M38,50 Q50,62 62,50" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                                </>
                              )}

                              {selectedStructure.category === "nervous" && (
                                <>
                                  <circle cx="50" cy="25" r="10" stroke="#6366f1" strokeWidth="1.5" />
                                  <path d="M50,35 L50,85" stroke="#6366f1" strokeWidth="2" />
                                  <path d="M50,45 L20,38" stroke="#818cf8" strokeWidth="1" />
                                  <path d="M50,45 L80,38" stroke="#818cf8" strokeWidth="1" />
                                  <path d="M50,58 L22,58" stroke="#818cf8" strokeWidth="1" />
                                  <path d="M50,58 L78,58" stroke="#818cf8" strokeWidth="1" />
                                  <path d="M50,72 L25,82" stroke="#818cf8" strokeWidth="1" />
                                  <path d="M50,72 L75,82" stroke="#818cf8" strokeWidth="1" />
                                  <circle cx="20" cy="38" r="1.5" fill="#a5b4fc" />
                                  <circle cx="80" cy="38" r="1.5" fill="#a5b4fc" />
                                  <circle cx="22" cy="58" r="1.5" fill="#a5b4fc" />
                                  <circle cx="78" cy="58" r="1.5" fill="#a5b4fc" />
                                </>
                              )}

                              {selectedStructure.category === "cardiovascular" && (
                                <>
                                  <path d="M50,30 C30,10 10,35 50,75 C90,35 70,10 50,30 Z" fill="url(#grad-cardio)" stroke="#ef4444" strokeWidth="1.5" />
                                  <path d="M38,30 C38,15 48,15 48,30" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                  <path d="M55,24 C55,10 65,12 65,26" stroke="#ef4444" strokeWidth="2" fill="none" />
                                </>
                              )}

                              {selectedStructure.category === "respiratory" && (
                                <>
                                  <path d="M50,15 L50,40" stroke="#0ea5e9" strokeWidth="2" />
                                  <path d="M50,40 L35,55" stroke="#0ea5e9" strokeWidth="1.5" />
                                  <path d="M50,40 L65,55" stroke="#0ea5e9" strokeWidth="1.5" />
                                  <path d="M35,55 Q20,50 25,75 Q32,85 45,80 Z" stroke="#38bdf8" strokeWidth="1" />
                                  <path d="M65,55 Q80,50 75,75 Q68,85 55,80 Z" stroke="#38bdf8" strokeWidth="1" />
                                </>
                              )}

                              {!["skeletal", "muscular", "joints", "nervous", "cardiovascular", "respiratory"].includes(selectedStructure.category) && (
                                <>
                                  <path d="M50,20 Q35,20 30,40 T50,80 Q70,60 65,40 T50,20" fill="url(#grad-organic)" stroke="#a855f7" strokeWidth="1.5" />
                                  <circle cx="50" cy="45" r="5" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 1" />
                                </>
                              )}

                              <defs>
                                <linearGradient id="grad-muscle" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#fda4af" stopOpacity="0.1" />
                                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.45" />
                                </linearGradient>
                                <linearGradient id="grad-cardio" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.1" />
                                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
                                </linearGradient>
                                <linearGradient id="grad-organic" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.1" />
                                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                                </linearGradient>
                              </defs>
                            </svg>

                            <div className="absolute left-0 right-0 h-[2px] bg-blue-500/35 dark:bg-blue-400/40 animate-scan-y shadow-[0_0_12px_#3b82f6]" />

                            {showPins && (
                              <>
                                <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 group/pin z-10 cursor-pointer">
                                  <span className="absolute inline-flex h-4 w-4 rounded-full bg-blue-500/40 animate-ping" />
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 border border-white" />
                                </div>
                                <div className="absolute top-[65%] left-[45%] -translate-x-1/2 -translate-y-1/2 group/pin z-10 cursor-pointer">
                                  <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-500/40 animate-ping" />
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 border border-white" />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </motion.div>

                      <div className="absolute top-3 left-4 text-[9px] font-mono text-slate-500 flex flex-col pointer-events-none gap-0.5">
                        <span>COORD: X=104.5 Y=308.2</span>
                        <span>GRID_VAL: L{selectedStructure.region.substring(0, 3).toUpperCase()}</span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                          {selectedStructure.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          ROT: {rotation}° | ZOOM: {zoom.toFixed(1)}x
                        </span>
                      </div>
                    </div>

                    {/* HUD Controllers */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-150/40 dark:border-slate-850/40">
                      <div className="sm:col-span-8 flex flex-col gap-3">
                        {/* Angle */}
                        <div className="flex items-center gap-3">
                          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 w-10 uppercase tracking-wider font-mono">Angle</span>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={rotation}
                            onChange={(e) => setRotation(parseInt(e.target.value))}
                            className="flex-1 h-1 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-550 w-8 text-right">{rotation}°</span>
                        </div>

                        {/* Exposure */}
                        <div className="flex items-center gap-3">
                          <Sun className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 w-10 uppercase tracking-wider font-mono">Exposure</span>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={brightness}
                            onChange={(e) => setBrightness(parseInt(e.target.value))}
                            className="flex-1 h-1 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-550 w-8 text-right">{brightness}%</span>
                        </div>
                      </div>

                      <div className="sm:col-span-4 flex sm:flex-col justify-between sm:justify-start gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                        <div className="flex gap-1.5 w-full">
                          <button
                            onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                            className="flex-1 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 cursor-pointer"
                            title="Zoom Out"
                          >
                            <ZoomOut className="w-3.5 h-3.5 mx-auto" />
                          </button>
                          <button
                            onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                            className="flex-1 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 cursor-pointer"
                            title="Zoom In"
                          >
                            <ZoomIn className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </div>

                        <div className="flex gap-1.5 w-full">
                          <button
                            onClick={() => setIsXrayOverlay(!isXrayOverlay)}
                            className={`flex-1 py-1 text-[9px] font-bold rounded-lg border uppercase tracking-wider transition-all cursor-pointer ${
                              isXrayOverlay
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-550 hover:bg-slate-50"
                            }`}
                          >
                            Fluoroscopy
                          </button>
                          <button
                            onClick={() => {
                              setZoom(1);
                              setRotation(0);
                              setBrightness(100);
                              setIsXrayOverlay(false);
                              setShowPins(true);
                            }}
                            className="flex-1 py-1 text-[9px] font-bold rounded-lg border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-550 hover:bg-slate-100 uppercase tracking-wider cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Quick Navigator Anchor Tabs Bar */}
          <div className="sticky top-[10px] z-20 bg-slate-50/90 dark:bg-slate-900/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest pl-2 pr-1 select-none shrink-0 font-mono">Jump to:</span>
            {[
              { id: 1, label: "Image", icon: ImageIcon },
              { id: 5, label: "Location", icon: Compass },
              { id: 8, label: "Vessels", icon: Droplet },
              { id: 9, label: "Nerves", icon: Zap },
              { id: 11, label: "Clinical", icon: AlertTriangle },
              { id: 12, label: "Radiology", icon: Scan },
              { id: 16, label: "Viva Prep", icon: MessageSquare },
              { id: 17, label: "MCQs", icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setExpandedSection(tab.id);
                    setTimeout(() => {
                      const el = document.getElementById(`anatomy-sec-${tab.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }, 150);
                  }}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    expandedSection === tab.id
                      ? "bg-blue-600 text-white border border-blue-600 shadow-xs"
                      : "bg-white dark:bg-slate-950 text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-slate-850 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900"
                  }`}
                >
                  <Icon className={`w-3 h-3 ${expandedSection === tab.id ? "text-white" : "text-slate-400 dark:text-slate-550"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sections 2 to 20 Collapsible Accordion Template */}
          {[
            {
              id: 2,
              title: "Scientific Name",
              icon: BookOpen,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 font-semibold">Latin Nomina Anatomica</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 italic">{enriched.scientificName || "N/A"}</p>
                </div>
              )
            },
            {
              id: 3,
              title: "Common Name",
              icon: Compass,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Vulgarly Referred To As</span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{enriched.commonName || selectedStructure.name}</p>
                </div>
              )
            },
            {
              id: 4,
              title: "Body System",
              icon: Grid,
              content: (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Systemic Classification</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                      {enriched.system || "Skeletal System"}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">- Region: {selectedStructure.region}</span>
                  </div>
                </div>
              )
            },
            {
              id: 5,
              title: "Location",
              icon: Compass,
              content: (
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 font-semibold">Topographical Coordinates</span>
                    <p className="leading-relaxed text-slate-650 dark:text-slate-350">{enriched.location || "N/A"}</p>
                  </div>
                  {(enriched.boundaries || enriched.relations) && (
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-900">
                      {enriched.boundaries && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Boundaries</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-normal">{enriched.boundaries}</p>
                        </div>
                      )}
                      {enriched.relations && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Anatomical Relations</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-normal">{enriched.relations}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            },
            {
              id: 6,
              title: "Definition",
              icon: Info,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 font-semibold">Standard Description</span>
                  <p className="leading-relaxed text-slate-650 dark:text-slate-350">{selectedStructure.description}</p>
                </div>
              )
            },
            {
              id: 7,
              title: "Features",
              icon: FileText,
              content: (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 font-semibold">Distinctive Surface Anatomy & Features</span>
                    <p className="leading-relaxed text-slate-650 dark:text-slate-350">
                      {enriched.surfaceAnatomy || "Palpable landmarks and surface contours relative to bony ridges and deep fascial layers."}
                    </p>
                  </div>
                  {enriched.commonDiseases && (
                    <div className="p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10 flex flex-col gap-1 mt-1">
                      <span className="text-[9px] font-mono font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Common Pathologies</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">{enriched.commonDiseases}</p>
                    </div>
                  )}
                </div>
              )
            },
            {
              id: 8,
              title: "Blood Supply",
              icon: Droplet,
              content: (
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 font-semibold">Vascular Inflow & Outflow</span>
                  <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                    <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 shrink-0">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-red-600 dark:text-red-400 font-extrabold uppercase tracking-wider">Main Arterial Supply</span>
                      <p className="text-slate-700 dark:text-slate-300 font-semibold mt-0.5">{selectedStructure.bloodSupply}</p>
                    </div>
                  </div>
                  {enriched.lymphaticDrainage && (
                    <div className="p-3.5 bg-teal-500/5 rounded-xl border border-teal-500/10 flex flex-col gap-1">
                      <span className="text-[9px] font-mono font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Lymphatic Drainage</span>
                      <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-normal">{enriched.lymphaticDrainage}</p>
                    </div>
                  )}
                </div>
              )
            },
            {
              id: 9,
              title: "Nerve Supply",
              icon: Zap,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 font-semibold">Innervation & Reflexes</span>
                  <div className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wider">Nerve Supply / Innervation</span>
                      <p className="text-slate-700 dark:text-slate-300 font-semibold mt-0.5">{selectedStructure.innervation}</p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 10,
              title: "Function",
              icon: PlayCircle,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Biomechanical & Physiological Role</span>
                  <p className="leading-relaxed text-slate-650 dark:text-slate-350">{enriched.function || "N/A"}</p>
                </div>
              )
            },
            {
              id: 11,
              title: "Clinical Importance",
              icon: AlertTriangle,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Clinical Significance</span>
                  <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="leading-relaxed text-slate-650 dark:text-slate-350">{selectedStructure.clinicalImportance}</p>
                  </div>
                </div>
              )
            },
            {
              id: 12,
              title: "Radiological Appearance",
              icon: Scan,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Diagnostic Imaging Overview</span>
                  <p className="leading-relaxed text-slate-650 dark:text-slate-350">{enriched.radiologicalAppearance || "N/A"}</p>
                </div>
              )
            },
            {
              id: 13,
              title: "X-ray Appearance",
              icon: FileText,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Fluoroscopic / X-ray Position</span>
                  <p className="leading-relaxed text-slate-650 dark:text-slate-350 font-semibold">{enriched.xrayView || "N/A"}</p>
                </div>
              )
            },
            {
              id: 14,
              title: "CT Appearance",
              icon: Grid,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Computed Tomography (CT) Hounsfield Units</span>
                  <p className="leading-relaxed text-slate-650 dark:text-slate-350">{enriched.ctAppearance || "N/A"}</p>
                </div>
              )
            },
            {
              id: 15,
              title: "MRI Appearance",
              icon: Layers,
              content: (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Magnetic Resonance (MRI) T1/T2 Signal Profiles</span>
                  <p className="leading-relaxed text-slate-650 dark:text-slate-350">{enriched.mriAppearance || "N/A"}</p>
                </div>
              )
            },
            {
              id: 16,
              title: "Common Viva Questions",
              icon: MessageSquare,
              content: (
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">University Board Oral Examination Prep</span>
                  <div className="flex flex-col gap-3">
                    {enriched.commonExamQuestions && enriched.commonExamQuestions.length > 0 ? (
                      enriched.commonExamQuestions.map((eq, i) => (
                        <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-850">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Q: {eq.question}</p>
                          <p className="text-[11px] text-slate-650 dark:text-slate-400 mt-1.5 pl-3 border-l-2 border-blue-500 leading-relaxed">{eq.answer}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic text-xs">No questions loaded.</p>
                    )}
                  </div>
                </div>
              )
            },
            {
              id: 17,
              title: "Important MCQs",
              icon: Award,
              content: (
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Active-Recall Knowledge Self-Assessment</span>
                  <div className="flex flex-col gap-4">
                    {enriched.importantMcqs && enriched.importantMcqs.length > 0 ? (
                      enriched.importantMcqs.map((q, idx) => {
                        const answersForStructure = activeQuizAnswers[selectedStructure.id] || {};
                        const selectedIdx = answersForStructure[idx];
                        const isSelected = selectedIdx !== undefined;
                        return (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850/60 flex flex-col gap-3">
                            <div className="flex items-start gap-2">
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 mt-0.5">MCQ {idx + 1}</span>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-normal">{q.question}</p>
                            </div>
                            
                            <div className="flex flex-col gap-2 pl-6">
                              {q.options.map((opt, oIdx) => {
                                const isCorrect = oIdx === q.correctIndex;
                                const isChosen = oIdx === selectedIdx;
                                let optionStyle = "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-350";
                                if (isSelected) {
                                  if (isCorrect) optionStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold";
                                  else if (isChosen) optionStyle = "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 font-bold";
                                  else optionStyle = "opacity-50 border-slate-200 dark:border-slate-800 text-slate-400";
                                }
                                return (
                                  <button
                                    key={oIdx}
                                    disabled={isSelected}
                                    onClick={() => {
                                      setActiveQuizAnswers(prev => ({
                                        ...prev,
                                        [selectedStructure.id]: {
                                          ...(prev[selectedStructure.id] || {}),
                                          [idx]: oIdx
                                        }
                                      }));
                                      triggerToast(oIdx === q.correctIndex ? "Correct Answer!" : "Incorrect Answer.");
                                    }}
                                    className={`w-full text-left p-2.5 rounded-xl border text-[11px] transition-all flex items-center justify-between font-medium cursor-pointer ${optionStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isSelected && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[10.5px] text-slate-650 dark:text-slate-400 leading-normal mt-1 flex gap-2"
                              >
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-blue-600 dark:text-blue-400">Explanation:</span> {q.explanation}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-400 italic text-xs">No active MCQ banks available for this structure yet.</p>
                    )}
                  </div>
                </div>
              )
            },
            {
              id: 18,
              title: "Related Structures",
              icon: GitPullRequest,
              content: (
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-555 font-semibold">Syntopic & Segmentally Aligned Anatomy</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedStructure.relatedStructures && selectedStructure.relatedStructures.length > 0 ? (
                      selectedStructure.relatedStructures.map((relId) => {
                        const matchedStr = anatomicalStructures.find(str => str.id === relId);
                        return (
                          <button
                            key={relId}
                            onClick={() => {
                              setSelectedStructureId(relId);
                              setExpandedSection(1); // Auto open image view on click
                              triggerToast(`Navigated to ${matchedStr?.name || relId}`);
                            }}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 dark:bg-slate-900/40 dark:hover:bg-blue-950/20 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all text-xs font-bold cursor-pointer"
                          >
                            {matchedStr ? matchedStr.name : relId}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-slate-550 italic text-xs">No segmentally aligned records found.</p>
                    )}
                  </div>
                </div>
              )
            },
            {
              id: 19,
              title: "Related Notes",
              icon: FileText,
              content: (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Award className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Lecture Notes & Smart study guide</span>
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-normal">
                    Access comprehensive smart study guides, and university syllabus summaries for "{selectedStructure.name}" in the integrated Lecture Notes System.
                  </p>
                  <button
                    onClick={() => {
                      const nTab = document.getElementById("nav-notes");
                      if (nTab) nTab.click();
                      triggerToast("Opened Notes System!");
                    }}
                    className="text-[10px] font-bold text-emerald-600 hover:underline dark:text-emerald-400 mt-1 self-start flex items-center gap-1 cursor-pointer font-sans"
                  >
                    Open Lecture Notes <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )
            },
            {
              id: 20,
              title: "Related Quiz",
              icon: HelpCircle,
              content: (
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <HelpCircle className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Radiology Quiz Session</span>
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-normal">
                    Test your memory with the standard curriculum-wise radiology question banks and track your performance records.
                  </p>
                  <button
                    onClick={() => {
                      const qTab = document.getElementById("nav-quizzes");
                      if (qTab) qTab.click();
                      triggerToast("Opened Exam Center!");
                    }}
                    className="text-[10px] font-bold text-rose-600 hover:underline dark:text-rose-400 mt-1 self-start flex items-center gap-1 cursor-pointer font-sans"
                  >
                    Go to Curriculum Exams <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )
            }
          ].map((sec) => {
            const Icon = sec.icon;
            const isSecExpanded = expandedSection === sec.id;
            return (
              <div
                key={sec.id}
                id={`anatomy-sec-${sec.id}`}
                className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(isSecExpanded ? null : sec.id)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all text-left font-sans cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold px-2 py-0.5 rounded-md font-mono">
                      {sec.id}
                    </span>
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {sec.title}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSecExpanded ? "rotate-180" : "rotate-0"}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isSecExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100 dark:border-slate-900"
                    >
                      <div className="p-5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                        {sec.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* BOTTOM NAVIGATION FOR GUIDED STUDY */}
          <div id="anatomy-lesson-bottom-nav" className="mt-8 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            {/* Previous Button */}
            {previousTopic ? (
              <button
                onClick={() => {
                  setSelectedStructureId(previousTopic.id);
                  setExpandedSection(1); // Auto open image view on click
                  triggerToast(`Navigating to ${previousTopic.name}...`);
                  if (!expandedCategories.includes(previousTopic.category)) {
                    setExpandedCategories(prev => [...prev, previousTopic.category]);
                  }
                }}
                className="flex items-center gap-2.5 px-4.5 py-3 rounded-2xl bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-250 dark:border-slate-800 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-xs cursor-pointer shadow-xs active:scale-95"
              >
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">←</span>
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="text-[9px] text-slate-450 uppercase tracking-wider font-semibold font-mono">Previous Lesson</span>
                  <span className="text-wrap break-words whitespace-normal max-w-[150px] font-sans font-extrabold">{previousTopic.name}</span>
                </div>
              </button>
            ) : (
              <div className="w-[1px] h-10 hidden sm:block" />
            )}

            {/* Mark Complete */}
            <div className="flex flex-col items-center gap-1.5 self-center">
              <button
                onClick={() => {
                  const nextStatus = currentProgress === "completed" ? "not_started" : "completed";
                  updateProgress(selectedStructure.id, nextStatus);
                  triggerToast(nextStatus === "completed" ? `Awesome! Completed "${selectedStructure.name}"!` : `Marked "${selectedStructure.name}" as incomplete.`);
                }}
                className={`px-5 py-2.5 rounded-2xl border flex items-center gap-2 font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95 ${
                  currentProgress === "completed"
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 animate-pulse"
                    : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-250 dark:border-slate-800 hover:border-emerald-500/30 hover:text-emerald-600"
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${currentProgress === "completed" ? "fill-white/20 text-white" : "text-slate-400"}`} />
                <span>{currentProgress === "completed" ? "Completed • Undo" : "Mark as Completed"}</span>
              </button>
              <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500 uppercase font-bold">
                Status: <span className={currentProgress === "completed" ? "text-emerald-500" : currentProgress === "in_progress" ? "text-amber-500" : "text-slate-400"}>
                  {currentProgress.replace("_", " ")}
                </span>
              </span>
            </div>

            {/* Next Button */}
            {nextTopic ? (
              <button
                onClick={() => {
                  setSelectedStructureId(nextTopic.id);
                  setExpandedSection(1); // Auto open image view on click
                  triggerToast(`Navigating to ${nextTopic.name}...`);
                  if (!expandedCategories.includes(nextTopic.category)) {
                    setExpandedCategories(prev => [...prev, nextTopic.category]);
                  }
                }}
                className="flex items-center justify-between gap-2.5 px-4.5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white border border-transparent transition-all font-bold text-xs cursor-pointer shadow-md shadow-blue-500/10 active:scale-95"
              >
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="text-[9px] text-blue-200/80 uppercase tracking-wider font-semibold font-mono">Next Lesson</span>
                  <span className="text-wrap break-words whitespace-normal max-w-[150px] font-sans font-extrabold text-white">{nextTopic.name}</span>
                </div>
                <span className="text-sm font-bold text-blue-200">→</span>
              </button>
            ) : (
              <div className="w-[1px] h-10 hidden sm:block" />
            )}
          </div>

          {/* RELATED COURSEWARE CONNECTIONS */}
          <div id="anatomy-related-materials" className="mt-2 p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-col gap-4 animate-premium-fade">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-900">
              <Grid className="w-4 h-4 text-blue-600 dark:text-blue-450" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-200">
                Related Courseware & Integrations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Related Anatomy */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850/50 flex flex-col justify-between min-h-[120px] transition-all hover:bg-white dark:hover:bg-slate-900/50 hover:border-indigo-500/30 group">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded uppercase tracking-wider self-start">
                    Related Anatomy
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200 mt-1.5 group-hover:text-indigo-600 transition-colors">
                    Syntopic Anatomical Connections
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    Explore adjacent bony structures and joint systems of the {selectedStructure.name}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {selectedStructure.relatedStructures && selectedStructure.relatedStructures.length > 0 ? (
                    selectedStructure.relatedStructures.slice(0, 2).map((relId) => {
                      const matchedStr = anatomicalStructures.find(str => str.id === relId);
                      return (
                        <button
                          key={relId}
                          onClick={() => {
                            setSelectedStructureId(relId);
                            setExpandedSection(1);
                            triggerToast(`Navigating to ${matchedStr?.name || relId}...`);
                          }}
                          className="text-[10px] font-extrabold text-indigo-600 hover:underline dark:text-indigo-400 flex items-center gap-0.5 cursor-pointer text-left"
                        >
                          {matchedStr ? matchedStr.name : relId} →
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-[10px] text-slate-400 italic font-medium">No direct connections.</span>
                  )}
                </div>
              </div>

              {/* Related Radiology */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850/50 flex flex-col justify-between min-h-[120px] transition-all hover:bg-white dark:hover:bg-slate-900/50 hover:border-blue-500/30 group">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded uppercase tracking-wider self-start">
                    Related Radiology
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200 mt-1.5 group-hover:text-blue-600 transition-colors">
                    Fluoroscopy & Diagnostic Imaging
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    View CT densities, MRI profiles, and standard positioning techniques.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setExpandedSection(12);
                    setTimeout(() => {
                      document.getElementById("anatomy-sec-12")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 150);
                  }}
                  className="text-[10px] font-extrabold text-blue-600 hover:underline dark:text-blue-400 text-left mt-2.5 flex items-center gap-0.5 cursor-pointer"
                >
                  Open Radiological Profiles <ChevronRight className="w-3 h-3 inline" />
                </button>
              </div>

              {/* Related Notes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850/50 flex flex-col justify-between min-h-[120px] transition-all hover:bg-white dark:hover:bg-slate-900/50 hover:border-emerald-500/30 group">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase tracking-wider self-start">
                    Related Notes
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200 mt-1.5 group-hover:text-emerald-600 transition-colors">
                    Curriculum Lecture Notes
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    Access high-yield semester study guides and detailed anatomy cards.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate("notes");
                    } else {
                      const noteTab = document.getElementById("nav-notes");
                      if (noteTab) noteTab.click();
                    }
                    triggerToast(`Opening notes folder for ${selectedStructure.name}...`);
                  }}
                  className="text-[10px] font-extrabold text-emerald-600 hover:underline dark:text-emerald-400 text-left mt-2.5 flex items-center gap-0.5 cursor-pointer"
                >
                  Go to Lecture Notes Directory <ChevronRight className="w-3 h-3 inline" />
                </button>
              </div>

              {/* Related Quiz */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850/50 flex flex-col justify-between min-h-[120px] transition-all hover:bg-white dark:hover:bg-slate-900/50 hover:border-rose-500/30 group">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded uppercase tracking-wider self-start">
                    Related Quiz
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200 mt-1.5 group-hover:text-rose-600 transition-colors">
                    Curriculum Question Banks
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    Assess your active-recall mastery with clinical radiography quizzes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate("quizzes");
                    } else {
                      const quizTab = document.getElementById("nav-quizzes");
                      if (quizTab) quizTab.click();
                    }
                    triggerToast(`Launching quiz module...`);
                  }}
                  className="text-[10px] font-extrabold text-rose-600 hover:underline dark:text-rose-400 text-left mt-2.5 flex items-center gap-0.5 cursor-pointer"
                >
                  Launch Interactive Quiz <ChevronRight className="w-3 h-3 inline" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            RIGHT PANEL: QUICK FACTS, QUIZ, NOTES, BOOKMARKS
            ==================================================== */}
        <div id="anatomy-right-sidebar" className="lg:col-span-3 flex flex-col gap-5">
          
          {/* Premium Sticky Control Deck */}
          <div className="sticky top-[10px] z-10 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Study Control Deck
              </span>
              <span className="text-[10px] bg-blue-600/10 text-blue-600 font-bold px-2.5 py-0.5 rounded-full font-mono">
                CONSOLE
              </span>
            </div>

            {/* Learning Progress Status Segmented Control */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Learning Progress</span>
              <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-150 dark:border-slate-850/40">
                {[
                  { key: "not_started", label: "Start", color: "bg-slate-250 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold" },
                  { key: "in_progress", label: "Studying", color: "bg-amber-500 text-white shadow-xs font-bold" },
                  { key: "completed", label: "Done", color: "bg-emerald-500 text-white shadow-xs font-bold" }
                ].map((item) => {
                  const currentStatus = learningProgress[selectedStructure.id] || "not_started";
                  const isActive = currentStatus === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        updateProgress(selectedStructure.id, item.key as any);
                        triggerToast(`Marked ${selectedStructure.name} as ${item.label}!`);
                      }}
                      className={`py-1.5 text-[10px] rounded-lg transition-all cursor-pointer text-center ${
                        isActive 
                          ? item.color
                          : "text-slate-400 dark:text-slate-500 hover:text-slate-750 dark:hover:text-slate-300 font-medium"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Control Buttons Grid */}
            <div className="flex flex-col gap-2 mt-1">
              {/* Bookmark Toggle */}
              <button
                onClick={() => toggleBookmark(selectedStructure.id)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  bookmarkedParts.includes(selectedStructure.id)
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedParts.includes(selectedStructure.id) ? "fill-amber-500 text-amber-500" : "text-slate-400"}`} />
                  <span>Bookmark Structure</span>
                </div>
                {bookmarkedParts.includes(selectedStructure.id) && (
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                )}
              </button>

              {/* Download Notes */}
              <button
                onClick={handleDownloadNotes}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-bold text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Study Notes (.MD)</span>
              </button>

              {/* Take Quiz (scroll to quiz card) */}
              <button
                onClick={() => {
                  setExpandedSection(17);
                  setTimeout(() => {
                    const qEl = document.getElementById("anatomy-sec-17");
                    if (qEl) {
                      qEl.scrollIntoView({ behavior: "smooth", block: "center" });
                      triggerToast("Scrolled to Active-Recall MCQs!");
                    }
                  }, 150);
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-bold text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Take Active-Recall Quiz</span>
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `RadioVerse: ${selectedStructure.name}`,
                      text: `Study the anatomical structures, blood supply, and radiology appearance of the ${selectedStructure.name} on RadioVerse!`,
                      url: window.location.href
                    }).catch(err => console.log(err));
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    triggerToast("Sharing link copied to clipboard!");
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-bold text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Reference Link</span>
              </button>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div id="quick-facts-card" className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Quick Facts
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-0.5 rounded-full font-mono">
                FACT_SHEET
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-350">
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/40">
                <span className="text-slate-450">Difficulty</span>
                <span className={`font-semibold px-2 py-0.5 rounded-md ${
                  selectedStructure.difficulty === "Beginner"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : selectedStructure.difficulty === "Intermediate"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}>
                  {selectedStructure.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/40">
                <span className="text-slate-450">Anatomical System</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {selectedStructure.category}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-900/40">
                <span className="text-slate-450">Body Region</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedStructure.region}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-450">Suggested Study</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedStructure.studyTime}
                </span>
              </div>
            </div>

            {/* Bookmarks Toggle button & Download Notes button */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                id="btn-bookmark-toggle"
                onClick={() => toggleBookmark(selectedStructure.id)}
                className={`py-2 text-[10px] font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  bookmarkedParts.includes(selectedStructure.id)
                    ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedParts.includes(selectedStructure.id) ? "fill-amber-600" : ""}`} />
                <span>{bookmarkedParts.includes(selectedStructure.id) ? "Bookmarked" : "Bookmark"}</span>
              </button>

              <button
                id="btn-download-study-notes"
                onClick={handleDownloadNotes}
                className="py-2 text-[10px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-350 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Notes (.MD)</span>
              </button>
            </div>
          </div>

          {/* Clinical Quiz Module (Fully Functional & Integrated) */}
          <div id="quiz-module-card" className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                Clinical Quiz
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full font-mono">
                ACTIVE
              </span>
            </div>

            {selectedStructure.quizQuestions && selectedStructure.quizQuestions.length > 0 ? (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider font-mono uppercase">
                  QUESTION FOR {selectedStructure.name.toUpperCase()}
                </span>
                
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900">
                  {selectedStructure.quizQuestions[0].question}
                </p>

                {/* Option selection */}
                <div className="flex flex-col gap-2 mt-1">
                  {selectedStructure.quizQuestions[0].options.map((option, idx) => {
                    const status = quizScore[selectedStructure.id];
                    const isAnswered = !!status;
                    const isSelected = isAnswered && status.selectedIndex === idx;
                    const isCorrectOption = selectedStructure.quizQuestions[0].correctIndex === idx;

                    return (
                      <button
                        key={idx}
                        id={`btn-quiz-option-${idx}`}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex items-center justify-between ${
                          isSelected
                            ? status.correct
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "bg-red-500/15 border-red-500 text-red-800 dark:text-red-300 font-semibold"
                            : isAnswered && isCorrectOption
                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-semibold"
                            : isAnswered
                            ? "border-slate-100 dark:border-slate-900 opacity-60 text-slate-400"
                            : "border-slate-150 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                        }`}
                      >
                        <span className="pr-1">{option}</span>
                        {isAnswered && isCorrectOption && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        )}
                        {isSelected && !status.correct && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quiz Explanation */}
                {quizScore[selectedStructure.id]?.answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-blue-500/5 border border-blue-500/15 text-slate-750 dark:text-slate-300 rounded-xl mt-1 text-[11px] leading-relaxed"
                  >
                    <strong className="text-blue-700 dark:text-blue-400 block mb-1">Clinical Insight:</strong>
                    {selectedStructure.quizQuestions[0].explanation}
                    <button
                      id="btn-quiz-reset"
                      onClick={handleResetQuiz}
                      className="mt-2.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline block"
                    >
                      Reset Question
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic py-4 text-center">
                Quiz for this structure is currently being designed.
              </p>
            )}
          </div>

          {/* FUTURE READY ACADEMIC TRACKER CARD */}
          <div id="future-ready-tracker-card" className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Academic Tracker
              </span>
              <span className="text-[9px] bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                Active Logs
              </span>
            </div>

            {/* Continue Learning Widget */}
            <div className="flex flex-col gap-1 bg-blue-500/5 p-3 rounded-2xl border border-blue-500/10">
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">Continue Learning</span>
              {recentlyViewed.length > 1 ? (
                <div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    Last up: {anatomicalStructures.find(s => s.id === recentlyViewed[1])?.name || "Next Topic"}
                  </p>
                  <button
                    onClick={() => {
                      const prevId = recentlyViewed[1];
                      setSelectedStructureId(prevId);
                      setExpandedSection(1);
                      triggerToast(`Resuming study of ${anatomicalStructures.find(s => s.id === prevId)?.name || prevId}`);
                      const matchedObj = anatomicalStructures.find(s => s.id === prevId);
                      if (matchedObj && !expandedCategories.includes(matchedObj.category)) {
                        setExpandedCategories(prev => [...prev, matchedObj.category]);
                      }
                    }}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1 flex items-center gap-0.5 cursor-pointer text-left font-sans"
                  >
                    Resume Session →
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-450 italic">Select structures to build progress.</p>
              )}
            </div>

            {/* Recently Viewed */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Recently Viewed</span>
              <div className="flex flex-col gap-1">
                {recentlyViewed.slice(0, 3).map((viewId) => {
                  const viewObj = anatomicalStructures.find(s => s.id === viewId);
                  if (!viewObj) return null;
                  return (
                    <button
                      key={viewId}
                      onClick={() => {
                        setSelectedStructureId(viewId);
                        setExpandedSection(1);
                        triggerToast(`Navigated to ${viewObj.name}`);
                        if (!expandedCategories.includes(viewObj.category)) {
                          setExpandedCategories(prev => [...prev, viewObj.category]);
                        }
                      }}
                      className="w-full text-left p-1.5 px-2.5 rounded-xl border border-slate-100 dark:border-slate-900/60 text-[10px] text-slate-650 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-900 flex justify-between items-center cursor-pointer transition-colors"
                    >
                      <span className="truncate">{viewObj.name}</span>
                      <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Learning History Logs */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Session Study Log</span>
              <div className="max-h-[100px] overflow-y-auto pr-1 flex flex-col gap-1 scrollbar-thin">
                {learningHistory.slice(0, 5).map((log, i) => (
                  <div key={i} className="text-[9px] font-mono text-slate-450 dark:text-slate-500 py-0.5 border-b border-slate-50 dark:border-slate-900/40 last:border-0 leading-tight">
                    {log}
                  </div>
                ))}
                {learningHistory.length === 0 && (
                  <span className="text-[9px] text-slate-400 italic">No activity recorded yet.</span>
                )}
              </div>
            </div>
          </div>

          {/* Saved Bookmarks Navigation list */}
          <div id="saved-bookmarks-panel" className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block pb-1 border-b border-slate-100 dark:border-slate-900">
              Personal Study Folder
            </span>
            
            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto scrollbar-thin">
              {bookmarkedParts.map((bookmarkId) => {
                const bookmarkedObj = anatomicalStructures.find(s => s.id === bookmarkId);
                if (!bookmarkedObj) return null;
                return (
                  <button
                    key={bookmarkId}
                    id={`btn-bookmark-nav-${bookmarkId}`}
                    onClick={() => {
                      setSelectedStructureId(bookmarkId);
                      setSearchQuery("");
                      // Autoexpand the category
                      if (!expandedCategories.includes(bookmarkedObj.category)) {
                        setExpandedCategories(prev => [...prev, bookmarkedObj.category]);
                      }
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedStructureId === bookmarkId
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <span className="truncate">{bookmarkedObj.name}</span>
                    <span className="text-[9px] text-slate-400 capitalize">{bookmarkedObj.category.substring(0, 4)}</span>
                  </button>
                );
              })}
              
              {bookmarkedParts.length === 0 && (
                <div className="text-center py-6 text-slate-400 italic text-[11px]">
                  No bookmarks saved. Click "Bookmark" above to add study items to your folder.
                </div>
              )}
            </div>
          </div>

          {/* Related Topics navigation */}
          <div id="related-topics-card" className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850/85 shadow-xs flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 block pb-1 border-b border-slate-100 dark:border-slate-900">
              Quick Reference Topics
            </span>
            
            <div className="flex flex-col gap-1 text-[11px] text-slate-600 dark:text-slate-450 mt-1">
              {[
                { label: "Radiology Anatomy Atlas", query: "CT" },
                { label: "Bony Fractures Classification", query: "Colles" },
                { label: "Clinical Pathology Rules", query: "Pneumothorax" }
              ].map((topic, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-900/40 last:border-0"
                >
                  <span>{topic.label}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Ref: {topic.query}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
