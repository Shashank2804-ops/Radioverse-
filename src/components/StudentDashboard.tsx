/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import { 
  Award, Clock, Flame, BookOpen, Star, TrendingUp, CheckCircle, HelpCircle, 
  ChevronRight, Sparkles 
} from "lucide-react";

interface Achievement {
  title: string;
  desc: string;
  xp: number;
  unlocked: boolean;
  date?: string;
}

const studyTimeData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 2.1 },
  { day: "Sat", hours: 5.0 },
  { day: "Sun", hours: 3.5 }
];

const subjectProgressData = [
  { name: "Skeletal", progress: 85 },
  { name: "Respiratory", progress: 60 },
  { name: "Cardio", progress: 40 },
  { name: "Nervous", progress: 20 }
];

const achievements: Achievement[] = [
  { title: "First Chapter Finished", desc: "Completed Thoracic Cage anatomy module theory & quiz", xp: 500, unlocked: true, date: "2026-07-12" },
  { title: "ALARA Guard", desc: "Reviewed full X-Ray Safety principles & finished test", xp: 350, unlocked: true, date: "2026-07-14" },
  { title: "Dislocation Solver", desc: "Correctly diagnosed shoulder displacement in Case Library", xp: 400, unlocked: true, date: "2026-07-15" },
  { title: "Quiz Master", desc: "Scored 100% on any Subject Mock exam", xp: 600, unlocked: false }
];

export default function StudentDashboard() {
  return (
    <div id="student-dashboard-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-premium-fade">
      
      {/* 1. Header Level Progress Bento Card */}
      <div className="lg:col-span-12 bg-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[9px] uppercase font-bold tracking-widest text-white bg-blue-600 px-3 py-1 rounded-full">
            Radiology Cadet Program
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-3 font-sans tracking-tight leading-none text-white">
            RadioVerse Student Profile
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
            Track your B.Sc. academic hours, unlock clinical achievements, and manage exam metrics.
          </p>
        </div>

        {/* Level and XP */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 w-full md:w-auto relative z-10 shadow-inner">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md animate-pulse-subtle">
            Lvl 4
          </div>
          <div className="flex-1 md:w-36">
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>XP Level up</span>
              <span>2,450 / 3,000</span>
            </div>
            {/* Simple CSS Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: "81%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Numerical High Impact Stats Row */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Hours Studied", value: "32.5 hrs", desc: "Total academic logs", icon: Clock, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
          { label: "Study Streak", value: "8 Days", desc: "Consecutive focus logs", icon: Flame, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40" },
          { label: "Chapters Cleared", value: "2 / 3", desc: "Anatomy reading progress", icon: BookOpen, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Achievements", value: "3 Unlocked", desc: "XP multipliers active", icon: Award, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="premium-card-design p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-center mb-2">
                <span className="caption-text">{stat.label}</span>
                <div className={`p-2.5 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="section-heading text-slate-850 dark:text-slate-150 block">{stat.value}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-medium">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Recharts Statistical Graph - Study times */}
      <div className="lg:col-span-8 premium-card-design p-6 flex flex-col justify-between min-h-[320px]">
        <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-900 pb-4 mb-4">
          <div>
            <h3 className="section-heading text-slate-850 dark:text-slate-150 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Weekly Study Log Graph (Hours)
            </h3>
            <span className="text-[10px] text-slate-400">Calculated over standard 25-minute Pomodoro sessions</span>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded border border-blue-150/40">
            Avg: 3.1 hrs/day
          </span>
        </div>

        {/* The Recharts graph */}
        <div className="w-full h-52 text-xs font-sans mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={studyTimeData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" strokeWidth={0.5} tickLine={false} />
              <YAxis stroke="#94a3b8" strokeWidth={0.5} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0f172a", 
                  borderRadius: "16px", 
                  border: "none", 
                  color: "#f8fafc",
                  fontSize: "11px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }} 
              />
              <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#hoursGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Subject Completion Ratios */}
      <div className="lg:col-span-4 premium-card-design p-6 flex flex-col justify-between min-h-[320px]">
        <div className="border-b border-slate-150 dark:border-slate-900 pb-3 mb-4">
          <h3 className="section-heading text-slate-850 dark:text-slate-150">Subject Completion %</h3>
          <span className="text-[10px] text-slate-400">Evaluated on reading material and quiz marks</span>
        </div>

        {/* Lists */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
          {subjectProgressData.map((sub, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-350 mb-1.5">
                <span>{sub.name} Module</span>
                <span>{sub.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.progress >= 80 
                      ? "bg-emerald-500" 
                      : sub.progress >= 50 
                      ? "bg-blue-600" 
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${sub.progress}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100/60 dark:border-blue-900/20 text-[11px] text-blue-950 dark:text-blue-200 mt-4 leading-relaxed flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 animate-pulse" />
          <span>Complete <strong>Nervous System</strong> notes to trigger AI study recommendations.</span>
        </div>
      </div>

      {/* 5. Achievements Panel */}
      <div className="lg:col-span-12 premium-card-design p-6">
        <div className="border-b border-slate-150 dark:border-slate-900 pb-3 mb-4 flex justify-between items-center">
          <div>
            <h3 className="section-heading text-slate-850 dark:text-slate-150 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 animate-bounce" />
              B.Sc. Radiology Badges & XP Milestones
            </h3>
            <span className="text-[10px] text-slate-400">Unlock multipliers and receive certificates of completion</span>
          </div>
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between h-36 transition-all hover:scale-[1.02] shadow-sm ${
                ach.unlocked
                  ? "border-amber-200 bg-amber-50/15 dark:border-amber-950/20"
                  : "border-slate-200 bg-slate-50/40 opacity-60 dark:border-slate-900 dark:bg-slate-900/10"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-850 dark:text-slate-200 leading-tight">{ach.title}</span>
                <Star className={`w-4 h-4 ${ach.unlocked ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{ach.desc}</p>
              
              <div className="flex justify-between items-center border-t border-slate-150 dark:border-slate-850 pt-2.5 mt-2.5">
                <span className="text-[10px] font-mono font-bold text-amber-600">+{ach.xp} XP</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">
                  {ach.unlocked ? `Unlocked ${ach.date}` : "LOCKED"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
