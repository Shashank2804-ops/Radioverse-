/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { caseStudies, reportTemplates } from "../data/casesData";
import { xrayPositioningItems } from "../data/xrayData";
import { CaseStudy, XrayPositioningItem, XrayReportTemplate } from "../types";
import { 
  BookOpen, Compass, Clipboard, Columns, AlertTriangle, 
  CheckCircle, ArrowRight, BookMarked, Sparkles, AlertCircle 
} from "lucide-react";

// Interactive Custom SVG Radiograph Visualizer
function CustomRadiographSim({ type }: { type: string }) {
  return (
    <div className="w-full h-48 sm:h-64 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
      <svg viewBox="0 0 300 240" className="w-full h-full text-slate-800">
        {/* Draw thoracic rib cage structure for chest views */}
        {(type.includes("chest") || type.includes("pneumonia") || type.includes("effusion") || type.includes("normal-chest")) && (
          <g>
            {/* Background lungs (radiolucent = dark) */}
            <path d="M 60,30 Q 80,10 110,40 L 110,180 Q 80,190 60,170 Z" fill="#1e293b" opacity="0.6" />
            <path d="M 240,30 Q 220,10 190,40 L 190,180 Q 220,190 240,170 Z" fill="#1e293b" opacity="0.6" />
 
            {/* Trachea midline */}
            <line x1="150" y1="20" x2="150" y2="100" stroke="#0f172a" strokeWidth="6" />
            {/* Bronchi bifurcation */}
            <line x1="150" y1="100" x2="110" y2="120" stroke="#0f172a" strokeWidth="4" />
            <line x1="150" y1="100" x2="190" y2="120" stroke="#0f172a" strokeWidth="4" />
 
            {/* Heart shadow (radiopaque = white/gray) */}
            {type === "normal-chest" && (
              <path d="M 150,90 Q 185,110 185,160 Q 150,185 130,170 Q 130,130 150,90 Z" fill="#64748b" opacity="0.75" />
            )}
            {type === "pneumonia-chest" && (
              <g>
                <path d="M 150,90 Q 185,110 185,160 Q 150,185 130,170 Q 130,130 150,90 Z" fill="#64748b" opacity="0.75" />
                {/* Right base consolidation (white blotch covering the right diaphragm) */}
                <ellipse cx="90" cy="160" rx="35" ry="25" fill="#f8fafc" opacity="0.75" />
                <text x="90" y="165" textAnchor="middle" fill="#2563eb" className="text-[9px] font-bold font-mono">Consolidation</text>
              </g>
            )}
            {type === "effusion-chest" && (
              <g>
                {/* Heart shifted slightly to the right */}
                <path d="M 160,90 Q 195,110 195,160 Q 160,185 140,170 Q 140,130 160,90 Z" fill="#64748b" opacity="0.75" />
                {/* Left side pleural effusion (meniscus covering left base and pushing inwards) */}
                <path d="M 190,120 Q 220,135 245,110 L 245,185 Q 190,185 190,165 Z" fill="#e2e8f0" opacity="0.85" />
                <text x="215" y="160" textAnchor="middle" fill="#0f172a" className="text-[9px] font-bold font-mono">Effusion Fluid</text>
              </g>
            )}
 
            {/* Sternum & Clavicles */}
            <line x1="100" y1="45" x2="150" y2="60" stroke="#94a3b8" strokeWidth="3" />
            <line x1="200" y1="45" x2="150" y2="60" stroke="#94a3b8" strokeWidth="3" />
 
            {/* Rib lines overlapping */}
            <path d="M 60,60 Q 100,50 140,70" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
            <path d="M 60,90 Q 100,80 140,100" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
            <path d="M 60,120 Q 100,110 140,130" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
            <path d="M 60,150 Q 100,140 140,160" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
 
            <path d="M 240,60 Q 200,50 160,70" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
            <path d="M 240,90 Q 200,80 160,100" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
            <path d="M 240,120 Q 200,110 160,130" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
            <path d="M 240,150 Q 200,140 160,160" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.5" />
 
            {/* Diaphragm lines */}
            {type !== "pneumonia-chest" && (
              <path d="M 50,180 Q 90,160 130,175" stroke="#cbd5e1" strokeWidth="3" fill="none" />
            )}
            {type !== "effusion-chest" && (
              <path d="M 170,175 Q 210,160 250,180" stroke="#cbd5e1" strokeWidth="3" fill="none" />
            )}
          </g>
        )}
 
        {/* Draw skeletal structures for shoulder views */}
        {(type.includes("shoulder") || type.includes("fracture-shoulder")) && (
          <g>
            {/* Clavicle */}
            {type === "normal-shoulder" && (
              <path d="M 60,70 Q 150,60 220,95" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />
            )}
            {type === "fracture-shoulder" && (
              <g>
                {/* Displaced Medial clavicle */}
                <path d="M 60,65 Q 110,50 135,55" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* Displaced Lateral clavicle */}
                <path d="M 145,85 Q 185,90 220,95" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* Red warning highlight circle around fracture */}
                <circle cx="140" cy="70" r="15" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" fill="none" />
                <text x="140" y="45" textAnchor="middle" fill="#ef4444" className="text-[8px] font-bold font-mono">Displaced Fracture</text>
              </g>
            )}
 
            {/* Humeral Head & Shaft */}
            <circle cx="235" cy="130" r="22" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            <rect x="225" y="148" width="20" height="80" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
 
            {/* Scapula details */}
            <path d="M 180,110 L 220,120 L 210,180 L 160,150 Z" fill="#334155" opacity="0.6" stroke="#64748b" />
          </g>
        )}
      </svg>
 
      <span className="absolute bottom-2.5 right-3 text-[9px] font-mono font-semibold bg-slate-900/80 text-blue-400 border border-blue-950 px-2 py-0.5 rounded tracking-wide">
        SIMULATED FILM
      </span>
    </div>
  );
}
 
