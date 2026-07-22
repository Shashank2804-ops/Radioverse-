/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Settings, Info, Radio, Zap, HelpCircle, Eye } from "lucide-react";

interface MachinePart {
  id: string;
  name: string;
  description: string;
  function: string;
  radiographerRole: string; // practical tip for radiography student
}

const machineParts: MachinePart[] = [
  {
    id: "cathode",
    name: "Cathode Assembly (Filament & Focusing Cup)",
    description: "The negative electrode of the X-ray tube. It contains a tungsten filament which is heated to emit electrons, and a nickel focusing cup.",
    function: "Supplies electrons necessary for X-ray production through thermionic emission, and focuses the electron stream into a narrow beam directed towards the anode.",
    radiographerRole: "Selecting a 'small focal spot' on the console heats a smaller filament section, providing high-resolution fine detail (excellent for extremities but lower heat capacity)."
  },
  {
    id: "anode",
    name: "Rotating Anode (Tungsten Target)",
    description: "The positive electrode of the X-ray tube, consisting of a heavy rotating tungsten-rhenium disc attached to a molybdenum rotor.",
    function: "Serves as the target where high-speed electrons are abruptly decelerated, converting kinetic energy into X-radiation (1%) and heat (99%).",
    radiographerRole: "Rotating anodes spin at up to 10,000 RPM to distribute intense heat. Pre-heat your tube before high-dose exposures to prevent anode cracking."
  },
  {
    id: "collimator",
    name: "Lead Leaf Collimator Assembly",
    description: "A beam-limiting device containing sets of adjustable lead shutters, situated directly beneath the X-ray tube window.",
    function: "Restricts the dimensions of the primary X-ray beam to the region of interest, reducing patient dose and scatter radiation.",
    radiographerRole: "Always collimate tightly to the body part borders. Excellent collimation dramatically improves image contrast by reducing Compton scatter."
  },
  {
    id: "glass-envelope",
    name: "Evacuated Glass/Metal Envelope",
    description: "A vacuum tube housing that encloses the cathode and anode assemblies, made of heat-resistant Pyrex glass or metal.",
    function: "Maintains a high vacuum to prevent electrons from colliding with gas molecules, and provides electrical insulation.",
    radiographerRole: "Over time, tungsten vaporizes and deposits on the glass, causing tube arcing. Metal envelopes resist this and extend tube lifespan."
  },
  {
    id: "housing",
    name: "Protective Lead-Lined Tube Housing",
    description: "A heavy cast-steel housing lined with lead and filled with dielectric oil surrounding the glass envelope.",
    function: "Protects against mechanical shock, isolates high voltages, cools the tube (via oil thermal dissipation), and blocks leakage radiation.",
    radiographerRole: "Federal regulations require that leakage radiation must not exceed 100 mR/hour at a distance of 1 meter when operated at maximum capacity."
  }
];

