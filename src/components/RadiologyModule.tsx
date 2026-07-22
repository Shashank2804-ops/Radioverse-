/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Radio, Shield, Compass, Layers, Droplet, Activity, 
  Settings, Zap, AlertTriangle, Eye, ArrowRight, HelpCircle, 
  Percent, Trash, BookMarked, Sparkles, ChevronRight, Check,
  Thermometer, Info
} from "lucide-react";
import XrayMachine from "./XrayMachine";
import CasesAndPositioning from "./CasesAndPositioning";

export default function RadiologyModule() {
  const [activeSubTab, setActiveSubTab] = useState<"xray" | "ct" | "mri" | "safety" | "positioning" | "contrast">("xray");

  // --- CT STATE ---
  const [ctPreset, setCtPreset] = useState<"brain" | "bone" | "lung">("brain");
  const [windowWidth, setWindowWidth] = useState<number>(80);
  const [windowLevel, setWindowLevel] = useState<number>(40);

  // Auto-adjust WW/WL when preset is clicked
  const handleCtPreset = (preset: "brain" | "bone" | "lung") => {
    setCtPreset(preset);
    if (preset === "brain") {
      setWindowWidth(80);
      setWindowLevel(40);
    } else if (preset === "bone") {
      setWindowWidth(1500);
      setWindowLevel(450);
    } else if (preset === "lung") {
      setWindowWidth(1200);
      setWindowLevel(-600);
    }
  };

  // --- MRI STATE ---
  const [mriSequence, setMriSequence] = useState<"t1" | "t2" | "flair">("t1");

  // --- RADIATION SAFETY STATE ---
  const [distance, setDistance] = useState<number>(2); // meters
  const [shielding, setShielding] = useState<"none" | "0.25pb" | "0.5pb">("none");
  const baseDoseAt1m = 400; // microSieverts/hr

  const computedDose = useMemo(() => {
    let dose = baseDoseAt1m / (distance * distance);
    if (shielding === "0.25pb") {
      dose = dose * 0.10; // 90% reduction
    } else if (shielding === "0.5pb") {
      dose = dose * 0.01; // 99% reduction
    }
    return parseFloat(dose.toFixed(2));
  }, [distance, shielding]);

  // --- CONTRAST MEDIA STATE ---
  const [contrastCategory, setContrastCategory] = useState<"barium" | "iodine" | "gadolinium">("iodine");
  const [extravasationSteps, setExtravasationSteps] = useState([
    { step: 1, text: "Stop contrast injection immediately", checked: false },
    { step: 2, text: "Aspirate residual contrast from the cannula", checked: false },
    { step: 3, text: "Remove the cannula carefully to prevent hematoma", checked: false },
    { step: 4, text: "Apply a cold compress (to reduce inflammatory response/pain)", checked: false },
    { step: 5, text: "Elevate the affected extremity above heart level", checked: false },
    { step: 6, text: "Notify the radiologist and document the leaked volume and location", checked: false }
  ]);

  const toggleStep = (idx: number) => {
    const updated = [...extravasationSteps];
    updated[idx].checked = !updated[idx].checked;
    setExtravasationSteps(updated);
  };

  return (
    <div className="flex flex-col gap-8 animate-premium-fade">
      
      {/* Premium Sub-Tab glass selector */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/85 backdrop-blur-md border border-slate-150 dark:border-slate-850 p-2 rounded-2xl flex flex-wrap gap-2 shadow-sm">
        {[
          { id: "xray", label: "X-ray Physics", icon: Radio },
          { id: "ct", label: "CT Windowing", icon: Layers },
          { id: "mri", label: "MRI Sequences", icon: Activity },
          { id: "safety", label: "Radiation Safety", icon: Shield },
          { id: "positioning", label: "Positioning & Cases", icon: Compass },
          { id: "contrast", label: "Contrast Media", icon: Droplet },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center leading-tight ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <span className="truncate md:text-wrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB CONTENTS */}
      
      {/* 1. X-RAY */}
      {activeSubTab === "xray" && (
        <div className="flex flex-col gap-8">
          <div className="premium-card-design p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              <h2 className="section-heading mt-0">Interactive X-Ray Tube & Production Lab</h2>
            </div>
            <p className="body-text text-slate-500 dark:text-slate-450 max-w-2xl leading-relaxed mt-2">
              Explore thermionic electron projection, rotating target heat dissipation, glass/metal envelopes under high vacuum, and collimator shutter mechanics. Adjust sliders or select key components to investigate physical properties.
            </p>
          </div>
          <XrayMachine />
        </div>
      )}

      {/* 2. CT WINDOWING SIMULATOR */}
      {activeSubTab === "ct" && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Imaging Science</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50">CT Hounsfield & Windowing Lab</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Human eyes can only distinguish ~256 shades of gray, but CT scans measure over 4,000 density units (Hounsfield Scale). Windowing lets radiographers selectively stretch a specific range of densities.
                </p>
              </div>

              {/* Preset buttons */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clinical Presets</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "brain", label: "Brain Window", ww: 80, wl: 40 },
                    { id: "bone", label: "Bone Window", ww: 1500, wl: 450 },
                    { id: "lung", label: "Lung Window", ww: 1200, wl: -600 }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleCtPreset(p.id as any)}
                      className={`px-3 py-2.5 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        ctPreset === p.id
                          ? "bg-blue-50/80 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <span>{p.label}</span>
                      <span className="text-[9px] font-mono opacity-70">W:{p.ww} L:{p.wl}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Window Width (WW)</span>
                    <span className="font-mono text-blue-600 font-bold">{windowWidth} HU</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="2000" 
                    step="10"
                    value={windowWidth} 
                    onChange={(e) => {
                      setWindowWidth(parseInt(e.target.value));
                      setCtPreset("" as any);
                    }}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-[9px] text-slate-400 leading-normal">
                    Controls subject contrast. Narrower width increases image contrast between tight densities.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Window Level (WL)</span>
                    <span className="font-mono text-blue-600 font-bold">{windowLevel} HU</span>
                  </div>
                  <input 
                    type="range" 
                    min="-1000" 
                    max="1000" 
                    step="10"
                    value={windowLevel} 
                    onChange={(e) => {
                      setWindowLevel(parseInt(e.target.value));
                      setCtPreset("" as any);
                    }}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-[9px] text-slate-400 leading-normal">
                    Controls brightness. Aligned to the average Hounsfield density of the target tissue.
                  </span>
                </div>
              </div>

              {/* Hounsfield Reference list */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-[11px] flex flex-col gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Hounsfield Unit (HU) Scale:</span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-500">Air</span>
                    <span className="text-red-500 font-bold">-1000 HU</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-500">Lungs</span>
                    <span className="text-red-400">-500 HU</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-500">Fat</span>
                    <span className="text-amber-500">-100 to -50 HU</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-500">Water</span>
                    <span className="text-blue-500 font-bold">0 HU</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-500">Muscle</span>
                    <span className="text-orange-500">+40 HU</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                    <span className="text-slate-500">Bone</span>
                    <span className="text-emerald-500 font-bold">+1000 HU</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Screen Display Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900 flex flex-col items-center justify-center relative min-h-[420px] shadow-sm overflow-hidden">
              <span className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                CT CONSOLE SIMULATION • DICOM 3.0
              </span>

              {/* Dynamic Simulated DICOM slice */}
              <div className="w-64 h-64 relative border border-slate-800 rounded-full overflow-hidden shadow-inner flex items-center justify-center bg-black">
                
                {/* 1. BRAIN WINDOW VIEW */}
                {ctPreset === "brain" && (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                    <circle cx="50" cy="50" r="48" fill="#111" />
                    {/* Skull bone - hyperdense white */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="4" />
                    {/* Brain matter folds - shades of gray */}
                    <path d="M 50,15 C 30,20 20,40 25,60 C 30,80 50,85 50,85 C 50,85 70,80 75,60 C 80,40 70,20 50,15 Z" fill="#444" stroke="#555" strokeWidth="1" />
                    <path d="M 50,15 C 40,25 35,45 42,65 C 45,72 50,80 50,85 C 50,80 55,72 58,65 C 65,45 60,25 50,15 Z" fill="#4c4c4c" stroke="#555" strokeWidth="1" />
                    {/* Ventricles - dark gray/black liquor cerebrospinalis */}
                    <path d="M 45,45 Q 40,50 45,55 Q 48,50 45,45 Z" fill="#1a1a1a" />
                    <path d="M 55,45 Q 60,50 55,55 Q 52,50 55,45 Z" fill="#1a1a1a" />
                  </svg>
                )}

                {/* 2. BONE WINDOW VIEW */}
                {ctPreset === "bone" && (
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="48" fill="#000" />
                    {/* Skull bone - ultra bright white with trabecular details */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="4.5" />
                    <circle cx="50" cy="50" r="39.5" fill="none" stroke="#ccc" strokeWidth="0.5" strokeDasharray="1,1" />
                    {/* Brain matter is totally black/invisible */}
                    <path d="M 50,15 C 30,20 20,40 25,60 C 30,80 50,85 50,85 C 50,85 70,80 75,60 C 80,40 70,20 50,15 Z" fill="#111" stroke="#222" strokeWidth="1" />
                    {/* Nasal turbinates / sinus bone structures (white) */}
                    <path d="M 48,82 L 52,82 L 50,86 Z" fill="#fff" />
                    <path d="M 44,80 Q 50,78 56,80" stroke="#fff" strokeWidth="1" fill="none" />
                  </svg>
                )}

                {/* 3. LUNG WINDOW VIEW */}
                {ctPreset === "lung" && (
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="48" fill="#0c0f1d" />
                    {/* Mediastinal heart shadow - dark gray */}
                    <rect x="42" y="30" width="16" height="40" rx="8" fill="#2d3748" />
                    {/* Lungs - large dark black lobes */}
                    <path d="M 38,20 C 22,25 15,50 20,70 C 25,80 38,80 38,80 Z" fill="#000" stroke="#475569" strokeWidth="1" />
                    <path d="M 62,20 C 78,25 85,50 80,70 C 75,80 62,80 62,80 Z" fill="#000" stroke="#475569" strokeWidth="1" />
                    {/* White pulmonary bronchovascular bundles/vessels branching */}
                    <path d="M 32,45 Q 24,42 22,50 M 32,45 Q 26,52 24,58 M 32,45 Q 36,48 34,56" stroke="#94a3b8" strokeWidth="0.8" fill="none" />
                    <path d="M 68,45 Q 76,42 78,50 M 68,45 Q 74,52 76,58 M 68,45 Q 64,48 66,56" stroke="#94a3b8" strokeWidth="0.8" fill="none" />
                    {/* Ribs surrounding thorax - very bright grey/white */}
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,6" />
                  </svg>
                )}

                {/* Custom customized window values (when sliders are changed) */}
                {ctPreset === "" && (
                  <div className="text-center p-4">
                    <Layers className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-pulse" />
                    <p className="text-xs font-mono font-bold text-slate-300">Custom Window Setting</p>
                    <p className="text-[10px] text-slate-500 mt-1">WW: {windowWidth} • WL: {windowLevel}</p>
                    <button 
                      onClick={() => handleCtPreset("brain")}
                      className="mt-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-full cursor-pointer"
                    >
                      Reset to Brain Preset
                    </button>
                  </div>
                )}
              </div>

              {/* Status footer inside screen */}
              <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-4 mt-4">
                <div>
                  <span className="block">STUDY: ANATOMICAL HEAD</span>
                  <span className="block text-slate-600">kV: 120 • mAs: 250</span>
                </div>
                <div className="text-right">
                  <span className="block text-blue-400">WINDOW: {ctPreset ? ctPreset.toUpperCase() : "CUSTOM"}</span>
                  <span className="block">WW: {windowWidth} / WL: {windowLevel}</span>
                </div>
              </div>
            </div>

            {/* Explanatory cards */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-2 text-xs">
              <strong className="text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-600" />
                Radiographer's Exam Insight:
              </strong>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Remember that <strong>Width (WW)</strong> controls contrast latitude: narrow width yields black-and-white images (high contrast, ideal for brain white/gray matter differentiation), while wide width yields multiple shades of gray (low contrast, ideal for bone structures where you need to check fracture lines).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. MRI SEQUENCE SIMULATOR */}
      {activeSubTab === "mri" && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">MR Physics</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50">MRI Pulse Sequences</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Magnetic Resonance Imaging contrasts are created by controlling radiofrequency pulses (RF) and timing of echoes (TR/TE). Different sequences highlight specific pathology.
                </p>
              </div>

              {/* Selector buttons */}
              <div className="flex flex-col gap-2">
                {[
                  { id: "t1", label: "T1-Weighted Sequence", desc: "Fat is bright, CSF is dark. Shows excellent normal anatomy." },
                  { id: "t2", label: "T2-Weighted Sequence", desc: "Fluid / CSF is bright, fat is dark. Ideal for pathology/edema." },
                  { id: "flair", label: "FLAIR Sequence", desc: "Fluid is suppressed/dark, but pathology (plaques, stroke) glows bright." }
                ].map((seq) => (
                  <button
                    key={seq.id}
                    onClick={() => setMriSequence(seq.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all text-xs font-semibold cursor-pointer flex flex-col gap-1 ${
                      mriSequence === seq.id
                        ? "bg-blue-50/80 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-950 dark:text-slate-50">{seq.label}</strong>
                      {mriSequence === seq.id && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                    </div>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 leading-normal">{seq.desc}</span>
                  </button>
                ))}
              </div>

              {/* Contrast Cheat Sheet */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-[11px] flex flex-col gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Tissue Relaxation Table:</span>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="pb-1.5 font-sans">Tissue</th>
                      <th className="pb-1.5 font-sans">T1 Signal</th>
                      <th className="pb-1.5 font-sans">T2 Signal</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-600 dark:text-slate-400">
                    <tr className="border-b border-slate-100 dark:border-slate-900">
                      <td className="py-1.5 font-sans">Water/CSF</td>
                      <td className="py-1.5 text-red-500">Dark (Hypo)</td>
                      <td className="py-1.5 text-emerald-500 font-bold">Bright (Hyper)</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-900">
                      <td className="py-1.5 font-sans">Fat/Bone Marrow</td>
                      <td className="py-1.5 text-emerald-500 font-bold">Bright (Hyper)</td>
                      <td className="py-1.5 text-red-500">Dark (Hypo)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-sans">Gray Matter</td>
                      <td className="py-1.5">Gray</td>
                      <td className="py-1.5">Light Gray</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Interactive Screen Display Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900 flex flex-col items-center justify-center relative min-h-[420px] shadow-sm overflow-hidden">
              <span className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                MRI CONSOLE SIMULATION • BRAIN SAGITTAL AXIS
              </span>

              {/* Dynamic MRI render */}
              <div className="w-64 h-64 relative border border-slate-800 rounded-full overflow-hidden shadow-inner flex items-center justify-center bg-black">
                
                {/* T1-WEIGHTED */}
                {mriSequence === "t1" && (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                    <circle cx="50" cy="50" r="48" fill="#111" />
                    {/* Bone skull has dark/no signal in MRI */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="3" />
                    {/* Fat scalp layer outside bone is bright white on T1 */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#fff" strokeWidth="1" opacity="0.9" />
                    {/* Brain matter folds - gray matter (gray), white matter (lighter gray) */}
                    <path d="M 50,15 C 30,20 20,40 25,60 C 30,80 50,85 50,85 C 50,85 70,80 75,60 C 80,40 70,20 50,15 Z" fill="#666" stroke="#444" strokeWidth="1" />
                    <path d="M 50,15 C 40,25 35,45 42,65 C 45,72 50,80 50,85 C 50,80 55,72 58,65 C 65,45 60,25 50,15 Z" fill="#888" stroke="#666" strokeWidth="1" />
                    {/* CSF Ventricles - pitch black/hypointense */}
                    <path d="M 45,45 Q 40,50 45,55 Q 48,50 45,45 Z" fill="#000" />
                    <path d="M 55,45 Q 60,50 55,55 Q 52,50 55,45 Z" fill="#000" />
                  </svg>
                )}

                {/* T2-WEIGHTED */}
                {mriSequence === "t2" && (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                    <circle cx="50" cy="50" r="48" fill="#111" />
                    {/* Bone skull dark */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="3" />
                    {/* Fat scalp is dark gray/medium on T2 */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#555" strokeWidth="1" />
                    {/* Brain matter folds - gray matter (lighter), white matter (dark gray) */}
                    <path d="M 50,15 C 30,20 20,40 25,60 C 30,80 50,85 50,85 C 50,85 70,80 75,60 C 80,40 70,20 50,15 Z" fill="#444" stroke="#333" strokeWidth="1" />
                    <path d="M 50,15 C 40,25 35,45 42,65 C 45,72 50,80 50,85 C 50,80 55,72 58,65 C 65,45 60,25 50,15 Z" fill="#333" stroke="#222" strokeWidth="1" />
                    {/* CSF Ventricles - glowing hyperintense white */}
                    <path d="M 45,45 Q 40,50 45,55 Q 48,50 45,45 Z" fill="#fff" />
                    <path d="M 55,45 Q 60,50 55,55 Q 52,50 55,45 Z" fill="#fff" />
                  </svg>
                )}

                {/* FLAIR */}
                {mriSequence === "flair" && (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                    <circle cx="50" cy="50" r="48" fill="#111" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="3" />
                    {/* Brain matter folds - dark gray */}
                    <path d="M 50,15 C 30,20 20,40 25,60 C 30,80 50,85 50,85 C 50,85 70,80 75,60 C 80,40 70,20 50,15 Z" fill="#3a3a3a" stroke="#2a2a2a" strokeWidth="1" />
                    {/* Ventricles - fluid is suppressed/dark black */}
                    <path d="M 45,45 Q 40,50 45,55 Q 48,50 45,45 Z" fill="#000" />
                    <path d="M 55,45 Q 60,50 55,55 Q 52,50 55,45 Z" fill="#000" />
                    {/* Plaque pathology lesion (e.g. MS plaque) glows bright white in the periventricular zone */}
                    <circle cx="64" cy="52" r="3.5" fill="#fff" opacity="0.95" className="animate-pulse" />
                    <text x="76" y="47" textAnchor="middle" fill="#fff" className="text-[6px] font-sans font-bold">Pathology Plaque</text>
                  </svg>
                )}
              </div>

              {/* Status footer inside screen */}
              <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-4 mt-4">
                <div>
                  <span className="block">STUDY: T-AXIAL NEURO</span>
                  <span className="block text-slate-600">TR: {mriSequence === "t1" ? "450ms" : "4000ms"} • TE: {mriSequence === "t1" ? "15ms" : "100ms"}</span>
                </div>
                <div className="text-right">
                  <span className="block text-blue-400">SEQUENCE: {mriSequence.toUpperCase()}</span>
                  <span className="block text-slate-500">Fluid state: {mriSequence === "t2" ? "Hyperintense" : "Suppressed"}</span>
                </div>
              </div>
            </div>

            {/* Practical Tip */}
            <div className="bg-blue-50/70 dark:bg-blue-950/20 p-6 rounded-3xl border border-blue-200 dark:border-blue-900/40 shadow-sm flex flex-col gap-2.5 text-xs">
              <strong className="text-blue-950 dark:text-blue-150 flex items-center gap-2 font-extrabold uppercase tracking-wider text-[10px] font-display">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                University Viva Tip
              </strong>
              <p className="text-slate-800 dark:text-slate-250 leading-relaxed font-medium">
                Why use <strong>FLAIR</strong> if it looks like T1? In T2-weighted scans, free-flowing water (like CSF in ventricles) glows white, which can easily hide lesions adjacent to ventricles. FLAIR suppresses water signals (making CSF black) but keeps lesions like edema or demyelinating plaques bright white, making them easily visible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. RADIATION SAFETY (ALARA LAB) */}
      {activeSubTab === "safety" && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dose calculation column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 block">Health Physics</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50">Dose & Inverse Square Law</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Radiation intensity decreases dramatically with distance. ALARA (As Low As Reasonably Achievable) requires adjusting three key pillars: Time, Distance, and Shielding.
                </p>
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
                
                {/* Distance Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Distance from Tube (d)</span>
                    <span className="font-mono text-emerald-600 font-bold">{distance} meters</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5"
                    value={distance} 
                    onChange={(e) => setDistance(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>1m (High scatter)</span>
                    <span>10m (Safe buffer)</span>
                  </div>
                </div>

                {/* Lead Shielding Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Lead Shielding Barrier</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "none", label: "No Shielding", red: "0%" },
                      { id: "0.25pb", label: "0.25mm Pb Apron", red: "90%" },
                      { id: "0.5pb", label: "0.50mm Pb Apron", red: "99%" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setShielding(s.id as any)}
                        className={`px-2 py-3 rounded-xl border text-center transition-all text-[11px] font-bold cursor-pointer flex flex-col gap-1 items-center justify-center ${
                          shielding === s.id
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        <span>{s.label}</span>
                        <span className="text-[9px] opacity-75 text-emerald-600 dark:text-emerald-400">Blocks {s.red}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dose Display Meter */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 items-center justify-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Dose Intensity</span>
                <span className={`text-2xl font-mono font-bold tracking-tight ${computedDose > 50 ? "text-red-500" : computedDose > 5 ? "text-amber-500" : "text-emerald-500"}`}>
                  {computedDose} µSv/hr
                </span>
                <span className="text-[9px] text-slate-400">
                  {computedDose > 100 
                    ? "⚠️ CRITICAL EXPOSURE LIMIT! Lead barriers required." 
                    : computedDose > 10 
                    ? "⚡ Moderate radiation dose level." 
                    : "✅ Secure low dose level (Under ALARA threshold)."}
                </span>
              </div>
            </div>
          </div>

          {/* Visualizing Scatter Lines Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900 flex flex-col items-center justify-center relative min-h-[420px] shadow-sm">
              <span className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                ALARA Dose Scatter Visualization
              </span>

              {/* Scatter cone diagram */}
              <svg viewBox="0 0 200 200" className="w-56 h-56">
                {/* Tube source */}
                <rect x="90" y="5" width="20" height="20" rx="3" fill="#64748b" />
                <circle cx="100" cy="15" r="4" fill="#ef4444" className="animate-ping" />

                {/* Primary Beam Cone */}
                <polygon points="100,20 60,190 140,190" fill="#f59e0b" fillOpacity="0.05" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* Patient / scatter source at T7 (approx middle 80px) */}
                <circle cx="100" cy="90" r="12" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
                <text x="100" y="93" textAnchor="middle" fill="#cbd5e1" className="text-[7px] font-bold">Patient</text>

                {/* Scatter radiation rays bouncing off patient */}
                <path d="M 100,90 L 50,110 M 100,90 L 150,110 M 100,90 L 40,80 M 100,90 L 160,80" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.7" />

                {/* Student Position indicator based on distance slider */}
                {/* map distance from 1m (close) to 10m (bottom) -> y coordinate 110 to 180 */}
                <g transform={`translate(100, ${110 + (distance - 1) * 7.5})`}>
                  {/* Lead shield protection barrier representation */}
                  {shielding !== "none" && (
                    <line x1="-15" y1="-10" x2="15" y2="-10" stroke="#10b981" strokeWidth="3" />
                  )}
                  <circle cx="0" cy="0" r="7" fill="#2563eb" stroke="#fff" strokeWidth="1" />
                  <text x="0" y="2.5" textAnchor="middle" fill="#fff" className="text-[7px] font-bold">You</text>
                  <text x="0" y="-14" textAnchor="middle" fill="#ef4444" className="text-[6px] font-mono font-bold animate-pulse">
                    {computedDose} µSv
                  </text>
                </g>
              </svg>

              <div className="w-full text-[10px] text-slate-400 font-mono flex justify-between border-t border-slate-900 pt-4 mt-2">
                <span>Tube Center: CR at T7</span>
                <span>Distance: {distance}m • Shield: {shielding.toUpperCase()}</span>
              </div>
            </div>

            {/* Regulatory limits */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm text-xs flex flex-col gap-2">
              <strong className="text-slate-800 dark:text-slate-200">Annual Occupational Exposure Limits:</strong>
              <div className="grid grid-cols-3 gap-4 font-mono text-[11px] mt-1 text-slate-600 dark:text-slate-400">
                <div className="border-r border-slate-100 dark:border-slate-900 pr-3">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Whole Body</span>
                  <strong className="text-red-500 font-bold">50 mSv / year</strong>
                </div>
                <div className="border-r border-slate-100 dark:border-slate-900 pr-3">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Lens of Eye</span>
                  <strong className="text-red-400">150 mSv / year</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Hands & Skin</span>
                  <strong className="text-red-400">500 mSv / year</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. POSITIONING & CASES */}
      {activeSubTab === "positioning" && (
        <div className="animate-fade-in flex flex-col gap-6">
          <CasesAndPositioning />
        </div>
      )}

      {/* 6. CONTRAST MEDIA */}
      {activeSubTab === "contrast" && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Contrast details and selector Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Clinical Procedures</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50">Contrast Pharmacology & Safety</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Contrast agents artificially change tissue density to outline vessels, gastrointestinal patency, or brain vascularization on X-Ray, CT, and MRI studies.
                </p>
              </div>

              {/* Selector */}
              <div className="flex flex-col gap-2">
                {[
                  { id: "iodine", label: "Iodinated Contrast Agents", desc: "Used in CT & fluoroscopy (IV or oral). High atomic number (Z=53) blocks X-rays." },
                  { id: "barium", label: "Barium Sulfate (BaSO4)", desc: "Insoluble suspension used exclusively for GI tract. Never give if perforation suspected." },
                  { id: "gadolinium", label: "Gadolinium-Based Contrast (GBCA)", desc: "Paramagnetic metal used in MRI. Shortens T1 relaxation, showing bright vascular pools." }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setContrastCategory(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all text-xs font-semibold cursor-pointer flex flex-col gap-1 ${
                      contrastCategory === item.id
                        ? "bg-blue-50/80 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <strong className="text-slate-950 dark:text-slate-50">{item.label}</strong>
                    <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 leading-normal">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Warning box */}
              <div className="bg-amber-5/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl text-xs text-amber-950 dark:text-amber-100 flex gap-3 items-start shadow-sm font-medium">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block mb-1.5 uppercase tracking-wider text-[10px] font-display text-amber-900 dark:text-amber-200">Critical Pre-screening Guidelines:</span>
                  <p className="leading-relaxed">
                    Always verify patient <strong>eGFR (kidney function)</strong> before administering IV iodinated contrast or gadolinium, as poor clearance can trigger Contrast-Induced Nephropathy (CIN) or Nephrogenic Systemic Fibrosis (NSF).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Extravasation Checklist Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1 block">Procedural Checklist</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50">Contrast Extravasation Protocol</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Extravasation occurs when fluid leaks from a blood vessel into surrounding soft tissues during rapid injector infusion (often 3-5 mL/sec). Practice the emergency protocol below:
                </p>
              </div>

              {/* Protocol steps */}
              <div className="flex flex-col gap-3">
                {extravasationSteps.map((s, i) => (
                  <div 
                    key={s.step}
                    onClick={() => toggleStep(i)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      s.checked 
                        ? "bg-emerald-50/50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                      s.checked 
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-slate-300 dark:border-slate-700 text-slate-400"
                    }`}>
                      {s.checked ? <Check className="w-3 h-3" /> : s.step}
                    </div>
                    <div className="text-xs leading-relaxed">
                      <strong className={`${s.checked ? "line-through opacity-70" : ""}`}>{s.text}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Done message */}
              {extravasationSteps.every(s => s.checked) && (
                <div className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl text-xs text-center font-bold animate-pulse">
                  🎉 Good job! You have fully mastered the contrast extravasation safety procedure.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