export default function CasesAndPositioning() {
  const [activeSection, setActiveSection] = useState<"positioning" | "cases" | "reporting">("positioning");
  
  // Library State
  const [posRegion, setPosRegion] = useState<string>("all");
  const [selectedPosItem, setSelectedPosItem] = useState<XrayPositioningItem>(xrayPositioningItems[0]);
 
  // Case Study State
  const [caseFilter, setCaseFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<CaseStudy>(caseStudies[0]);
  const [compareMode, setCompareMode] = useState<boolean>(true);
 
  // Reporting State
  const [selectedReport, setSelectedReport] = useState<XrayReportTemplate>(reportTemplates[0]);
 
  // Filter positioning items
  const filteredPosItems = xrayPositioningItems.filter(
    (item) => posRegion === "all" || item.region === posRegion
  );
 
  // Filter case studies
  const filteredCases = caseStudies.filter(
    (c) => caseFilter === "all" || c.category === caseFilter
  );
 
  return (
    <div id="cases-positioning-wrapper" className="flex flex-col gap-8 animate-premium-fade">
      
      {/* Platform Module Switcher */}
      <div className="flex flex-wrap bg-slate-100/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-150 dark:border-slate-850 gap-2 w-full md:w-fit shadow-xs">
        {[
          { id: "positioning", label: "Positioning Library", icon: Compass },
          { id: "cases", label: "Case Library", icon: BookOpen },
          { id: "reporting", label: "X-Ray Reporting", icon: Clipboard }
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              id={`sec-switch-${sec.id}`}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center leading-tight ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-950"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate md:text-wrap">{sec.label}</span>
            </button>
          );
        })}
      </div>
 
      {/* 1. X-Ray Positioning Library Module */}
      {activeSection === "positioning" && (
        <div id="positioning-module-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Selector */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="premium-card-design p-5">
              <span className="caption-text block mb-3">Region Filter</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", label: "All Regions" },
                  { id: "chest", label: "Chest" },
                  { id: "abdomen", label: "Abdomen" },
                  { id: "spine", label: "Spine" },
                  { id: "upper-limb", label: "Upper Limb" },
                  { id: "lower-limb", label: "Lower Limb" }
                ].map((reg) => (
                  <button
                    key={reg.id}
                    id={`btn-reg-${reg.id}`}
                    onClick={() => {
                      setPosRegion(reg.id);
                      const matched = xrayPositioningItems.filter(x => reg.id === "all" || x.region === reg.id);
                      if (matched.length > 0) setSelectedPosItem(matched[0]);
                    }}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold text-center border transition-all cursor-pointer ${
                      posRegion === reg.id
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>
 
            {/* Scrollable list */}
            <div className="premium-card-design p-5 flex-1 max-h-[300px] sm:max-h-[400px] overflow-y-auto flex flex-col">
              <span className="caption-text block mb-3">Projections</span>
              <div className="flex flex-col gap-1.5 overflow-y-auto">
                {filteredPosItems.map((item) => (
                  <button
                    key={item.id}
                    id={`pos-item-${item.id}`}
                    onClick={() => setSelectedPosItem(item)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs transition-all border cursor-pointer ${
                      selectedPosItem.id === item.id
                        ? "bg-blue-50/50 border-blue-200 text-blue-850 dark:bg-blue-950/20 dark:text-blue-300 font-bold"
                        : "border-transparent text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span className="font-bold block text-slate-800 dark:text-slate-200">{item.projection}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">{item.region.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
 
          {/* Right Column Details */}
          {/* Right Column Details */}
          <div className="lg:col-span-8 flex flex-col gap-6 premium-card-design p-6 sm:p-8">
            <div className="border-b border-slate-150 dark:border-slate-900 pb-4">
              <span className="inline-block text-[9px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedPosItem.region.toUpperCase()} PROJECTION
              </span>
              <h2 className="section-heading text-slate-900 dark:text-slate-100 mt-3">
                {selectedPosItem.projection}
              </h2>
            </div>
  
            {/* Bento details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Steps and positioning */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-blue-600 animate-spin-slow" />
                  Step-by-Step Patient Positioning
                </h4>
                <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-650 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl leading-relaxed border border-slate-100 dark:border-slate-900 shadow-sm">
                  {selectedPosItem.positioningSteps.map((step, idx) => (
                    <li key={idx} className="pl-1 text-slate-600 dark:text-slate-350">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
  
              {/* Technical Factors and safety factors */}
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-4 uppercase tracking-wider">
                    <BookMarked className="w-4 h-4 text-emerald-600" />
                    Recommended Technical Factors
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-900 shadow-sm">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Voltage</span>
                      <span className="font-bold text-slate-950 dark:text-slate-100">{selectedPosItem.technicalFactors.kvp}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-900 shadow-sm">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Current × Time</span>
                      <span className="font-bold text-slate-950 dark:text-slate-100">{selectedPosItem.technicalFactors.mas}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-900 shadow-sm">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">SID Distance</span>
                      <span className="font-bold text-slate-950 dark:text-slate-100">{selectedPosItem.technicalFactors.sid}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-900 shadow-sm">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Grid Required</span>
                      <span className="font-bold text-slate-950 dark:text-slate-100">{selectedPosItem.technicalFactors.grid ? "Yes" : "No / Tabletop"}</span>
                    </div>
                  </div>
                </div>
  
                {/* Common errors and alerts */}
                <div className="bg-rose-50/70 dark:bg-rose-950/20 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
                  <h4 className="text-xs font-extrabold text-rose-950 dark:text-rose-100 flex items-center gap-2 mb-3 uppercase tracking-wider font-display">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Common Positioning Errors
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                    {selectedPosItem.commonErrors.map((err, idx) => (
                      <li key={idx} className="pl-1">{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
  
            </div>
  
            {/* Clinician Notes */}
            <div className="bg-blue-50/70 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 text-xs mt-2 shadow-sm">
              <span className="font-extrabold block mb-1.5 uppercase tracking-wider text-[10px] text-blue-900 dark:text-blue-150 font-display">💡 Practical Radiographer Note</span>
              <p className="leading-relaxed text-slate-800 dark:text-slate-200 font-medium">{selectedPosItem.notes}</p>
            </div>
          </div>
        </div>
      )}
            {/* 2. Radiology Case Library Module */}
      {activeSection === "cases" && (
        <div id="cases-module-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Filter / Case of Day */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="premium-card-design p-5">
              <span className="caption-text block mb-3">Filter Category</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "All Cases" },
                  { id: "chest", label: "Chest" },
                  { id: "fracture", label: "Fractures" }
                ].map((f) => (
                  <button
                    key={f.id}
                    id={`btn-case-filter-${f.id}`}
                    onClick={() => {
                      setCaseFilter(f.id);
                      const matched = caseStudies.filter(c => f.id === "all" || c.category === f.id);
                      if (matched.length > 0) setSelectedCase(matched[0]);
                    }}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      caseFilter === f.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-slate-600 border-slate-150 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
 
            {/* List of cases */}
            <div className="premium-card-design p-5 shadow-sm max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              <span className="caption-text block mb-3">Available Case Studies</span>
              <div className="flex flex-col gap-2">
                {filteredCases.map((c) => (
                  <button
                    key={c.id}
                    id={`case-card-${c.id}`}
                    onClick={() => setSelectedCase(c)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedCase.id === c.id
                        ? "border-blue-300 bg-blue-50/40 dark:bg-blue-950/20 font-bold"
                        : "border-slate-150 hover:bg-slate-50 dark:border-slate-905 dark:hover:bg-slate-900"
                    }`}
                  >
                    {c.isCaseOfTheDay && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wider">
                        <Sparkles className="w-2.5 h-2.5" /> Case of the Day
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.title}</h4>
                    <span className="text-[10px] text-slate-400 uppercase mt-1.5 block font-mono font-bold">{c.category} study</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
 
          {/* Right Column Interactive Comparison and Analysis */}
          <div className="lg:col-span-8 flex flex-col gap-6 premium-card-design p-6 sm:p-8">
            
            {/* Case Title */}
            <div className="border-b border-slate-150 dark:border-slate-900 pb-4 flex flex-wrap justify-between items-center gap-2">
              <div>
                <span className="caption-text block mb-1">Clinical Case Analysis</span>
                <h2 className="section-heading text-slate-900 dark:text-slate-100">{selectedCase.title}</h2>
              </div>
              <button
                id="btn-toggle-compare"
                onClick={() => setCompareMode(!compareMode)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-350 border border-slate-200 dark:border-slate-800 text-slate-700 cursor-pointer transition-all shadow-sm"
              >
                <Columns className="w-4 h-4 text-blue-600" />
                {compareMode ? "Single View" : "Compare Normal vs Abnormal"}
              </button>
            </div>

            {/* Interactive X-Ray Films stage */}
            {compareMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Normal Anatomical Reference
                  </span>
                  <CustomRadiographSim type={selectedCase.normalImageUrl} />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Pathological Film (This Case)
                  </span>
                  <CustomRadiographSim type={selectedCase.abnormalImageUrl} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
                  Pathological Film (This Case)
                </span>
                <CustomRadiographSim type={selectedCase.abnormalImageUrl} />
              </div>
            )}
                        {/* Case Medical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-4">
                <div className="text-xs">
                  <span className="caption-text block mb-1.5">Patient History</span>
                  <p className="text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
                    {selectedCase.history}
                  </p>
                </div>
                <div className="text-xs">
                  <span className="caption-text block mb-1.5">Imaging Findings</span>
                  <p className="text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm">
                    {selectedCase.findings}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xs">
                  <span className="caption-text block mb-1.5">Radiologist Impression</span>
                  <p className="leading-relaxed bg-amber-50/70 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-100 shadow-sm font-medium">
                    {selectedCase.impression}
                  </p>
                </div>
                <div className="text-xs">
                  <span className="caption-text block mb-1.5">Simplified Explanation</span>
                  <p className="leading-relaxed bg-blue-50/70 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 text-slate-850 dark:text-slate-100 shadow-sm font-medium">
                    {selectedCase.explanation}
                  </p>
                </div>
              </div>
            </div>
  
            {/* Differential Diagnosis and Learning Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-150 dark:border-slate-900">
              <div className="text-xs">
                <span className="caption-text block mb-2.5">Differential Diagnoses</span>
                <ul className="space-y-2 text-slate-650 dark:text-slate-350">
                  {selectedCase.differentialDiagnosis.map((diff, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0 animate-pulse" />
                      <span className="leading-relaxed font-semibold">{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
  
              <div className="text-xs bg-emerald-50/60 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
                <span className="font-extrabold text-emerald-950 dark:text-emerald-100 uppercase tracking-wider mb-3 block text-[10px] font-display">Learning Points</span>
                <ul className="list-disc list-inside space-y-2 text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                  {selectedCase.learningPoints.map((pt, idx) => (
                    <li key={idx} className="pl-1">{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}
            {/* 3. X-Ray Report Learning System Module */}
      {activeSection === "reporting" && (
        <div id="reporting-module-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Select Template list */}
          <div className="lg:col-span-4 flex flex-col gap-4 premium-card-design p-5">
            <span className="caption-text block mb-2">Select Report Template</span>
            <div className="flex flex-col gap-2">
              {reportTemplates.map((rep) => (
                <button
                  key={rep.id}
                  id={`rep-card-${rep.id}`}
                  onClick={() => setSelectedReport(rep)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedReport.id === rep.id
                      ? "border-blue-300 bg-blue-50/40 dark:bg-blue-950/20 font-bold"
                      : "border-slate-150 hover:bg-slate-50 dark:border-slate-905 dark:hover:bg-slate-900"
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">{rep.title}</h4>
                </button>
              ))}
            </div>
          </div>

          {/* Report Viewer */}
          <div className="lg:col-span-8 flex flex-col gap-6 premium-card-design p-6 sm:p-8">
            <div className="border-b border-slate-150 dark:border-slate-900 pb-4">
              <span className="caption-text block mb-1">Official Medical Draft</span>
              <h2 className="section-heading text-slate-900 dark:text-slate-100 mt-2">
                {selectedReport.title}
              </h2>
            </div>

            {/* The actual medical draft sheet */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 font-mono text-xs text-slate-300 relative shadow-md">
              <div className="absolute top-4 right-4 text-[9px] font-bold text-blue-400 uppercase tracking-wider border border-blue-950 px-2 py-0.5 rounded">
                DRAFT REPORT
              </div>
              <p className="mb-3 leading-relaxed text-slate-300"><strong>PATIENT CLINICAL HISTORY:</strong> {selectedReport.patientHistory}</p>
              <p className="mb-3 leading-relaxed text-slate-300"><strong>RADIOGRAPHIC FINDINGS:</strong> {selectedReport.findings}</p>
              <p className="mb-1 leading-relaxed text-slate-300"><strong>IMPRESSION:</strong> {selectedReport.impression}</p>
            </div>

            {/* Study Analysis helper cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
              <div className="text-xs">
                <span className="font-extrabold text-blue-800 dark:text-blue-400 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider text-[10px] font-display">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  Simplified Explanation
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 shadow-sm font-medium">
                  {selectedReport.simplifiedExplanation}
                </p>
              </div>

              <div className="text-xs bg-rose-50/70 dark:bg-rose-950/20 p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-sm">
                <span className="font-extrabold text-rose-950 dark:text-rose-100 flex items-center gap-2 mb-3 uppercase tracking-wider text-[10px] font-display">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Common Pitfalls to Avoid
                </span>
                <ul className="list-disc list-inside space-y-2 text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                  {selectedReport.commonMistakes.map((mis, idx) => (
                    <li key={idx} className="pl-1">{mis}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Anatomical keywords helper */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] pt-4 border-t border-slate-150 dark:border-slate-900">
              <span className="caption-text block mr-2 text-[10px]">Anatomy Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedReport.anatomyKeywords.map((kw, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100/60 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border border-slate-150 dark:border-slate-800 text-[10px] font-mono shadow-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