export default function XrayMachine() {
  const [selectedPart, setSelectedPart] = useState<MachinePart>(machineParts[0]);
  const [activeTab, setActiveTab] = useState<"diagram" | "physics" | "safety">("diagram");

  return (
    <div id="xray-machine-module" className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm">
      
      {/* Top Section Nav Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2 flex-wrap">
        {[
          { id: "diagram", label: "Interactive Schematic", icon: Settings },
          { id: "physics", label: "Production Physics", icon: Zap },
          { id: "safety", label: "Radiation Safety (ALARA)", icon: Shield }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-machine-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-[2px] cursor-pointer text-center leading-tight ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <IconComp className="w-4 h-4 flex-shrink-0" />
              <span className="truncate sm:text-wrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "diagram" && (
        <div id="machine-diagram-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Interactive Tube Graphic Block */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute top-4 left-4 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              Interactive X-Ray Tube Assembly
            </span>

            {/* Schematic SVG */}
            <svg viewBox="0 0 450 250" className="w-full max-w-md h-auto my-6 select-none">
              <defs>
                {/* Radial gradients for glowing effects */}
                <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                </radialGradient>
              </defs>

              {/* Protective Tube Housing boundary */}
              <rect x="30" y="30" width="390" height="170" rx="15" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" className="dark:fill-slate-950 dark:stroke-slate-800" />
              <text x="40" y="50" className="text-[9px] fill-slate-400 dark:fill-slate-600 font-mono font-bold tracking-wider">LEAD-LINED HOUSING</text>

              {/* Dielectric Oil Filling */}
              <rect x="35" y="35" width="380" height="160" rx="10" fill="#2563eb" fillOpacity="0.03" />

              {/* Glass Envelope Outline */}
              <path d="M 80,70 L 370,70 Q 390,115 370,160 L 80,160 Q 60,115 80,70 Z" fill="#f8fafc" fillOpacity="0.85" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-900" />
              <text x="145" y="85" className="text-[8px] fill-slate-400 font-bold uppercase tracking-wider">Glass Vacuum Envelope</text>

              {/* Cathode Assembly (Left) */}
              <g className="cursor-pointer" onClick={() => setSelectedPart(machineParts[0])}>
                {/* Cathode Block */}
                <rect x="90" y="100" width="40" height="40" rx="6" fill={selectedPart.id === "cathode" ? "#eff6ff" : "#ffffff"} stroke={selectedPart.id === "cathode" ? "#2563eb" : "#94a3b8"} strokeWidth="2" className="dark:fill-slate-950" />
                {/* Filament coiled loop */}
                <path d="M 105,115 Q 110,120 115,115 Q 120,120 125,115" stroke="#ef4444" strokeWidth="2" fill="none" />
                <text x="94" y="152" className="text-[8px] fill-slate-500 font-bold dark:fill-slate-400">CATHODE</text>
              </g>

              {/* Electron Stream (Glow/Arrows) */}
              <path d="M 135,120 L 260,110 M 135,123 L 260,115 M 135,117 L 260,105" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4,3" className="animate-pulse" />
              <circle cx="200" cy="113" r="15" fill="url(#electronGlow)" />

              {/* Rotating Anode (Right) */}
              <g className="cursor-pointer" onClick={() => setSelectedPart(machineParts[1])}>
                {/* Anode Disc bevel */}
                <path d="M 270,80 L 295,95 L 295,145 L 270,160 Z" fill={selectedPart.id === "anode" ? "#eff6ff" : "#f1f5f9"} stroke={selectedPart.id === "anode" ? "#2563eb" : "#475569"} strokeWidth="2" className="dark:fill-slate-950" />
                {/* Rotor Stem & Base */}
                <rect x="295" y="110" width="60" height="16" fill="#94a3b8" />
                <rect x="355" y="95" width="20" height="46" fill="#475569" />
                <text x="310" y="152" className="text-[8px] fill-slate-500 font-bold dark:fill-slate-400">ANODE TARGET</text>
              </g>

              {/* Glass Window & Collimator (Bottom Center) */}
              <g className="cursor-pointer" onClick={() => setSelectedPart(machineParts[2])}>
                {/* Tube window */}
                <path d="M 210,160 L 245,160" stroke="#ef4444" strokeWidth="3" />
                {/* Collimator Box */}
                <rect x="180" y="200" width="90" height="24" fill={selectedPart.id === "collimator" ? "#eff6ff" : "#ffffff"} stroke={selectedPart.id === "collimator" ? "#2563eb" : "#cbd5e1"} strokeWidth="1.5" className="dark:fill-slate-950" />
                {/* Lead shutters indicators */}
                <rect x="185" y="210" width="15" height="4" fill="#334155" />
                <rect x="250" y="210" width="15" height="4" fill="#334155" />
                <text x="195" y="238" className="text-[8px] fill-slate-500 font-bold dark:fill-slate-400">COLLIMATOR</text>
              </g>

              {/* X-Ray Useful Primary Beam */}
              <polygon points="210,215 150,250 300,250 240,215" fill="#f59e0b" fillOpacity="0.15" />
              <line x1="225" y1="165" x2="225" y2="245" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />

              {/* Click instruction */}
              <text x="225" y="25" textAnchor="middle" className="text-[9px] font-bold fill-blue-600 font-sans tracking-wider uppercase">
                ✦ Click colored components to explore hardware details ✦
              </text>
            </svg>
          </div>

          {/* Educational Details Panel */}
          <div className="lg:col-span-5 flex flex-col bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Component Details
              </h3>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Selected Component</h4>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">{selectedPart.name}</p>
              </div>

              <div className="text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">What is it?</span>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150/60 shadow-sm">
                  {selectedPart.description}
                </p>
              </div>

              <div className="text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">Anatomical / Electrical Function</span>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150/60 shadow-sm">
                  {selectedPart.function}
                </p>
              </div>

              <div className="text-xs bg-blue-50/70 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm">
                <span className="font-extrabold text-blue-950 dark:text-blue-150 flex items-center gap-2 mb-1.5 text-[10px] uppercase tracking-wider font-display">
                  <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Practical Radiographer Tip
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedPart.radiographerRole}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === "physics" && (
        <div id="machine-physics-panel" className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-900 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            X-Ray Production Physics
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-6">
            How do we generate X-Rays? Inside the high-vacuum glass tube, electrons are accelerated from the cathode to the rotating anode target using a massive voltage difference (measured in kilovolts peak, **kVp**). When these ultra-fast electrons slam into the tungsten anode atoms, they undergo two primary interactions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/30 shadow-sm">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span>1. Bremsstrahlung (Braking) Radiation</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                As a high-speed electron approaches a tungsten nucleus, the positive charge pulls on the negative electron, slowing it down and deflecting its course. The lost kinetic energy is immediately converted and emitted as an X-ray photon.
              </p>
              <div className="mt-4 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/65 dark:border-slate-900 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                💡 **Key Fact**: Accountable for **85% to 90%** of the standard diagnostic beam. This produces a continuous spectrum of energies.
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/30 shadow-sm">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <span>2. Characteristic Radiation</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                An incident electron collides with an inner-shell (K-shell) electron of a tungsten atom, ejecting it. An outer-shell electron (e.g. L-shell) falls down to fill the vacancy, emitting a discrete X-ray photon equal to the binding energy difference.
              </p>
              <div className="mt-4 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/65 dark:border-slate-900 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                💡 **Key Fact**: Only occurs above **69.5 kVp** (the binding energy of tungsten's K-shell). Emits a discrete line spectrum.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "safety" && (
        <div id="machine-safety-panel" className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-900 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-500" />
            Radiation Protection (ALARA Principles)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-6">
            Ionizing radiation can damage DNA and cellular structures, presenting stochastic (probabilistic) risks like cancer and deterministic (threshold-based) risks like tissue burns. B.Sc. Radiology students must memorize and implement the three cardinal principles of radiation safety:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">PRINCIPLE 1</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150 mt-3">Minimize Time</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                The total radiation dose is directly proportional to exposure time. Always optimize your settings and use high-speed equipment to keep exposures as brief as possible.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">PRINCIPLE 2</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150 mt-3">Maximize Distance</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                The **Inverse Square Law** dictates that doubling your distance from the radiation source reduces your exposure to **one-quarter (1/4)** of the original intensity.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">PRINCIPLE 3</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150 mt-3">Utilize Shielding</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Always stand behind lead-lined barriers in the control booth. Protect patients using thyroid collars, lead aprons (0.5 mm lead equivalent), and gonad shields.
              </p>
            </div>
          </div>

          <div className="bg-rose-50/70 dark:bg-rose-950/20 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-xs shadow-sm">
            <h4 className="font-extrabold text-rose-950 dark:text-rose-100 uppercase tracking-wider mb-3 font-display">Occupational Dose Limits for Radiographers</h4>
            <ul className="list-disc list-inside text-rose-900 dark:text-rose-200 space-y-2 mt-2 leading-relaxed font-medium">
              <li>**Whole Body Limit**: 20 mSv per year (averaged over 5 years, with no single year exceeding 50 mSv).</li>
              <li>**Lens of Eye**: 20 mSv per year to prevent radiation-induced cataracts.</li>
              <li>**Skin and Extremities**: 500 mSv per year.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
