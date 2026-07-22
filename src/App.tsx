/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, BookOpen, Sparkles, Database, FileText, Bot, Award, Clock, 
  HelpCircle, Settings, Menu, X, Check, Search, CloudOff, Wifi, Moon, Sun, 
  GraduationCap, Play, Info, Flame, Star, Download, Bookmark, Terminal, ChevronRight, Activity
} from "lucide-react";

// Import modules
import InteractiveAnatomy from "./components/InteractiveAnatomy";
import RadiologyModule from "./components/RadiologyModule";
import NotesSystem from "./components/NotesSystem";
import QuizSystem from "./components/QuizSystem";
import NewsCareer from "./components/NewsCareer";
import StudentDashboard from "./components/StudentDashboard";
import StudyPlanner from "./components/StudyPlanner";
import ContactAdmin from "./components/ContactAdmin";
import DoubtSolver from "./components/DoubtSolver";

export default function App() {
  // Navigation Routing
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  // Close AI Coach on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAICoachOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Global settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ title: string; tab: string; cat: string }>>([]);

  // Search indexing
  const searchableTopics = [
    { title: "Thoracic cage & ribs anatomy", tab: "anatomy", cat: "Anatomy" },
    { title: "Respiratory lung boundaries", tab: "anatomy", cat: "Anatomy" },
    { title: "X-Ray tube cathode filament", tab: "radiology", cat: "Radiology Physics" },
    { title: "Anode target nickel cup settings", tab: "radiology", cat: "Radiology Physics" },
    { title: "ALARA radiation dose shielding", tab: "radiology", cat: "Radiology Safety" },
    { title: "Chest PA posteroanterior projection", tab: "radiology", cat: "Clinical Cases" },
    { title: "Shoulder AP clavicle projection", tab: "radiology", cat: "Clinical Cases" },
    { title: "CT Hounsfield unit windowing simulator", tab: "radiology", cat: "CT Imaging" },
    { title: "MRI T1 & T2 sequence weighting", tab: "radiology", cat: "MRI Imaging" },
    { title: "Interactive AI MCQ generator", tab: "quizzes", cat: "Exams" },
    { title: "Semester-wise clinical lecture notes", tab: "notes", cat: "Notes" },
    { title: "Study timer & Pomodoro suite", tab: "planner", cat: "Planner" },
    { title: "Radiology Breakthroughs & Careers", tab: "news", cat: "Careers" }
  ];

  // Perform search
  useEffect(() => {
    if (!globalSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = searchableTopics.filter(t => 
      t.title.toLowerCase().includes(globalSearchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [globalSearchQuery]);

  // Keyboard shortcut (Cmd + K or Ctrl + K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dark mode class toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const navItems = [
    { id: "home", label: "Overview Hub", icon: Compass },
    { id: "anatomy", label: "Interactive Anatomy", icon: BookOpen },
    { id: "radiology", label: "Radiology Suite", icon: Database },
    { id: "quizzes", label: "Curriculum Exams", icon: HelpCircle },
    { id: "notes", label: "Notes & smart Synthesis", icon: FileText },
    { id: "news", label: "Bulletin & Careers", icon: GraduationCap },
    { id: "dashboard", label: "Academic Profile", icon: Award },
    { id: "planner", label: "Study Planner", icon: Clock },
    { id: "support", label: "Help & Admin", icon: Settings }
  ];

  return (
    <div className="min-h-screen font-sans antialiased transition-colors duration-200 bg-page-bg text-primary-text">
      
      {/* 1. Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#090D16]/85 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-900/60 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-150 font-display">
                Radio<span className="text-blue-600">Verse</span>
              </h1>
              <span className="text-[9px] text-slate-400 block -mt-1 font-mono uppercase font-bold tracking-widest">B.Sc. Radiology</span>
            </div>
          </div>

          {/* Search bar desktop */}
          <div className="hidden md:flex items-center relative flex-1 max-w-md mx-8">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              id="global-search"
              type="text"
              placeholder="Search chapters, physics, safety... (Press ⌘K)"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 bg-slate-100 dark:bg-[#121A2C] border-none rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-150"
            />
            <kbd className="absolute right-3.5 px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800/80 rounded text-[9px] font-mono text-slate-400 font-bold border border-slate-300/30">
              ⌘K
            </kbd>
            
            {/* Search results overlay */}
            {searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white dark:bg-[#101726] border border-slate-200/75 dark:border-slate-850 rounded-2xl shadow-xl p-2.5 flex flex-col gap-1 z-50 animate-fade-in">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(res.tab);
                      setGlobalSearchQuery("");
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 text-xs flex justify-between items-center transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{res.title}</span>
                    <span className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{res.cat}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3">
            
            {/* Student Rank Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 rounded-full text-[11px] font-bold border border-blue-100/50 dark:border-blue-900/20">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
              Level 14 • 2,450 XP
            </div>

            {/* Offline Simulator Switch */}
            <button
              id="btn-offline-mode"
              onClick={() => {
                setOfflineMode(!offlineMode);
              }}
              className={`p-2 rounded-full border flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                offlineMode
                  ? "bg-amber-500/10 border-amber-400 text-amber-600"
                  : "bg-slate-100/60 border-none text-slate-500 dark:bg-[#121A2C]"
              }`}
              title={offlineMode ? "Offline Simulation Active" : "Go Offline (Saves Mobile Data)"}
            >
              {offlineMode ? (
                <>
                  <CloudOff className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="hidden lg:inline text-[9px] font-black tracking-wider uppercase">OFFLINE MODE</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-emerald-500" />
                  <span className="hidden lg:inline text-[9px] font-black tracking-wider uppercase text-slate-400">ONLINE</span>
                </>
              )}
            </button>

            {/* Dark Mode toggle */}
            <button
              id="btn-theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-slate-100/60 border-none dark:bg-[#121A2C] text-slate-500 dark:text-amber-400 rounded-full cursor-pointer transition-transform duration-200 active:scale-95"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Mobile Menu Toggle button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-slate-100 border-none text-slate-500 dark:bg-[#121A2C] rounded-full cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>

          </div>
        </div>
      </header>

      {/* 2. Page Content Layout Container with left Sidebar Navigation on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative">
        
        {/* Navigation Sidebar (Desktop view) */}
        <nav className="hidden md:flex md:col-span-3 flex-col gap-1.5 premium-card-design self-start">
          <span className="caption-text pl-3.5 mb-3 block">
            B.Sc. Radiography Syllabus
          </span>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`group w-full text-left px-4 py-3 rounded-2xl text-[12px] font-bold flex items-center gap-3.5 transition-all duration-300 hover:translate-x-1.5 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10 dark:shadow-none"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                }`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-6 border-t border-slate-100 dark:border-slate-900 pt-4 px-3.5 text-[10px] text-slate-400 leading-relaxed font-semibold">
            🎓 Accredited curriculum matching standard digital radiography profiles in Indian universities.
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden col-span-1 bg-white dark:bg-[#0E1321] p-5 rounded-3xl border border-slate-200/60 dark:border-slate-850 flex flex-col gap-1.5 z-35 shadow-lg">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  id={`m-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Primary Route Switcher Container */}
        <main className="col-span-1 md:col-span-9 flex flex-col gap-8">

          {/* OFFLINE ALERT OVERLAY BAR if active */}
          {offlineMode && (
            <div className="bg-amber-500/10 border border-amber-300/40 rounded-3xl p-5 flex gap-4 text-xs text-amber-850 dark:text-amber-200 animate-fade-in shadow-sm">
              <CloudOff className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5 text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[10px]">offline study mode enabled</span>
                By selecting offline mode, our server-side AI Reference Summarizer and AI Quiz Generator are suspended. The interactive anatomy skeleton viewer, physical X-Ray tube circuits, and standard chapter exams remain fully operational.
              </div>
            </div>
          )}

          {/* Route: Home/Overview */}
          {activeTab === "home" && (
            <div id="route-home" className="flex flex-col gap-8 animate-premium-fade">
              
              {/* Premium Universal Search Bar Container (Layer 2 surface but colored in light blue / grey) */}
              <div 
                id="homepage-premium-search" 
                className="bg-blue-50/60 dark:bg-slate-900/40 border border-blue-100/70 dark:border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col gap-5 justify-between transition-all duration-300"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Universal Curriculum Search</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                    Instantly query any specific topic, anatomy term, physics simulator configuration, or safety standard.
                  </p>
                </div>

                <div className="flex flex-col gap-6 w-full">
                  <div className="relative w-full">
                    <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                    <input
                      id="homepage-universal-search"
                      type="text"
                      placeholder="Search standard syllabus chapters, physics, safety guides... (Press ⌘K)"
                      value={globalSearchQuery}
                      onChange={(e) => setGlobalSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-16 py-3.5 bg-slate-100 dark:bg-[#121A2C] border border-slate-200/60 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-[#121A2C] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-bold transition-all shadow-inner"
                    />
                    <span className="hidden sm:inline-flex absolute right-4 top-4 px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[9px] font-mono text-slate-400 font-bold border border-slate-300/30">
                      ⌘K
                    </span>
                  </div>
                  
                  {/* Centered Quick Tags Block with equal spacing */}
                  <div className="flex flex-col items-center justify-center w-full gap-4 mt-2">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">
                      Quick Tags
                    </span>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                      {[
                        { label: "Anatomy", query: "Anatomy" },
                        { label: "Physics", query: "cathode" },
                        { label: "ALARA Safety", query: "ALARA" },
                        { label: "CT/MRI", query: "CT" }
                      ].map((tag) => (
                        <button
                          key={tag.label}
                          onClick={() => setGlobalSearchQuery(tag.query)}
                          className="px-5 h-[38px] rounded-xl bg-white dark:bg-[#121A2C] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-[11px] font-bold transition-all text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-200/60 dark:border-slate-800 hover:border-transparent dark:hover:border-transparent shadow-sm flex items-center justify-center min-w-[105px] select-none"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Search Results Overlay if user is typing */}
              {globalSearchQuery && searchResults.length > 0 && (
                <div className="w-full bg-slate-50/50 dark:bg-[#121A2C]/40 border border-slate-200/50 dark:border-slate-850/60 rounded-3xl p-5 flex flex-col gap-3 -mt-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="caption-text">Search Matches ({searchResults.length})</span>
                    <button onClick={() => setGlobalSearchQuery("")} className="text-[10px] text-red-500 font-bold hover:underline">Clear Search</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveTab(res.tab);
                          setGlobalSearchQuery("");
                        }}
                        className="p-4 bg-white dark:bg-[#0E1321] border border-slate-200/50 dark:border-slate-900 rounded-2xl hover:border-blue-500/80 hover:shadow-sm text-left text-xs transition-all flex justify-between items-center group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Compass className="w-4.5 h-4.5 text-blue-500 group-hover:rotate-12 transition-transform" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{res.title}</span>
                        </div>
                        <span className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{res.cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mission Hero Branding Card (Shaved off height, dark premium gradient, high readability contrast) */}
              <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#121824] rounded-3xl py-7 px-8 text-white flex items-center justify-between overflow-hidden shadow-lg min-h-[160px]">
                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-blue-400 bg-blue-950/50 border border-blue-900/30 px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Curriculum Portal
                  </span>
                  
                  <h2 className="primary-heading mb-2 text-white">
                    The Premium Educational Ecosystem for B.Sc. Radiology & Diagnostic Imaging
                  </h2>
                  
                  <p className="text-xs text-slate-200/90 leading-relaxed mb-5 font-medium max-w-md">
                    Master medical bone osteology, coordinate X-ray circuitry, simulate advanced CT windowing or MRI weighting sequences, and study safely with custom curriculum notes.
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      id="btn-quick-anatomy"
                      onClick={() => setActiveTab("anatomy")}
                      className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      Explore Anatomy Atlas
                    </button>
                    <button
                      id="btn-quick-radiology"
                      onClick={() => setActiveTab("radiology")}
                      className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm"
                    >
                      Open Radiology Suite
                    </button>
                  </div>
                </div>

                {/* Aesthetic wireframe graphics in hero background */}
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden lg:flex items-center justify-center">
                  <div className="w-40 h-40 border-4 border-dashed border-white rounded-full animate-spin [animation-duration:40s]" />
                  <div className="w-24 h-24 border border-white rounded-full absolute" />
                </div>
              </div>

              {/* Continue learning block (Layer 3 elevated card) */}
              <div className="bg-white dark:bg-[#0E1321] border border-slate-200/80 dark:border-slate-850 p-6 sm:p-7 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">RESUME SESSION</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] dark:text-white leading-snug">
                    Chest AP & PA Diagnostic Criteria
                  </h3>
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed mt-2 font-medium">
                    Revise the scapulae lateral roll procedures and clavicle symmetry rotation checks in the Clinical Positioning library.
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3.5 mt-4">
                    <div className="w-full max-w-xs h-2 bg-slate-100 dark:bg-slate-900/60 rounded-full overflow-hidden border border-slate-200/30">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">75% COMPLETE</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("radiology")}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 text-xs font-bold transition-all self-stretch md:self-auto flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Play className="w-4 h-4 fill-current text-white animate-pulse" /> Resume Lecture
                </button>
              </div>

              {/* Quick Access Section (Layer 2 Container wrapping Layer 3 cards) */}
              <div className="bg-white dark:bg-[#0E1321]/50 border border-slate-200/60 dark:border-slate-850 p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-2 pl-1 border-b border-slate-100 dark:border-slate-900/60 pb-3">
                  <Sparkles className="w-4.5 h-4.5 text-blue-500 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Quick Syllabus Navigation
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      title: "Anatomy Atlas",
                      desc: "2D Skeletal landmarks",
                      id: "anatomy",
                      icon: BookOpen,
                      color: "from-indigo-500 to-purple-600",
                      glow: "rgba(99, 102, 241, 0.15)"
                    },
                    {
                      title: "Radiology Lab",
                      desc: "Physics & Simulators",
                      id: "radiology",
                      icon: Database,
                      color: "from-blue-500 to-cyan-600",
                      glow: "rgba(59, 130, 246, 0.15)"
                    },
                    {
                      title: "Exam Practice",
                      desc: "Curriculum testing",
                      id: "quizzes",
                      icon: HelpCircle,
                      color: "from-rose-500 to-orange-500",
                      glow: "rgba(244, 63, 94, 0.15)"
                    },
                    {
                      title: "Lecture Notes",
                      desc: "Smart lecture files",
                      id: "notes",
                      icon: FileText,
                      color: "from-emerald-500 to-teal-600",
                      glow: "rgba(16, 185, 129, 0.15)"
                    }
                  ].map((card) => {
                    const CardIcon = card.icon;
                    return (
                      <button
                        key={card.id}
                        onClick={() => setActiveTab(card.id)}
                        style={{ '--glow-color': card.glow } as React.CSSProperties}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-[#121A2C]/30 border border-slate-150/70 dark:border-slate-800 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 text-left cursor-pointer overflow-hidden"
                      >
                        {/* Colorful gradient background circle behind the icon */}
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                          <CardIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-slate-100 tracking-tight group-hover:text-blue-600 transition-colors">
                            {card.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold line-clamp-1">
                            {card.desc}
                          </p>
                        </div>
                        
                        {/* Background subtle radial gradient effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_bottom_right,_var(--glow-color)_0%,_transparent_70%)] pointer-events-none transition-opacity duration-300" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Modules Grid (Layer 2 Container wrapping Layer 3 cards) */}
              <div className="bg-white dark:bg-[#0E1321]/50 border border-slate-200/60 dark:border-slate-850 p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-2 pl-1 border-b border-slate-100 dark:border-slate-900/60 pb-3">
                  <Compass className="w-4.5 h-4.5 text-blue-500" />
                  <h3 className="text-sm font-extrabold text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Academic Learning Modules
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "2D Anatomy Atlas",
                      desc: "Interactive skeletal system atlas. View critical osteology groupings, precise medical terminology structures, and manage saved bookmarks of landmarks.",
                      id: "anatomy",
                      tag: "Structure Atlas",
                      icon: BookOpen,
                      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                    },
                    {
                      title: "Radiology Simulator",
                      desc: "Explore diagnostic physics interactively. Simulate cathode filament current setups, adjust CT Hounsfield window levels, and modify MRI sequence contrast weights.",
                      id: "radiology",
                      tag: "Interactive Lab",
                      icon: Database,
                      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    },
                    {
                      title: "Curriculum Exams",
                      desc: "Complete comprehensive B.Sc. chapter mock exams. Tracks overall syllabus performance scoring history and generates personalized AI diagnostic practice cases.",
                      id: "quizzes",
                      tag: "MCQ Practice",
                      icon: HelpCircle,
                      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30"
                    }
                  ].map((box, i) => {
                    const BoxIcon = box.icon;
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveTab(box.id)}
                        className="group bg-slate-50/50 dark:bg-[#121A2C]/30 border border-slate-150/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between min-h-[225px] cursor-pointer"
                      >
                        <div className="flex flex-col gap-3.5">
                          {/* Card Header with tag and small icon */}
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100/30 dark:border-blue-900/20">
                              {box.tag}
                            </span>
                            <div className={`p-2 rounded-xl ${box.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                              <BoxIcon className="w-4 h-4" />
                            </div>
                          </div>
                          
                          {/* Title and Description */}
                          <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-[#1E293B] dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                              {box.title}
                            </h3>
                            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                              {box.desc}
                            </p>
                          </div>
                        </div>

                        {/* Interactive footer row with Arrow Button and details */}
                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-150 dark:border-slate-800/60">
                          <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                            Launch Learning
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-200/30 dark:border-slate-800">
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comparative Case Study Grid (Layer 2 Container wrapping Layer 3 cards) */}
              <div className="bg-white dark:bg-[#0E1321]/50 border border-slate-200/60 dark:border-slate-850 p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col gap-6">
                <div className="border-b border-slate-100 dark:border-slate-900/60 pb-3">
                  <h3 className="text-sm font-extrabold text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Recent Comparative Pathology Cases
                  </h3>
                  <p className="subtitle mt-1">
                    Side-by-side normal anatomy comparisons with trauma clinical findings.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      title: "Tension Pneumothorax Diagnostic Film",
                      findings: "Complete right pulmonary field collapse with marked contralateral tracheal deviation. Immediate decompression required.",
                      tag: "Emergency Radiology",
                      icon: Activity,
                      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20"
                    },
                    {
                      title: "Barium Swallow Perforation Screening",
                      findings: "Contrast extravasation verified around distal esophagus. Barium contraindicated, Gastrografin utilized.",
                      tag: "Special Contrast Procedure",
                      icon: Flame,
                      color: "text-red-500 bg-red-50 dark:bg-red-950/20"
                    }
                  ].map((c, idx) => {
                    const CaseIcon = c.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveTab("radiology")}
                        className="group bg-slate-50/50 dark:bg-[#121A2C]/30 p-6 rounded-2xl border border-slate-150/70 dark:border-slate-800 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between min-h-[200px] cursor-pointer"
                      >
                        <div className="flex flex-col gap-3.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-amber-750 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-100/30 dark:border-amber-900/20">
                              {c.tag}
                            </span>
                            <div className={`p-1.5 rounded-lg ${c.color} flex items-center justify-center`}>
                              <CaseIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-slate-100 group-hover:text-blue-600 transition-colors leading-snug">
                              {c.title}
                            </h4>
                            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-normal italic mt-2.5 bg-white/85 dark:bg-[#0E1321]/80 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-850/60 shadow-inner">
                              "{c.findings}"
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-150 dark:border-slate-800/60">
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold group-hover:underline">
                            Inspect Case Comparative Images
                          </span>
                          <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-200/40 dark:border-slate-800/40">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Route: Anatomy Simulator */}
          {activeTab === "anatomy" && (
            <div id="route-anatomy" className="flex flex-col gap-6">
              
              {/* Decorative graphic banner replacing heavy WebGL blocks */}
              <div className="w-full rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-900 shadow-sm bg-slate-900 flex items-center justify-center min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 flex flex-col justify-center p-6 sm:p-8">
                  <div className="max-w-2xl relative z-10">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-cyan-400 bg-cyan-950/60 border border-cyan-800/30 px-2.5 py-1 rounded-full uppercase tracking-widest mb-3">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> 2D Skeletal Atlas
                    </span>
                    <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight leading-tight">
                      RadioVerse Interactive Anatomy Atlas
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xl">
                      Select specific organ systems or osseous groupings, view detailed description metrics, adjust simulated viewing angles, and save bookmarks.
                    </p>
                  </div>
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>
              </div>
              
              <InteractiveAnatomy />
            </div>
          )}

          {/* Route: Radiology Module */}
          {activeTab === "radiology" && (
            <div id="route-radiology" className="flex flex-col gap-6">
              <div className="px-1 py-2 flex flex-col gap-1">
                <h2 className="section-heading text-slate-900 dark:text-slate-100">Integrated Clinical Radiology Suite</h2>
                <p className="subtitle">
                  Configure real-time cathode parameters, evaluate CT window level densities, adjust MRI sequence contrast models, and master positioning checklists.
                </p>
              </div>
              <RadiologyModule />
            </div>
          )}

          {/* Route: Quizzes & Testing */}
          {activeTab === "quizzes" && (
            <div id="route-quizzes" className="flex flex-col gap-6">
              <div className="px-1 py-2 flex flex-col gap-1">
                <h2 className="section-heading text-slate-900 dark:text-slate-100">Curriculum Chapter Exams & AI Simulator</h2>
                <p className="subtitle">
                  Take timed curriculum exams, monitor progress score logs, and generate clinical case scenarios utilizing server-side models.
                </p>
              </div>
              <QuizSystem />
            </div>
          )}

          {/* Route: Notes & smart Synthesis */}
          {activeTab === "notes" && (
            <div id="route-notes" className="flex flex-col gap-6">
              <div className="px-1 py-2 flex flex-col gap-1">
                <h2 className="section-heading text-slate-900 dark:text-slate-100">Curriculum Lecture Notes directory</h2>
                <p className="subtitle">
                  Access semester-wise skeletal osteology, transformer circuitry, ALARA safety limits, and renal gadolinium protocols. Save guides to offline PDF.
                </p>
              </div>
              <NotesSystem />
            </div>
          )}

          {/* Route: News and Careers */}
          {activeTab === "news" && (
            <div id="route-news" className="flex flex-col gap-6">
              <div className="px-1 py-2 flex flex-col gap-1">
                <h2 className="section-heading text-slate-900 dark:text-slate-100">Radiology bulletin Board & Career Hub</h2>
                <p className="subtitle">
                  Stay updated on FDA software clearances, licensing board syllables, research publications, AIIMS contracts, and higher-study masters programs.
                </p>
              </div>
              <NewsCareer />
            </div>
          )}

          {/* Route: Academic Profile */}
          {activeTab === "dashboard" && (
            <div id="route-dashboard" className="flex flex-col gap-6">
              <div className="px-1 py-2 flex flex-col gap-1">
                <h2 className="section-heading text-slate-900 dark:text-slate-100">Academic Profile Records</h2>
                <p className="subtitle">
                  Audit weekly study graphs, subject mastery achievements, and curriculum completion stats.
                </p>
              </div>
              <StudentDashboard />
            </div>
          )}

          {/* Route: Study Planner */}
          {activeTab === "planner" && (
            <div id="route-planner" className="flex flex-col gap-6">
              <div className="px-1 py-2 flex flex-col gap-1">
                <h2 className="section-heading text-slate-900 dark:text-slate-100">Productivity & Study Planning Suite</h2>
                <p className="subtitle">
                  Formulate calendar schedules, record assignment tasks, and optimize focus using custom interval Pomodoro ticking timers.
                </p>
              </div>
              <StudyPlanner />
            </div>
          )}

          {/* Route: Admin & Support */}
          {activeTab === "support" && (
            <div id="route-support" className="flex flex-col gap-6">
              <div className="px-1 py-2 flex flex-col gap-1">
                <h2 className="section-heading text-slate-900 dark:text-slate-100">University Help Desk & Administration Console</h2>
                <p className="subtitle">
                  Submit tickets to the academic board review panel, or configure testing supervisor settings.
                </p>
              </div>
              <ContactAdmin />
            </div>
          )}

        </main>
      </div>

      {/* 3. Floating AI Coach Bubble */}
      <button
        id="floating-ai-coach-bubble"
        onClick={() => {
          setIsAICoachOpen(true);
        }}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all h-14 w-14 z-40 flex items-center justify-center border-2 border-white dark:border-slate-900 group"
        title="Open AI Reference Assistant"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-xs pl-0 group-hover:pl-2 whitespace-nowrap">
          Smart Reference Coach
        </span>
      </button>

      {/* 4. Elegant Premium Footer */}
      <footer className="bg-white dark:bg-[#090D16] border-t border-slate-200/60 dark:border-slate-900/60 mt-16 py-12 transition-colors relative overflow-hidden">
        {/* Background ambient decoration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-slate-150 dark:border-slate-900/60">
            {/* Column 1: Brand & Desc */}
            <div className="md:col-span-2 flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Activity className="w-4 h-4 text-white animate-pulse" />
                </div>
                <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-150 font-display">
                  Radio<span className="text-blue-600">Verse</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                A highly-vetted B.Sc. Radiography educational ecosystem, empowering next-generation clinical imaging technologist candidates with active spatial atlases and diagnostic labs.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2.5 py-1 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded text-[9px] font-bold tracking-wider uppercase border border-blue-100/30">HOD Approved</span>
                <span className="px-2.5 py-1 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded text-[9px] font-bold tracking-wider uppercase border border-emerald-100/30">ALARA Safety Certified</span>
                <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded text-[9px] font-bold tracking-wider uppercase border border-slate-200/30">ICRP Compliant</span>
              </div>
            </div>

            {/* Column 2: Nav Quick links */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Core Modules
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {[
                  { label: "Overview Hub", id: "home" },
                  { label: "Interactive Anatomy", id: "anatomy" },
                  { label: "Radiology Suite", id: "radiology" },
                  { label: "Curriculum Exams", id: "quizzes" }
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        setActiveTab(link.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Student Tools */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Student Resources
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {[
                  { label: "Notes & Smart Synthesis", id: "notes" },
                  { label: "Academic Profile", id: "dashboard" },
                  { label: "Study Planner", id: "planner" },
                  { label: "Help & Admin Support", id: "support" }
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        setActiveTab(link.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-450 font-semibold">
            <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
              <p className="text-slate-600 dark:text-slate-350">
                © 2026 RadioVerse Educational Consortium. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-400">
                Accredited standard medical imaging curricula reviewed by diagnostic radiography panels.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-slate-450">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Global AI Coach Drawer Modal */}
      {isAICoachOpen && (
        <div id="ai-coach-global-modal" className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsAICoachOpen(false)}
          />
          
          {/* Drawer content panel */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E1321] h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-slide-in-right">
            
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-150 dark:border-slate-900 flex justify-between items-center bg-slate-50 dark:bg-[#090D16]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#1E293B] dark:text-white uppercase tracking-wider">
                    Smart Reference Coach
                  </h2>
                  <span className="text-[10px] text-slate-400 block font-mono">B.Sc. Radiology Study Companion</span>
                </div>
              </div>
              
              <button 
                id="btn-close-ai-coach"
                onClick={() => setIsAICoachOpen(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-850 dark:hover:text-slate-200 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            {/* Scrollable DoubtSolver body */}
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#0E1321]">
              <DoubtSolver />
            </div>
            
            {/* Footer helper */}
            <div className="p-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-150 dark:border-slate-900 text-center text-[10px] text-slate-400 font-mono">
              RadioVerse AI Core is active. Press ESC to close this drawer.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
