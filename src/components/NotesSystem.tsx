/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Search, Star, Download, Sparkles, Bot, 
  Layers, Filter, ChevronRight, FileText, Check, 
  HelpCircle, AlertCircle, Bookmark, Printer, Share2,
  ChevronLeft, Award, ArrowRight, GraduationCap, Eye,
  BookMarked, Activity, PlayCircle, Plus, Compass
} from "lucide-react";
import DoubtSolver from "./DoubtSolver";

export interface StudyNote {
  id: string;
  title: string;
  semester: number;
  subject: string;
  duration: string;
  summary: string;
  theory: string;
  keyPoints: string[];
  clinicalPearls?: string[];
  vivaQuestions?: { q: string; a: string }[];
  commonMistakes?: string[];
  memoryTricks?: string[];
  relatedAnatomy?: { name: string; id: string };
  relatedRadiology?: { name: string; subTab: string };
  relatedQuiz?: { name: string };
  clinicalCorrelation?: string;
}

export const defaultNotes: StudyNote[] = [
  {
    id: "note-osteology",
    title: "Introduction to Bone Osteology & Markings",
    semester: 1,
    subject: "Anatomy",
    duration: "10 min read",
    summary: "A fundamental guide to skeletal terminology, bone structures (cortical vs cancellous), and crucial clinical landmarks.",
    theory: "Bones are living organs comprising specialized cells (osteoblasts, osteoclasts, osteocytes) embedded in a calcified extracellular matrix. For B.Sc. Radiographers, cortical bone is high-density (appears white/radiopaque on radiographs), while cancellous trabeculae provide structural support without excessive weight, showcasing the elegant lace-like patterns observed on fine-detail radiographs. Key terms include: Fossa (depression), Condyle (rounded articulation), Tuberosity (muscle attachment site), and Foramen (neurovascular passageway).",
    keyPoints: [
      "Cortical bone: Dense outer shell, highly radiopaque.",
      "Cancellous bone: Spongy inner network, showcases trabecular patterns.",
      "Foramina: Holes where vital nerves or blood vessels pass, crucial to locate on skull and spine films."
    ],
    clinicalPearls: [
      "Cortical bone fractures present as a sharp disruption/discontinuity of the high-density white outer border.",
      "Trabecular bone thinning in cancellous tissue is an early radiological indicator of osteopenia or metabolic bone disorders."
    ],
    vivaQuestions: [
      { q: "What is the difference between radiopaque and radiolucent?", a: "Radiopaque structures (like bone) absorb X-rays and appear white/light on film. Radiolucent structures (like air) allow X-rays to pass and appear dark/black." },
      { q: "Explain why standard projections must capture at least two perpendicular views.", a: "A single view can mask significant displacement or fracturing along the third dimension. Orthogonal views (e.g., AP and Lateral) are mandatory." }
    ],
    commonMistakes: [
      "Confusing vascular channels or normal suture lines for fracture margins. Fractures are typically razor-sharp and non-branching.",
      "Underestimating anatomical variants like accessory ossicles or sesamoids."
    ],
    memoryTricks: [
      "OsteoBlasts BUILD bone; OsteoClasts CLAW (resorb) bone.",
      "Fossa is a 'saucer' (shallow depression); Foramen is a 'foreman's doorway' (hole)."
    ],
    relatedAnatomy: { name: "Skull (Cranium)", id: "skull" },
    relatedRadiology: { name: "X-ray Physics Simulator", subTab: "xray" },
    relatedQuiz: { name: "Interactive Skull Bones Exam" },
    clinicalCorrelation: "Skeletal osteology landmarks are the bedrock of clinical positioning. Recognizing accurate alignment is crucial to detect dislocations and joint subluxation during emergency triage."
  },
  {
    id: "note-circuits",
    title: "Fundamentals of X-Ray Tube Circuits",
    semester: 1,
    subject: "Physics",
    duration: "15 min read",
    summary: "Understanding high-voltage generators, rectification, and step-up transformers in medical X-ray imaging.",
    theory: "To generate X-rays, electrons must be accelerated across a high-voltage gap (typically 50,000 to 125,000 volts). This requires step-up transformers. Additionally, filaments require low-voltage, high-current supply to induce thermionic emission (regulated by the focal spot selector). Rectifiers convert alternating current (AC) into steady direct current (DC) to ensure electrons only flow from the cathode to the anode, protecting the tube and improving exposure efficiency.",
    keyPoints: [
      "Step-up transformer: Multiplies incoming mains voltage to high kVp.",
      "Thermionic emission: Heating of the filament to boil off electrons.",
      "Rectification: Converts AC to DC, preventing destructive reverse current."
    ],
    clinicalPearls: [
      "The space-charge effect naturally limits thermionic emission at lower kVp settings, requiring specialized grid control in pulsed fluoroscopy.",
      "Using the line-focus principle provides a large actual focal spot for thermal heat loading while preserving a tiny effective optical focal spot for crisp resolution."
    ],
    vivaQuestions: [
      { q: "What is the role of a step-up transformer in radiography?", a: "It converts low incoming mains voltage to the high kilovoltage (kVp) required to accelerate electrons and produce diagnostic X-rays." },
      { q: "Why is a vacuum essential inside the glass envelope?", a: "To prevent colliding electrons from decelerating or ionizing air molecules, which would damage the tube and impair the focal beam." }
    ],
    commonMistakes: [
      "Assuming high voltage is applied to the filament itself. The filament operates on low voltage (10-12V) and high current to generate heat.",
      "Confusing tube current (mA, controls quantity) with tube voltage (kVp, controls penetrability/quality)."
    ],
    memoryTricks: [
      "mAmps govern AMount (quantity) of photons.",
      "kVp regulates Penetration (quality)."
    ],
    relatedAnatomy: { name: "Clavicle", id: "clavicle" },
    relatedRadiology: { name: "X-ray Physics Lab", subTab: "xray" },
    relatedQuiz: { name: "X-ray Tube Circuit Quiz" },
    clinicalCorrelation: "Stable voltage transformation and pulse rectification are required to maintain a monochromatic-like spectrum, preventing excess soft scatter from irradiating patients."
  },
  {
    id: "note-chest-pa",
    title: "Chest PA Projection Assessment Criteria",
    semester: 2,
    subject: "Positioning",
    duration: "12 min read",
    summary: "Critical criteria checklist for professional chest radiograph validation including scapulae rotation, inspiration, and rotation checks.",
    theory: "A professional posteroanterior (PA) chest radiograph must follow strict alignment parameters: 1. Full inspiration showing at least 10 posterior ribs. 2. Both clavicular heads equidistant from the central spinous processes (rotation check). 3. Scapulae rolled laterally outside the lung margins by forward shoulder posture. 4. No chin overlap over apical zones.",
    keyPoints: [
      "Rib counting: At least 10 posterior ribs confirm excellent inspiratory effort.",
      "Clavicle check: Asymmetry indicates patient rotation, altering the heart size appearance.",
      "Scapula clearance: Forward shoulder roll ensures clear lung borders."
    ],
    clinicalPearls: [
      "If the scapulae are not fully rolled out, they can mimic an apical mass or a pleural thickening segment.",
      "A poor inspiratory effort (<9 ribs) crowds pulmonary vasculature, which can falsely lead to a diagnosis of cardiomegaly or congestive failure."
    ],
    vivaQuestions: [
      { q: "Why is a Chest exam preferred in PA rather than AP configuration?", a: "PA configuration places the heart closer to the detector, minimizing geometric magnification of the mediastinal silhouette." },
      { q: "What confirms that a chest film is fully inspired?", a: "The visualization of at least 10 posterior ribs (or 6 anterior ribs) above the hemidiaphragms." }
    ],
    commonMistakes: [
      "Taking the radiograph on partial expiration. This exaggerates lung markings and cardiac borders.",
      "Allowing patient rotation, which makes one lung field appear darker than the other."
    ],
    memoryTricks: [
      "PA pushes heart close to plate, keeping Cardiac magnification low.",
      "10 ribs back (posterior) makes inspiration look grand!"
    ],
    relatedAnatomy: { name: "Rib 1 & Thoracic Cage", id: "rib_1" },
    relatedRadiology: { name: "Clinical Positioning Suite", subTab: "positioning" },
    relatedQuiz: { name: "Chest Radiography Checklist Quiz" },
    clinicalCorrelation: "Perfect postural alignment ensures diagnostic-grade films, reducing the need for repeated exposures and preserving low dose targets."
  },
  {
    id: "note-biodosimetry",
    title: "Radiation Biology & Occupational Dose Limits",
    semester: 2,
    subject: "Safety",
    duration: "14 min read",
    summary: "Investigating ionizing radiation damage, deterministic vs stochastic risks, and official ICRP yearly dose limits.",
    theory: "Ionizing radiation creates free radicals that can disrupt cellular DNA. Effects are classified into: Deterministic (tissue reactions with a direct threshold, e.g., skin burns or radiation-induced cataracts) and Stochastic (probabilistic risks where severity is independent of dose, e.g., carcinogenesis). Protection standards mandate that radiographers must not exceed 20 mSv/year (averaged over 5 years, with no single year exceeding 50 mSv).",
    keyPoints: [
      "Stochastic effects: Linear No-Threshold (LNT) model governs cancer risks.",
      "Deterministic effects: Direct threshold exists before tissue damage manifests.",
      "Lead shielding: 0.5mm lead equivalence blocks up to 99% of scatter radiation."
    ],
    clinicalPearls: [
      "Always stand at least 2 meters (6 feet) away from the X-ray tube and patient during portable mobile exposures to exploit the Inverse Square Law.",
      "The lens of the eye is highly susceptible to deterministic radiation cataracts, with a threshold limit of 15 mSv/year for radiation workers."
    ],
    vivaQuestions: [
      { q: "State the difference between stochastic and deterministic effects.", a: "Stochastic effects have no threshold dose, and their probability increases with dose (e.g., cancer). Deterministic effects have a threshold, and severity increases with dose (e.g., erythema)." },
      { q: "What is the annual occupational effective dose limit for radiographers?", a: "20 mSv per year, averaged over defined 5-year periods, with no single year exceeding 50 mSv." }
    ],
    commonMistakes: [
      "Failing to wear the TLD/OSL dose monitor badge properly, or leaving it exposed to heat or radiation when off-duty.",
      "Confusing equivalent dose (absorbed dose adjusted for radiation type) with effective dose (adjusted for tissue sensitivity)."
    ],
    memoryTricks: [
      "Stochastic is Probabilistic (S-P: Super Probable).",
      "Deterministic is Threshold-bound (D-T: Direct Threshold)."
    ],
    relatedAnatomy: { name: "Clavicle", id: "clavicle" },
    relatedRadiology: { name: "ALARA Shielding Simulator", subTab: "safety" },
    relatedQuiz: { name: "Radiation Biology Safety Exam" },
    clinicalCorrelation: "Applying ALARA (As Low As Reasonably Achievable) principles protects both clinical staff and patients from cumulative occupational exposures."
  },
  {
    id: "note-barium",
    title: "Gastrointestinal Procedures & Barium Suspensions",
    semester: 3,
    subject: "Contrast Media",
    duration: "11 min read",
    summary: "Contrast pharmacology of Barium Sulfate (BaSO4) and water-soluble iodinated contrast in GI fluoroscopy.",
    theory: "Barium Sulfate is an insoluble heavy metal compound with a high atomic number (Z=56), providing excellent radiopacity. However, because it is insoluble, it cannot be absorbed by the body. If a gastrointestinal perforation is suspected, Barium is strictly contraindicated, as leakage into the peritoneal cavity can trigger severe barium peritonitis. In such cases, water-soluble iodinated contrast (like Gastrografin) must be used instead.",
    keyPoints: [
      "Barium Sulfate: Non-absorbable, excellent contrast, strictly contraindicated in perforation.",
      "Gastrografin: Absorbable water-soluble alternative for suspected leakages.",
      "Patient care: Instruct patients to consume high volumes of water post-barium study to prevent bowel impaction."
    ],
    clinicalPearls: [
      "Double-contrast studies utilize both barium (positive contrast) and air/CO2 (negative contrast) to outline the fine mucosal lining, highlighting small polyps or ulcers.",
      "Always verify bowel sounds and hydration status before releasing a patient following a barium suspension procedure."
    ],
    vivaQuestions: [
      { q: "Why is Barium Sulfate contraindicated in suspected bowel perforations?", a: "Because it is chemically inert and insoluble. If it leaks into the peritoneum, it cannot be absorbed and can trigger severe, life-threatening chemical barium peritonitis." },
      { q: "What is double contrast imaging?", a: "Using a high-density positive agent (like Barium) along with a low-density negative agent (like air or carbon dioxide) to visualize mucosal linings." }
    ],
    commonMistakes: [
      "Using Barium when a perforation is suspected. Always use water-soluble iodinated agents like Gastrografin instead.",
      "Failing to instruct the patient to drink plenty of fluids post-exam, leading to severe constipation or fecal impaction."
    ],
    memoryTricks: [
      "Barium is Bad for Perforation (B-B).",
      "Gastrografin is Good for Gut Leaks (G-G)."
    ],
    relatedAnatomy: { name: "Clavicle", id: "clavicle" },
    relatedRadiology: { name: "Contrast Pharmacology Suite", subTab: "contrast" },
    relatedQuiz: { name: "Fluoroscopy Contrast Media Quiz" },
    clinicalCorrelation: "Correct contrast selection is a direct safety decision. Recognizing surgical risks saves patients from dangerous peritoneal foreign body reactions."
  },
  {
    id: "note-mri-t1t2",
    title: "MRI T1 & T2 Relaxation Mechanics",
    semester: 4,
    subject: "CT & MRI",
    duration: "15 min read",
    summary: "A breakdown of spin-lattice (T1) and spin-spin (T2) relaxation times and how pulse sequence timings create contrast.",
    theory: "MRI signal relies on hydrogen protons alignment under a strong magnetic field (B0). An RF pulse tips protons into the transverse plane. When the RF is turned off, protons undergo T1 relaxation (longitudinal magnetization recovery) and T2 relaxation (transverse magnetization decay). Fat recovers longitudinal alignment quickly, showing high signal (bright white) on T1. Water/fluid has slow transverse decay, retaining transverse magnetism longer, showing high signal (bright white) on T2.",
    keyPoints: [
      "T1 weight: Fluid is dark, fat is bright. Best for anatomical structures.",
      "T2 weight: Fluid is bright, fat is dark. Best for pathological edema.",
      "TR and TE: Repetition time and Echo time are carefully configured to select contrast weights."
    ],
    clinicalPearls: [
      "To spot pathological inflammation or joint effusion, look for bright water signals on T2-weighted scans.",
      "FLAIR (Fluid Attenuation Inversion Recovery) is a specialized T2 pulse sequence that suppresses free CSF water signal, making brain lesions near the ventricles stand out clearly."
    ],
    vivaQuestions: [
      { q: "How is a T2-weighted sequence configured using TR and TE?", a: "It requires a long Repetition Time (TR > 2000ms) to minimize T1 recovery effects, and a long Echo Time (TE > 80ms) to allow T2 decay differences to manifest." },
      { q: "Why is water bright on T2 and dark on T1?", a: "Water protons have slow longitudinal recovery (long T1, hence dark on T1) and slow transverse decay (long T2, retaining signal and appearing bright on T2)." }
    ],
    commonMistakes: [
      "Confusing TR and TE roles. TR primarily controls T1 contrast; TE primarily controls T2 contrast.",
      "Assuming bright signals on T1 are always pathological edema. Edema is primarily bright on T2."
    ],
    memoryTricks: [
      "TOne (T1) shows Fat first (Fat is bright).",
      "TTwo (T2) shows H2O (Water is bright/white)."
    ],
    relatedAnatomy: { name: "Skull (Cranium)", id: "skull" },
    relatedRadiology: { name: "MRI Sequence Simulator", subTab: "mri" },
    relatedQuiz: { name: "MRI Physics Masterclass Quiz" },
    clinicalCorrelation: "Understanding weighting parameters allows operators to adjust sequences dynamically, revealing occult bone marrow contusions or early cerebral ischemia."
  },
  {
    id: "note-contrast-kidney",
    title: "Gadolinium & Renal Nephrogenic Systemic Fibrosis (NSF)",
    semester: 5,
    subject: "Contrast Media",
    duration: "13 min read",
    summary: "The critical relationship between Gadolinium contrast administration, low kidney eGFR, and the fatal risk of NSF.",
    theory: "Gadolinium is a highly toxic heavy metal stabilized inside organic chelates (macrocyclic vs linear) to make it safe for human injection. In patients with severe renal impairment (eGFR < 30 mL/min/1.73m²), the gadolinium ion can decouple from its chelate due to prolonged body clearance. This free gadolinium triggers Nephrogenic Systemic Fibrosis (NSF), a catastrophic, irreversible systemic disease characterized by severe fibrotic thickening of the skin, joints, and internal organs.",
    keyPoints: [
      "eGFR screening: Mandatory before GBCAs injection to assess kidney function.",
      "Macrocyclic chelates: Stronger bond, much lower risk of de-chelation than linear agents.",
      "NSF symptoms: Tight, burning, wood-like thickening of extremities."
    ],
    clinicalPearls: [
      "Linear gadolinium chelates are much more prone to de-chelation in renal insufficiency, and have been largely replaced by highly stable macrocyclic formulations.",
      "Dialysis does not fully protect against NSF; administering Gadolinium to patients with eGFR < 15 must be avoided unless absolutely critical."
    ],
    vivaQuestions: [
      { q: "What is Nephrogenic Systemic Fibrosis (NSF) and what triggers it?", a: "NSF is a rare, severe, systemic fibrotic disorder triggered by gadolinium-based contrast agents in patients with severe kidney dysfunction (eGFR < 30)." },
      { q: "Why are macrocyclic chelates safer than linear chelates?", a: "Macrocyclic agents cage the gadolinium ion more tightly within a ring structure, dramatically reducing the risk of de-chelation and heavy metal deposition." }
    ],
    commonMistakes: [
      "Injecting gadolinium contrast without reviewing a current (within 30-90 days) serum creatinine or eGFR lab result.",
      "Assuming standard hydration protocols completely negate NSF risk in patients with end-stage renal disease."
    ],
    memoryTricks: [
      "Linear is Loose (higher risk of splitting).",
      "Macrocyclic is a cage (Holds ion tight!)."
    ],
    relatedAnatomy: { name: "Rib 1 & Thoracic Cage", id: "rib_1" },
    relatedRadiology: { name: "Contrast Pharmacology Suite", subTab: "contrast" },
    relatedQuiz: { name: "Contrast Media Safety Exam" },
    clinicalCorrelation: "Mandatory pre-exam eGFR screening acts as a high-value gatekeeper, preventing catastrophic, untreatable tissue fibroses."
  }
];
export default function NotesSystem() {
  const [notes, setNotes] = useState<StudyNote[]>(defaultNotes);
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [selectedSubject, setSelectedSubject] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [workspaceMode, setWorkspaceMode] = useState<"reader" | "assistant">("reader");
  const [shareTooltipVisible, setShareTooltipVisible] = useState(false);
  
  // Guided learning states
  const [progressStates, setProgressStates] = useState<Record<string, string>>({});
  const [activeRadTab, setActiveRadTab] = useState<"xray" | "ct" | "mri" | "ultrasound" | "cases">("xray");
  const [revealedVivas, setRevealedVivas] = useState<Record<number, boolean>>({});
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("section-summary");
  
  // MCQ state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Initialize activeNote from last opened lesson if it exists
  const [activeNote, setActiveNote] = useState<StudyNote>(() => {
    const saved = localStorage.getItem("last_opened_lesson");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (obj.tab === "notes" && obj.id) {
          const found = defaultNotes.find(n => n.id === obj.id);
          if (found) return found;
        }
      } catch (e) {}
    }
    return defaultNotes[0];
  });

  // Load progress and favorites from local storage
  useEffect(() => {
    const savedFav = localStorage.getItem("note_favorites");
    if (savedFav) {
      try {
        setFavorites(JSON.parse(savedFav));
      } catch (e) {}
    }

    const savedProgress = localStorage.getItem("lesson_progress_states");
    if (savedProgress) {
      try {
        setProgressStates(JSON.parse(savedProgress));
      } catch (e) {}
    }
  }, []);

  // Save last opened lesson & append to recently viewed on active note change
  useEffect(() => {
    if (activeNote) {
      // Clear quiz states for the new note
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setRevealedVivas({});
      setActiveRadTab("xray");

      // Save last opened
      const lessonInfo = {
        id: activeNote.id,
        title: activeNote.title,
        tab: "notes",
        desc: activeNote.summary,
        progress: 40,
        type: "note",
        timestamp: Date.now()
      };
      localStorage.setItem("last_opened_lesson", JSON.stringify(lessonInfo));

      // Add to recently viewed list
      try {
        const savedRecent = localStorage.getItem("recently_viewed_lessons");
        let recentList = savedRecent ? JSON.parse(savedRecent) : [];
        if (!Array.isArray(recentList)) recentList = [];
        // Unique and limited to 8
        recentList = [lessonInfo, ...recentList.filter((item: any) => item.id !== activeNote.id)].slice(0, 8);
        localStorage.setItem("recently_viewed_lessons", JSON.stringify(recentList));
      } catch (e) {
        console.error(e);
      }

      // Mark progress as "Reading" if not set yet
      const savedProgress = localStorage.getItem("lesson_progress_states") || "{}";
      try {
        const states = JSON.parse(savedProgress);
        if (!states[activeNote.id] || states[activeNote.id] === "Not Started") {
          states[activeNote.id] = "Reading";
          localStorage.setItem("lesson_progress_states", JSON.stringify(states));
          setProgressStates(states);
        }
      } catch (e) {}
    }
  }, [activeNote]);

  // Set up intersection observer to highlight sticky TOC section
  useEffect(() => {
    if (workspaceMode !== "reader") return;
    
    const sections = [
      "section-summary",
      "section-theory",
      "section-takeaways",
      "section-clinical-pearls",
      "section-vivas",
      "section-radiology-conn",
      "section-practice",
      "section-related"
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [activeNote, workspaceMode]);

  const toggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("note_favorites", JSON.stringify(updated));
  };

  const updateLessonProgress = (lessonId: string, status: string) => {
    const updated = { ...progressStates, [lessonId]: status };
    setProgressStates(updated);
    localStorage.setItem("lesson_progress_states", JSON.stringify(updated));
    
    // Also store total count of completed lessons
    const compCount = Object.values(updated).filter(s => s === "Completed").length;
    localStorage.setItem("completed_lessons_count", String(compCount));
  };

  const triggerAIPresentation = (feature: string) => {
    setAiFeedback(`"${feature}" is coming soon in a future RadioVerse artificial intelligence study update!`);
    setTimeout(() => setAiFeedback(null), 4000);
  };

  const navigateToTab = (tab: string, id?: string, subTab?: string) => {
    window.dispatchEvent(new CustomEvent('change-tab', {
      detail: { tab, id, subTab }
    }));
  };

  const handleNextLesson = () => {
    const currentIndex = defaultNotes.findIndex(n => n.id === activeNote.id);
    if (currentIndex < defaultNotes.length - 1) {
      setActiveNote(defaultNotes[currentIndex + 1]);
      scrollToTop();
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = defaultNotes.findIndex(n => n.id === activeNote.id);
    if (currentIndex > 0) {
      setActiveNote(defaultNotes[currentIndex - 1]);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    const el = document.getElementById("notes-system-wrapper");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const semMatch = selectedSemester === "all" || n.semester === selectedSemester;
    const subMatch = selectedSubject === "all" || n.subject === selectedSubject;
    const queryMatch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.theory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return semMatch && subMatch && queryMatch;
  });

  const handlePrintDownload = () => {
    window.print();
  };

  // Customized MCQs per note
  const getNoteMCQs = (noteId: string) => {
    switch (noteId) {
      case "note-circuits":
        return [
          {
            q: "Which element is primarily responsible for converting Alternating Current (AC) to Direct Current (DC) inside an X-ray circuit?",
            options: ["The high-voltage step-up transformer", "The filament selector resistor", "The diode rectifier bridge", "The induction stator motor"],
            correct: 2,
            rationale: "Rectifiers restrict electron movement to a single direction, converting sinusoidal AC into steady pulsating DC to prevent catastrophic reverse bombardment onto the cathode filament."
          },
          {
            q: "What is thermionic emission in medical imaging?",
            options: ["The production of photons at the anode focal spot", "The heating of a cathode filament to boil off free electrons", "The absorption of low-energy scatter in filter plates", "The spin-lattice decay rate of hydrogen nuclei"],
            correct: 1,
            rationale: "Thermionic emission occurs when low-voltage, high-current heating boils off valence electrons from the tungsten filament, forming an electron space charge cloud."
          },
          {
            q: "How does the Line-Focus Principle resolve conflict between high spatial resolution and thermal loading limits?",
            options: ["By using copper filtration to block low energy scatter", "By selecting a steep anode target angle, keeping the effective optical spot small while dispersing heat across a larger actual focal zone", "By increasing the kilovoltage peak to maximize beam penetration", "By utilizing a dual-filament grid control switch"],
            correct: 1,
            rationale: "Anode target angles (typically 12-15°) ensure that the projected effective focal spot (resolution) remains extremely sharp, while the actual physical track receives the heat load over a much wider path."
          }
        ];
      case "note-chest-pa":
        return [
          {
            q: "Which parameter is most reliable to confirm high-quality patient inspiration on a PA chest radiograph?",
            options: ["Visualization of 6 anterior ribs above the hemidiaphragms", "Visualization of at least 10 posterior ribs above the hemidiaphragms", "Symmetrical alignment of clavicular heads", "Complete lateral projection of the scapulae"],
            correct: 1,
            rationale: "Seeing 10 posterior ribs (or 6 anterior ribs) above the hemidiaphragm line verifies optimal inhalation. Inadequate inflation crowds the vascular tree, which can lead to a false positive for pulmonary congestion."
          },
          {
            q: "Why is a chest radiograph standardly acquired in the Posteroanterior (PA) projection rather than Anteroposterior (AP)?",
            options: ["To reduce patient skin dosage significantly", "To place the heart closer to the image receptor, minimizing geometric magnification of the mediastinal outline", "To naturally extend the lung apices above the clavicles", "To eliminate the need for a secondary grid system"],
            correct: 1,
            rationale: "PA orientation minimizes object-to-receptor distance (ORD) for the anteriorly located heart. This minimizes magnification, allowing clinicians to accurately evaluate cardiomegaly."
          },
          {
            q: "What indicates patient rotation on a PA chest projection?",
            options: ["The lung apices being partially obscured by the chin", "Asymmetrical distances between the medial ends of the clavicles and the central vertebral spinous processes", "Superimposition of the scapula edges over the outer chest margins", "The hemidiaphragms appearing at different heights"],
            correct: 1,
            rationale: "If the distance from the medial clavicle tips to the vertebral spinous line is unequal, the patient is rotated. This distorts the mediastinal silhouette and lung density."
          }
        ];
      case "note-biodosimetry":
        return [
          {
            q: "Under the Linear No-Threshold (LNT) model, how are Stochastic radiation risks characterized?",
            options: ["They possess a defined minimum threshold dose before any harm is manifest", "Their severity increases in direct proportion to the cumulative equivalent dose", "There is no safe threshold dose; the probability of the effect increases with cumulative exposure", "They are strictly limited to somatic tissues with low cellular turnover rates"],
            correct: 2,
            rationale: "Stochastic effects (like radiation-induced cancer) carry no safe minimum dose threshold. Higher doses increase the probability of an event, but its severity is independent of the triggering dose."
          },
          {
            q: "What is the annual occupational effective dose limit for registered radiographers recommended by the ICRP?",
            options: ["1 mSv per year", "20 mSv per year, averaged over 5 years (no single year exceeding 50 mSv)", "150 mSv per year", "500 mSv per year"],
            correct: 1,
            rationale: "Occupational guidelines restrict cumulative effective exposures to 20 mSv annually, providing a massive safety buffer well below threshold levels for deterministic injuries."
          },
          {
            q: "Which biological tissue is highly susceptible to deterministic damage, leading to radiation-induced cataracts?",
            options: ["The ocular lens", "Thyroid follicles", "Red bone marrow", "Skeletal muscle fibers"],
            correct: 0,
            rationale: "The lens of the eye consists of specialized proteins with very low clearance. Cumulative radiation damage leads to localized cell death and clouding (cataracts), with a deterministic threshold limit of 15 mSv/year."
          }
        ];
      case "note-barium":
        return [
          {
            q: "Why is Barium Sulfate (BaSO4) strictly contraindicated in cases of suspected gastrointestinal tract perforation?",
            options: ["It has an extremely low atomic number, leading to zero contrast resolution", "It is highly soluble in abdominal fluid, causing immediate systemic toxicity", "It is insoluble and chemically inert; if it leaks into the peritoneum, it cannot be cleared, triggering severe chemical peritonitis", "It interferes with immediate diagnostic ultrasound studies"],
            correct: 2,
            rationale: "Barium Sulfate cannot be absorbed or metabolized by peritoneal tissue. Leakage outside the gut wall results in permanent granulomatous deposition, triggering life-threatening chemical barium peritonitis."
          },
          {
            q: "Which agent should immediately be selected as an alternative for GI fluoroscopy when a perforation is suspected?",
            options: ["Linear Gadolinium chelates", "High-viscosity barium paste", "Water-soluble, absorbable iodinated contrast (e.g., Gastrografin)", "Inhaled carbon dioxide gas"],
            correct: 1,
            rationale: "Gastrografin is a water-soluble iodinated contrast. If it leaks, peritoneal capillaries safely absorb and excrete it via the kidneys, preventing chronic foreign body reactions."
          },
          {
            q: "What is the primary objective of a double-contrast GI exam?",
            options: ["To minimize total radiographer scatter dose", "To outline mucosal surface detail by coating the lining with barium while distending the lumen with air or carbon dioxide", "To accelerate the rate of gastric transit", "To combine fluoroscopy with high-resolution MRI scans"],
            correct: 1,
            rationale: "Double-contrast studies utilize a positive agent (barium) to coat walls and a negative agent (gas) to inflate the lumen, exposing subtle mucosal polyps, ulcers, or early carcinomas."
          }
        ];
      case "note-mri-t1t2":
        return [
          {
            q: "On a standard T1-weighted MRI sequence, how do adipose fat and free fluids appear?",
            options: ["Fat is bright (high signal); Fluid is dark (low signal)", "Fat is dark; Fluid is bright", "Both appear as bright white signal regions", "Both appear as dark signal voids"],
            correct: 0,
            rationale: "T1 relaxation measures longitudinal magnetization recovery. Adipose molecules release energy quickly (short T1), appearing bright. Fluid protons align slowly, appearing dark."
          },
          {
            q: "Which sequence configuration is essential to generate a T2-weighted MR image?",
            options: ["Short TR (Repetition Time) and Short TE (Echo Time)", "Long TR and Long TE", "Short TR and Long TE", "Long TR and Short TE"],
            correct: 1,
            rationale: "T2 weighting requires a long TR (>2000ms) to allow T1 signals to fully recover, and a long TE (>80ms) to allow differences in transverse spin decay to become visible."
          },
          {
            q: "What clinical scenario makes T2 weighting exceptionally valuable?",
            options: ["Evaluating cortical bone micro-fractures in high detail", "Detecting pathological edema, joint effusions, or localized inflammatory fluid accumulations", "Mapping dense calcification deposits", "Differentiating macrocyclic contrast agents"],
            correct: 1,
            rationale: "Most pathologies (inflammation, infection, trauma) are accompanied by localized edema. Because water has slow T2 decay, it remains bright on T2 images, highlighting lesions clearly."
          }
        ];
      case "note-contrast-kidney":
        return [
          {
            q: "What severe systemic pathology is triggered by gadolinium-based contrast in patients with severe renal failure (eGFR < 30)?",
            options: ["Acute liver failure", "Nephrogenic Systemic Fibrosis (NSF)", "Immediate anaphylactic shock", "Cardiovascular calcification syndrome"],
            correct: 1,
            rationale: "If kidney filtration is severely impaired, Gadolinium contrast remains in the body for an extended period, which can cause the toxic heavy metal ion to de-chelate and trigger severe, irreversible systemic fibrosis of the skin and internal organs."
          },
          {
            q: "Why do macrocyclic Gadolinium-Based Contrast Agents (GBCAs) carry a lower NSF risk than linear chelates?",
            options: ["They are completely cleared by the biliary tract instead of the kidneys", "They encapsulate the gadolinium ion in a tight, ring-like cage, making de-chelation extremely difficult", "They lack ionic charges entirely", "They are administered in much smaller volumes"],
            correct: 1,
            rationale: "Macrocyclic agents cage the gadolinium ion within a highly stable organic ring, preventing de-chelation even during prolonged retention in patients with renal impairment."
          },
          {
            q: "Which clinical screening parameter is mandatory before administering intravascular gadolinium contrast?",
            options: ["Blood pressure monitoring", "Serum eGFR (Estimated Glomerular Filtration Rate)", "Total white blood cell count", "Chest radiograph alignment checks"],
            correct: 1,
            rationale: "eGFR provides a reliable measure of renal function. Identifying patients with eGFR < 30 mL/min/1.73m² is crucial to prevent the administration of high-risk contrast agents."
          }
        ];
      default:
        // note-osteology
        return [
          {
            q: "Which bone landmark is defined as a rounded articular projection?",
            options: ["Fossa", "Condyle", "Tuberosity", "Foramen"],
            correct: 1,
            rationale: "Condyles are smooth, rounded articulation zones (e.g., femoral condyles, occipital condyles) that form complex joints."
          },
          {
            q: "On diagnostic films, why does cortical bone appear highly radiopaque (bright white)?",
            options: ["It has a high concentration of water protons", "It has high mass density and calcium content, absorbing more X-ray photons", "It consists of loose trabecular spaces", "It is highly vascularized"],
            correct: 1,
            rationale: "Cortical bone is densely packed with calcium hydroxyapatite. This high mass density blocks X-ray photons from reaching the detector, creating bright white/radiopaque regions."
          },
          {
            q: "Which cranial landmark is the weak junction overlying the middle meningeal artery?",
            options: ["Bregma", "Lambda", "Pterion", "Asterion"],
            correct: 2,
            rationale: "The pterion is the H-shaped intersection of the frontal, parietal, temporal, and sphenoid bones. Its thin structure bone lies directly over the middle meningeal artery; a fracture here can cause a life-threatening epidural hematoma."
          }
        ];
    }
  };

  const mcqs = getNoteMCQs(activeNote.id);

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    // If score is 3/3, automatically upgrade lesson progress to "Completed"
    const score = mcqs.reduce((acc, q, i) => acc + (selectedAnswers[i] === q.correct ? 1 : 0), 0);
    if (score === mcqs.length) {
      updateLessonProgress(activeNote.id, "Completed");
    }
  };

  const currentStatus = progressStates[activeNote.id] || "Not Started";

  return (
    <div id="notes-system-wrapper" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-premium-fade relative">
      
      {/* Floating AI Micro-toast notification */}
      {aiFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] border border-blue-500/30 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up max-w-sm">
          <Bot className="w-5 h-5 text-blue-400 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{aiFeedback}</span>
        </div>
      )}

      {/* 1. Left Control Panel Sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Workspace selector */}
        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-2.5xl border border-slate-100 dark:border-slate-900 flex gap-1.5 shadow-sm">
          <button
            onClick={() => setWorkspaceMode("reader")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              workspaceMode === "reader"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "text-slate-650 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
            }`}
          >
            Study Notes Directory
          </button>
          <button
            onClick={() => setWorkspaceMode("assistant")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              workspaceMode === "assistant"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "text-slate-650 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
            }`}
          >
            <Bot className="w-4 h-4" /> Smart Assistant
          </button>
        </div>

        {/* Directory Filtering controls (only visible in reader mode) */}
        {workspaceMode === "reader" && (
          <div className="premium-card-design flex flex-col gap-5">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 h-10 text-xs bg-slate-50 dark:bg-[#121A2C]/80 border border-slate-150 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Semester Filter */}
            <div className="flex flex-col gap-2">
              <span className="caption-text flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Select Semester</span>
              <div className="flex flex-wrap gap-1.5">
                {["all", 1, 2, 3, 4, 5].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem as any)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                      selectedSemester === sem
                        ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                        : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {sem === "all" ? "All Semesters" : `Sem ${sem}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-900/40 pt-4">
              <span className="caption-text flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Select Subject</span>
              <div className="flex flex-wrap gap-1.5">
                {["all", "Anatomy", "Physics", "Positioning", "Safety", "Contrast Media", "CT & MRI"].map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                      selectedSubject === subj
                        ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                        : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <span>{subj === "all" ? "All Subjects" : subj}</span>
                    <span className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-500">
                      {subj === "all" 
                        ? defaultNotes.length 
                        : defaultNotes.filter(n => n.subject === subj).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* List of filtered notes */}
            <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-900/40 pt-4 max-h-[380px] overflow-y-auto">
              <span className="caption-text">Notes Index ({filteredNotes.length})</span>
              <div className="flex flex-col gap-2 pr-1">
                {filteredNotes.map((n) => {
                  const status = progressStates[n.id] || "Not Started";
                  let badgeColor = "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-450";
                  if (status === "Reading") badgeColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450";
                  if (status === "Completed") badgeColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450";
                  if (status === "Revision Needed") badgeColor = "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450";

                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        setActiveNote(n);
                        scrollToTop();
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col gap-2.5 cursor-pointer hover:shadow-sm ${
                        activeNote.id === n.id
                          ? "bg-blue-50/60 border-blue-400 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/55"
                          : "bg-white border-slate-100 text-slate-650 dark:bg-[#0C111F] dark:border-slate-900 dark:text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full gap-2">
                        <span className="text-wrap break-words whitespace-normal flex-1 text-[#1E293B] dark:text-slate-100 leading-snug">{n.title}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                          {favorites.includes(n.id) && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-450 font-semibold w-full mt-1">
                        <span>Sem {n.semester} • {n.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide font-extrabold ${badgeColor}`}>
                          {status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Printable Study Guides helper */}
        <div className="bg-blue-50/50 dark:bg-blue-950/15 p-6 rounded-3xl border border-blue-100/60 dark:border-blue-900/30 text-xs">
          <strong className="text-slate-800 dark:text-slate-200 block mb-1">Printable Study Guides</strong>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            Open printer view to directly compile and save these curriculum notes to offline PDF booklets.
          </p>
          <button
            onClick={handlePrintDownload}
            className="btn-primary-design w-full h-11 flex items-center justify-center gap-2 cursor-pointer text-xs focus:ring-2 focus:ring-blue-500"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* 2. Right Workspace Section */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* READER VIEW */}
        {workspaceMode === "reader" && (
          <div className="flex flex-col gap-6 min-h-[500px]">
            
            {/* Elegant Sticky Reader Header */}
            <div className="premium-card-design pb-6 border-b border-slate-150 dark:border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
                    Semester {activeNote.semester} • {activeNote.subject}
                  </span>
                  
                  {/* Dynamic Progress Indicator Dropdown */}
                  <div className="relative inline-flex items-center">
                    <select
                      value={currentStatus}
                      onChange={(e) => updateLessonProgress(activeNote.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs ${
                        currentStatus === "Completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-700 dark:text-emerald-400"
                          : currentStatus === "Reading"
                          ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-700 dark:text-amber-450"
                          : currentStatus === "Revision Needed"
                          ? "bg-rose-50 dark:bg-rose-950/30 border-rose-300 text-rose-700 dark:text-rose-400"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-300 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Reading">Reading</option>
                      <option value="Completed">Completed</option>
                      <option value="Revision Needed">Revision Needed</option>
                    </select>
                  </div>
                </div>
                
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-tight">
                  {activeNote.title}
                </h1>
                <div className="flex items-center gap-3 text-secondary-text dark:text-slate-450 text-xs font-semibold">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {activeNote.duration}</span>
                  <span>•</span>
                  <span>Curriculum Study Guide</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 flex-shrink-0 self-stretch md:self-auto justify-end">
                <button
                  onClick={() => toggleFavorite(activeNote.id)}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    favorites.includes(activeNote.id)
                      ? "bg-amber-500/10 border-amber-400 text-amber-500 hover:bg-amber-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white hover:border-blue-400 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400 dark:hover:text-blue-400"
                  }`}
                  title="Bookmark Note"
                >
                  <Bookmark className={`w-5 h-5 ${favorites.includes(activeNote.id) ? "fill-amber-500 text-amber-500" : ""}`} />
                </button>

                <button
                  onClick={handlePrintDownload}
                  className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-white hover:border-emerald-400 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm focus:ring-2 focus:ring-blue-500"
                  title="Download / Print Study Note"
                >
                  <Download className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareTooltipVisible(true);
                    setTimeout(() => setShareTooltipVisible(false), 2000);
                  }}
                  className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white hover:border-blue-400 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400 dark:hover:text-blue-400 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative shadow-sm focus:ring-2 focus:ring-blue-500"
                  title="Copy Study Guide Link"
                >
                  <Share2 className="w-5 h-5" />
                  {shareTooltipVisible && (
                    <span className="absolute -bottom-10 right-0 bg-slate-900 dark:bg-slate-800 text-white text-[10px] py-1 px-2.5 rounded font-bold whitespace-nowrap shadow-md animate-fade-in z-50 border border-slate-700">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Split Screen Container for Reading Content and Sticky TOC on large viewports */}
            <div className="flex flex-col xl:flex-row gap-8 items-start relative w-full">
              
              {/* Left Reading area - highly polished readability */}
              <div className="flex-1 min-w-0 space-y-10">
                
                {/* 1. Summary Abstract */}
                <section id="section-summary" className="bg-slate-50 dark:bg-[#0E1321]/60 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-850 shadow-sm space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Summary Abstract
                  </span>
                  <p className="text-[14px] text-slate-750 dark:text-slate-300 leading-relaxed font-sans italic max-w-3xl">
                    "{activeNote.summary}"
                  </p>
                </section>

                {/* 2. Theory Content (Comfortable spacing and paragraph widths) */}
                <section id="section-theory" className="space-y-4">
                  <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-900 pb-2.5">
                    Lecture Materials
                  </h3>
                  <div className="text-[14.5px] text-slate-750 dark:text-slate-300 leading-relaxed tracking-normal font-sans whitespace-pre-wrap max-w-3xl space-y-4 font-medium">
                    {activeNote.theory}
                  </div>
                </section>

                {/* 3. Essential Takeaways */}
                <section id="section-takeaways" className="space-y-4 border-t border-slate-100 dark:border-slate-900 pt-8">
                  <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" /> Core Study Takeaways
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeNote.keyPoints.map((pt, i) => (
                      <div key={i} className="bg-slate-50/40 dark:bg-[#090D1A]/50 border border-slate-150/75 dark:border-slate-900 p-5 rounded-2xl flex flex-col gap-2.5 shadow-xs">
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">TAKEAWAY 0{i+1}</span>
                        <p className="text-[12px] text-slate-750 dark:text-slate-300 leading-relaxed font-sans font-semibold">
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. Clinical Pearls Section */}
                <section id="section-clinical-pearls" className="space-y-4 border-t border-slate-100 dark:border-slate-900 pt-8">
                  <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" /> Clinical Pearls & Diagnostic Wisdom
                  </h3>
                  <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-3xl p-6 space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Radiology craft is forged through direct observation. Memorize these invaluable real-world clinical warnings and positioning guidelines:
                    </p>
                    <div className="flex flex-col gap-3.5">
                      {(activeNote.clinicalPearls || [
                        "Always double-check patient identification and verify exam parameters before emitting the first beam.",
                        "Understand physical markers to correctly determine left/right orientation on complex overlapping shadows."
                      ]).map((pearl, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                            {i+1}
                          </span>
                          <p className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-semibold">
                            {pearl}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 5. Viva Exam Preparation Section */}
                <section id="section-vivas" className="space-y-4 border-t border-slate-100 dark:border-slate-900 pt-8">
                  <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" /> Viva Voce Oral Examination Training
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Prepare for oral academic panels with these actual mock viva questions. Click each card to reveal the complete clinical rationale and diagnostic answers:
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    {(activeNote.vivaQuestions || [
                      { q: "What is the primary physical interaction responsible for diagnostic radiography contrast?", a: "The photoelectric effect. Since it depends heavily on the atomic number cubed (Z³), dense calcium tissues absorb photons and appear white, contrasting beautifully with surrounding soft tissue shadow outlines." },
                      { q: "Define the inverse square law.", a: "The intensity of the radiation beam is inversely proportional to the square of the distance from the source. Doubling distance drops dose to one-fourth." }
                    ]).map((viva, idx) => (
                      <div
                        key={idx}
                        onClick={() => setRevealedVivas(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-purple-400/50 dark:hover:border-purple-900/50 transition-all shadow-xs"
                      >
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex gap-3 items-center">
                            <HelpCircle className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-bold text-[#1E293B] dark:text-slate-150">{viva.q}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                            {revealedVivas[idx] ? "Hide Answer" : "Click to Reveal"}
                          </span>
                        </div>
                        
                        {revealedVivas[idx] && (
                          <div className="mt-4 pt-4 border-t border-slate-150 dark:border-slate-800 animate-slide-down">
                            <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1.5">
                              <Check className="w-4 h-4 mt-0.5" /> MODEL ANSWER:
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-6">
                              {viva.a}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* 6. Advanced Common Mistakes & Memory Tricks */}
                <section id="section-mistakes" className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-150 dark:border-slate-900 pt-8">
                  {/* Common Mistakes */}
                  <div className="bg-rose-50/15 dark:bg-rose-950/5 border border-rose-500/20 rounded-3xl p-6 space-y-3.5 shadow-sm">
                    <h4 className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" /> Common Trainee Mistakes
                    </h4>
                    <ul className="space-y-2.5">
                      {(activeNote.commonMistakes || [
                        "Failing to collimate carefully, raising scatter radiation and reducing contrast.",
                        "Over-penetrating soft tissues with extreme kilovoltage settings."
                      ]).map((mistake, i) => (
                        <li key={i} className="text-xs text-slate-750 dark:text-slate-350 leading-relaxed font-semibold flex items-start gap-2">
                          <span className="text-rose-500">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Memory Tricks */}
                  <div className="bg-amber-50/15 dark:bg-amber-950/5 border border-amber-500/20 rounded-3xl p-6 space-y-3.5 shadow-sm">
                    <h4 className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Mnemonics & Memory Tricks
                    </h4>
                    <ul className="space-y-2.5">
                      {(activeNote.memoryTricks || [
                        "Remember AP puts distance on cardiac lines, PA keeps cardiac magnification fine!",
                        "Cathode is cold and negative; Anode adds energy positively."
                      ]).map((trick, i) => (
                        <li key={i} className="text-xs text-slate-750 dark:text-slate-350 leading-relaxed font-semibold flex items-start gap-2">
                          <span className="text-amber-500">★</span>
                          <span>{trick}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* 7. Radiology Connections Section */}
                <section id="section-radiology-conn" className="space-y-4 border-t border-slate-100 dark:border-slate-900 pt-8">
                  <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" /> Radiology Connectivity & Modality Imaging
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Examine this anatomy / clinical concept across distinct diagnostic imaging modalities. Select an interface to view detailed radiological findings:
                  </p>

                  <div className="border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm">
                    {/* Switcher bar */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-2 border-b border-slate-200 dark:border-slate-850 flex flex-wrap gap-1">
                      {["xray", "ct", "mri", "ultrasound", "cases"].map((tab) => {
                        const labels: Record<string, string> = {
                          xray: "X-ray View",
                          ct: "CT Scan",
                          mri: "MRI Sequence",
                          ultrasound: "Ultrasound (Future)",
                          cases: "Patient Cases"
                        };
                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveRadTab(tab as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                              activeRadTab === tab
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900"
                            }`}
                          >
                            {labels[tab]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Modality Content pane */}
                    <div className="p-6 bg-slate-50/20 dark:bg-[#070B14]/40 min-h-[160px] flex flex-col justify-center">
                      {activeRadTab === "xray" && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-extrabold uppercase">X-RAY BEAM PARAMETERS</span>
                          <h4 className="text-xs font-extrabold text-[#1E293B] dark:text-slate-150">Chest Projections & Bone Skeletal X-rays</h4>
                          <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">
                            Normal bony structures reveal highly-defined white margins corresponding to dense calcium absorption. Cortical boundaries must remain intact. When assessing chest projections, ensure full lung coverage from apices to costophrenic angles with correct lateral rotation of the shoulder grids.
                          </p>
                        </div>
                      )}

                      {activeRadTab === "ct" && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-extrabold uppercase">CT HOUNSFIELD ALIGNMENT</span>
                          <h4 className="text-xs font-extrabold text-[#1E293B] dark:text-slate-150">Axial Hounsfield Units & Windowing</h4>
                          <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">
                            Cortical bone registers at elevated values (+1000 HU to +2000 HU) inside fine bone windows. Lung parenchyma remains strongly hypodense (-600 HU to -800 HU). Use specialized lung windowing width (WW 1500) and levels (WL -600) to carefully visualize bronchial distributions.
                          </p>
                        </div>
                      )}

                      {activeRadTab === "mri" && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-extrabold uppercase">MRI PULSE PARAMETERS</span>
                          <h4 className="text-xs font-extrabold text-[#1E293B] dark:text-slate-150">T1 & T2 Magnetization Relaxations</h4>
                          <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">
                            Fluid appears very dark on T1 relaxation due to slow alignment recovery, but sparkles bright white on T2 transverse echo decay scans. Pathological edema and localized trauma effusion display bright indicators on T2, rendering pathological processes immediately apparent.
                          </p>
                        </div>
                      )}

                      {activeRadTab === "ultrasound" && (
                        <div className="text-center py-4 space-y-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-[10px] uppercase font-bold tracking-widest text-slate-500 animate-pulse">
                            Coming in a Future Update
                          </span>
                          <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed">
                            High-frequency micro-acoustic transducer wave simulation and echogenicity maps (hyperechoic vs anechoic) will launch soon.
                          </p>
                        </div>
                      )}

                      {activeRadTab === "cases" && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">CLINICAL TRIAGE PRESENTATION</span>
                          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                              <span>Patient: J. Doe • age: 42</span>
                              <span className="text-emerald-600 dark:text-emerald-400">ID: #RV-4929</span>
                            </div>
                            <h4 className="text-xs font-extrabold text-slate-[#1E293B] dark:text-slate-100">Suspected Cortical Boundary Interruption</h4>
                            <p className="text-[11px] text-slate-650 dark:text-slate-300 leading-relaxed">
                              <strong>Clinical History:</strong> Acute trauma following a heavy physical landing on an outstretched hand. Immediate pain localized over the thoracic clavicle.<br/>
                              <strong>Findings:</strong> Multiplanar radiographs reveal a sharp radiolucent fracture margin extending across the mid-shaft, displaying 3mm anatomical displacement.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* 8. Interactive MCQ Practice Section */}
                <section id="section-practice" className="space-y-5 border-t border-slate-100 dark:border-slate-900 pt-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Active MCQ Self-Grading Quiz
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Test your understanding of {activeNote.title} with these interactive, self-grading clinical questions:
                      </p>
                    </div>

                    <button
                      onClick={() => triggerAIPresentation("AI Quiz Generator")}
                      className="px-3.5 py-1.5 rounded-xl border border-blue-200 hover:border-blue-500/30 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 animate-pulse" /> Generate More MCQs
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {mcqs.map((mcq, qIdx) => (
                      <div key={qIdx} className="bg-slate-50/45 dark:bg-[#090D1A]/60 border border-slate-200/80 dark:border-slate-850 p-6 rounded-3xl space-y-4">
                        <div className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                            Q{qIdx+1}
                          </span>
                          <h4 className="text-xs sm:text-[13px] font-extrabold text-[#1E293B] dark:text-slate-150 leading-snug">
                            {mcq.q}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pl-7">
                          {mcq.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[qIdx] === oIdx;
                            const isCorrect = mcq.correct === oIdx;
                            let btnStyle = "bg-white dark:bg-slate-950 border-slate-100 hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:border-slate-900";
                            
                            if (isSelected) {
                              btnStyle = "bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-300";
                            }
                            
                            if (quizSubmitted) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-300";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-50 border-rose-400 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-300";
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle} focus:ring-1.5 focus:ring-blue-500`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && <Check className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="mt-3.5 pt-3.5 border-t border-slate-150 dark:border-slate-850 pl-7 space-y-1.5 animate-premium-fade">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> Diagnostic Rationale:
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                              {mcq.rationale}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-end gap-3 mt-1.5">
                      {quizSubmitted && (
                        <button
                          onClick={() => {
                            setSelectedAnswers({});
                            setQuizSubmitted(false);
                          }}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-650 dark:text-slate-300 hover:bg-slate-50 cursor-pointer transition-all"
                        >
                          Reset Practice Exam
                        </button>
                      )}
                      
                      <button
                        onClick={handleGradeQuiz}
                        disabled={Object.keys(selectedAnswers).length < mcqs.length}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98"
                      >
                        Grade Practice Quiz
                      </button>
                    </div>
                  </div>
                </section>

                {/* 9. Related Learning Bento Row */}
                <section id="section-related" className="space-y-4 border-t border-slate-150 dark:border-slate-900 pt-8 pb-4">
                  <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-widest">
                    Related Study Modules
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Related Anatomy */}
                    {activeNote.relatedAnatomy && (
                      <div
                        onClick={() => navigateToTab("anatomy", activeNote.relatedAnatomy?.id)}
                        className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-blue-400/60 dark:hover:border-blue-900/60 hover:shadow-xs transition-all flex flex-col justify-between h-32 group"
                      >
                        <span className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Related Anatomy Hub</span>
                        <h4 className="text-xs font-extrabold text-[#1E293B] dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-1">{activeNote.relatedAnatomy.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-auto">Study Structure <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    )}

                    {/* Related Radiology */}
                    {activeNote.relatedRadiology && (
                      <div
                        onClick={() => navigateToTab("radiology", undefined, activeNote.relatedRadiology?.subTab)}
                        className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-emerald-400/60 dark:hover:border-emerald-900/60 hover:shadow-xs transition-all flex flex-col justify-between h-32 group"
                      >
                        <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Related Radiology Lab</span>
                        <h4 className="text-xs font-extrabold text-[#1E293B] dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-1">{activeNote.relatedRadiology.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-auto">Run Simulation <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    )}

                    {/* Related Quiz */}
                    {activeNote.relatedQuiz && (
                      <div
                        onClick={() => navigateToTab("quizzes")}
                        className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-purple-400/60 dark:hover:border-purple-900/60 hover:shadow-xs transition-all flex flex-col justify-between h-32 group"
                      >
                        <span className="text-[9px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Related Practice Test</span>
                        <h4 className="text-xs font-extrabold text-[#1E293B] dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 mt-1">{activeNote.relatedQuiz.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-auto">Begin Practice Exam <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    )}
                  </div>

                  {activeNote.clinicalCorrelation && (
                    <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl text-xs space-y-1.5 mt-3 shadow-xs">
                      <span className="text-[9px] font-extrabold text-[#1E293B] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> Modality Clinical Correlation:
                      </span>
                      <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                        {activeNote.clinicalCorrelation}
                      </p>
                    </div>
                  )}
                </section>

                {/* Lesson Navigation Footer bar */}
                <div className="flex justify-between items-center border-t border-slate-150 dark:border-slate-900/60 pt-6 mt-10 w-full">
                  <button
                    onClick={handlePrevLesson}
                    disabled={defaultNotes.findIndex(n => n.id === activeNote.id) === 0}
                    className="px-4 py-2.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-900 dark:hover:bg-slate-900/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Lesson
                  </button>

                  <button
                    onClick={() => scrollToTop()}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Return to Top
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={defaultNotes.findIndex(n => n.id === activeNote.id) === defaultNotes.length - 1}
                    className="px-4 py-2.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-900 dark:hover:bg-slate-900/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Sticky Table of Contents Sidebar - only visible on large viewports xl+ */}
              <div className="w-52 shrink-0 hidden xl:block sticky top-[120px] h-fit p-1 bg-white dark:bg-[#080D1A]/5 border border-slate-200/50 dark:border-slate-900/50 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-4 py-2 mb-2 border-b border-slate-100 dark:border-slate-900">
                  On This Page
                </span>
                
                <nav className="flex flex-col gap-1 text-[11px] font-bold">
                  {[
                    { id: "section-summary", label: "Summary Abstract" },
                    { id: "section-theory", label: "Lecture Materials" },
                    { id: "section-takeaways", label: "Core Takeaways" },
                    { id: "section-clinical-pearls", label: "Clinical Pearls" },
                    { id: "section-vivas", label: "Viva Oral Practice" },
                    { id: "section-mistakes", label: "Common Mistakes" },
                    { id: "section-radiology-conn", label: "Imaging Modalities" },
                    { id: "section-practice", label: "Interactive Quiz" },
                    { id: "section-related", label: "Related Modules" }
                  ].map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          const el = document.getElementById(sec.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 font-extrabold border-l-2 border-blue-500 pl-3"
                            : "text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {sec.label}
                      </button>
                    );
                  })}
                </nav>

                <div className="border-t border-slate-100 dark:border-slate-900 mt-4 pt-3.5 px-4 pb-2">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-450 uppercase block">AI Study tools</span>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => triggerAIPresentation("AI Coach Translator")}
                        className="w-full text-left py-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        <Bot className="w-3.5 h-3.5" /> Ask AI Coach
                      </button>
                      <button
                        onClick={() => triggerAIPresentation("Topic Simplification")}
                        className="w-full text-left py-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Explain Topic
                      </button>
                      <button
                        onClick={() => triggerAIPresentation("Lecture Summarization")}
                        className="w-full text-left py-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        <FileText className="w-3.5 h-3.5" /> Summarize Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* AI SMART STUDY ASSISTANT WORKSPACE */}
        {workspaceMode === "assistant" && (
          <div className="animate-premium-fade flex flex-col gap-6">
            <div className="premium-card-design">
              <div className="flex items-center gap-2.5 mb-2">
                <Bot className="w-5 h-5 text-blue-600 animate-pulse" />
                <h2 className="section-heading text-slate-900 dark:text-slate-100">Smart Curriculum Synthesis Console</h2>
              </div>
              <p className="body-text mt-1">
                Need extra clarification? Ask the AI Coach to translate difficult concepts, paste clinical text for immediate abstract summarizing and custom flashcard building, or trigger full radiological patient report analysis.
              </p>
            </div>
            
            {/* Embedded core DoubtSolver component */}
            <DoubtSolver />
          </div>
        )}

      </div>

    </div>
  );
}
