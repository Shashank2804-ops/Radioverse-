/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Play, Pause, RotateCcw, CheckSquare, Square, Trash2, 
  Plus, Calendar, Clock, Bell, Hourglass, Award 
} from "lucide-react";
import { StudyGoal, PlannerEvent } from "../types";

export default function StudyPlanner() {
  // 1. Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<"study" | "shortBreak" | "longBreak">("study");
  const [secondsRemaining, setSecondsRemaining] = useState(1500); // 25 min default
  const [timerRunning, setTimerRunning] = useState(false);
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState(0);

  // 2. To-Do List State
  const [goals, setGoals] = useState<StudyGoal[]>([
    { id: "g1", text: "Study Thoracic Cage ribs anatomy", completed: true, dueDate: "2026-07-16" },
    { id: "g2", text: "Practice Chest PA positioning steps", completed: false, dueDate: "2026-07-17" },
    { id: "g3", text: "Take 10 MCQ Practice quiz on X-Ray Physics", completed: false, dueDate: "2026-07-18" }
  ]);
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("2026-07-16");

  // 3. Calendar & Timetable State
  const [events] = useState<PlannerEvent[]>([
    { id: "ev1", title: "Human Anatomy Terminal Exam", date: "2026-07-22", type: "exam" },
    { id: "ev2", title: "X-Ray Positioning Practical Viva", date: "2026-07-25", type: "viva" },
    { id: "ev3", title: "Submit Radiography Positioning Record File", date: "2026-07-29", type: "practical" }
  ]);

  // Dynamic status/toast message instead of alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pomodoro Timer tick interval effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      if (timerMode === "study") {
        setTotalSessionsCompleted((prev) => prev + 1);
        setToastMessage("📚 Great focus session completed! Take a 5-minute breather.");
        handleSwitchTimerMode("shortBreak");
      } else {
        setToastMessage("⏰ Break is over! Let's get back to radiography learning.");
        handleSwitchTimerMode("study");
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining, timerMode]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSwitchTimerMode = (mode: "study" | "shortBreak" | "longBreak") => {
    setTimerMode(mode);
    setTimerRunning(false);
    if (mode === "study") setSecondsRemaining(1500); // 25 min
    else if (mode === "shortBreak") setSecondsRemaining(300); // 5 min
    else if (mode === "longBreak") setSecondsRemaining(900); // 15 min
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Add a study goal/todo
  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    const newGoal: StudyGoal = {
      id: "goal-" + Date.now(),
      text: newGoalText.trim(),
      completed: false,
      dueDate: newGoalDate
    };
    setGoals((prev) => [...prev, newGoal]);
    setNewGoalText("");
  };

  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div id="study-planner-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-premium-fade">
      
      {/* Toast Notice */}
      {toastMessage && (
        <div className="lg:col-span-12 bg-emerald-500 text-white text-xs px-5 py-3 rounded-2xl flex items-center justify-between font-bold shadow-lg animate-bounce">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">✕</button>
        </div>
      )}

      {/* Left Column Pomodoro Focus Timer */}
      <div className="lg:col-span-5 flex flex-col gap-4 premium-card-design p-6 justify-between min-h-[380px]">
        <div className="border-b border-slate-150 dark:border-slate-900 pb-3 flex items-center justify-between">
          <div>
            <span className="caption-text block">Productivity Suite</span>
            <h3 className="section-heading text-slate-800 dark:text-slate-150">Focus Pomodoro Timer</h3>
          </div>
          <Hourglass className="w-5 h-5 text-blue-600" />
        </div>

        {/* Mode Switchers */}
        <div className="bg-slate-150/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-150 dark:border-slate-850 flex gap-2 w-full shadow-xs">
          {[
            { id: "study", label: "Study Focus" },
            { id: "shortBreak", label: "Short Break" },
            { id: "longBreak", label: "Long Break" }
          ].map((mode) => (
            <button
              key={mode.id}
              id={`btn-pomo-mode-${mode.id}`}
              onClick={() => handleSwitchTimerMode(mode.id as any)}
              className={`flex-1 flex items-center justify-center px-2 py-3 rounded-xl text-xs transition-all cursor-pointer text-center leading-tight ${
                timerMode === mode.id
                  ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold border border-slate-200/50 dark:border-slate-800/80"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent font-bold"
              }`}
            >
              <span className="truncate sm:text-wrap">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Large Countdown Clock */}
        <div className="flex flex-col items-center justify-center my-6">
          <span className="text-5xl sm:text-6xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tracking-wider">
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider font-sans">
            {timerMode === "study" ? "Time to Lock In" : "Relaxation Period"}
          </span>
        </div>

        {/* Action controls */}
        <div className="flex gap-2">
          <button
            id="btn-pomo-start"
            onClick={() => setTimerRunning(!timerRunning)}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm text-white cursor-pointer ${
              timerRunning 
                ? "bg-amber-650 hover:bg-amber-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {timerRunning ? "Pause Session" : "Start Session"}
          </button>
          <button
            id="btn-pomo-reset"
            onClick={() => handleSwitchTimerMode(timerMode)}
            className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350 border border-slate-150 dark:border-slate-900 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Total stats feedback */}
        <div className="mt-4 border-t border-slate-150 dark:border-slate-900 pt-3 flex justify-between items-center text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Award className="w-4 h-4 text-amber-500 animate-pulse" />
            Completed study chunks
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-xl">
            {totalSessionsCompleted} intervals
          </span>
        </div>
      </div>

      {/* Middle Column To-Do list */}
      <div className="lg:col-span-4 flex flex-col premium-card-design p-6 justify-between min-h-[380px]">
        <div className="border-b border-slate-150 dark:border-slate-900 pb-3">
          <span className="caption-text block">Daily Tasks</span>
          <h3 className="section-heading text-slate-800 dark:text-slate-150">Study Agenda Checklist</h3>
        </div>

        {/* List of scrollable items */}
        <div className="flex-1 overflow-y-auto max-h-[190px] my-3 pr-1 flex flex-col gap-2.5">
          {goals.map((g) => (
            <div
              key={g.id}
              className="flex justify-between items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50/55 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-905 shadow-sm"
            >
              <button
                id={`btn-todo-toggle-${g.id}`}
                onClick={() => handleToggleGoal(g.id)}
                className="text-slate-400 hover:text-blue-600 transition-all mt-0.5 cursor-pointer"
              >
                {g.completed ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <div className="flex-1 text-xs">
                <span className={`block font-semibold leading-tight ${g.completed ? "line-through text-slate-405" : "text-slate-850 dark:text-slate-200"}`}>
                  {g.text}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1.5 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-blue-500" /> Due {g.dueDate}
                </span>
              </div>
              <button
                id={`btn-todo-del-${g.id}`}
                onClick={() => handleDeleteGoal(g.id)}
                className="text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-xs text-slate-400 italic text-center py-6">All tasks completed! Add a new goal.</p>
          )}
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2 border-t border-slate-150 dark:border-slate-900 pt-3">
          <input
            id="todo-add-text"
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Add new study goal..."
            className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-900 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm"
          />
          <div className="flex gap-2">
            <input
              id="todo-add-date"
              type="date"
              value={newGoalDate}
              onChange={(e) => setNewGoalDate(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-900 rounded-xl text-slate-650 dark:text-slate-350 focus:outline-none focus:border-blue-500 shadow-sm"
            />
            <button
              id="btn-todo-add"
              onClick={handleAddGoal}
              className="px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column Events & Timetable */}
      <div className="lg:col-span-3 flex flex-col premium-card-design p-6 justify-between min-h-[380px]">
        <div className="border-b border-slate-150 dark:border-slate-900 pb-3">
          <span className="caption-text block">Academics</span>
          <h3 className="section-heading text-slate-800 dark:text-slate-150">Exam Deadlines</h3>
        </div>

        {/* List of upcoming milestones */}
        <div className="flex-1 flex flex-col gap-3 my-4 overflow-y-auto max-h-[220px]">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-2xl border border-slate-150 dark:border-slate-900 flex gap-3 items-start bg-slate-50/50 dark:bg-slate-900/40 shadow-sm"
            >
              <div
                className={`p-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                  ev.type === "exam"
                    ? "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/30"
                    : ev.type === "viva"
                    ? "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/30"
                    : "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/30"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-850 dark:text-slate-200 block leading-tight">{ev.title}</span>
                <span className="text-[10px] text-slate-450 block mt-1.5 uppercase tracking-wide font-mono font-bold">
                  {ev.type} • {ev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100/60 dark:border-blue-900/20 text-[11px] text-blue-950 dark:text-blue-200 flex items-center gap-2 shadow-sm leading-relaxed">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Keep records updated to avoid terminal marks deduction!</span>
        </div>
      </div>

    </div>
  );
}
