/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Newspaper, Briefcase, FileText, Globe, GraduationCap, ArrowUpRight, 
  Search, ShieldAlert, Sparkles, Building, MapPin, Star, Bookmark, Calendar, User
} from "lucide-react";
import { NewsItem, JobItem } from "../types";

const mockNews: NewsItem[] = [
  {
    id: "n1",
    title: "AI in Radiology: FDA Approves New Chest X-Ray Fracture Classifier",
    category: "AI",
    date: "2026-07-10",
    summary: "The FDA has granted clearance to an autonomous deep-learning model capable of classifying non-displaced skeletal fractures with 98% diagnostic accuracy.",
    content: "The software uses deep convolutional networks trained on over 2.5 million orthopedic images to highlight cortical irregularities, assisting on-duty trauma radiographers during peak emergency room schedules.",
    author: "Dr. Amanda Chen, PhD"
  },
  {
    id: "n2",
    title: "Low-Dose CT Advancements Redefine Thoracic Screening Protocols",
    category: "research",
    date: "2026-07-08",
    summary: "New helical tube assemblies reduce radiation dose by 45% while preserving superior high-contrast resolution for pulmonary nodule analysis.",
    content: "By employing automated current modulation and advanced iterative reconstruction algorithms, pediatric and geriatric screening becomes substantially safer, satisfying stringent ALARA guidelines.",
    author: "Prof. Rajeswar Rao, HOD"
  },
  {
    id: "n3",
    title: "Dual-Energy Radiography: Double Exposure Secrets Revealed",
    category: "research",
    date: "2026-07-02",
    summary: "Researchers outline techniques for capturing bone-subtracted soft tissue images using rapid dual-voltage tube switches.",
    content: "By firing two distinct energy bursts (e.g., 60 kVp and 120 kVp) within milliseconds, the detector separates soft water-dense tissue from bone calcium, creating dual soft-tissue and bone-only radiographs without patient motion artifacts.",
    author: "Journal of Medical Radiography"
  },
  {
    id: "n4",
    title: "National Licensing Exam Board Publishes 2026 Syllabus Weightages",
    category: "technology",
    date: "2026-06-25",
    summary: "The national radiology board has increased the weighted scoring percentage of CT/MRI physics questions by 15% for upcoming license credentials.",
    content: "Candidates are highly encouraged to revise advanced magnetic pulse sequences, Gadolinium contra-indications, ALARA shielding, and dual-energy digital imaging systems which will form the majority of case-study questions.",
    author: "National Licensing Board Secretariat"
  },
  {
    id: "n5",
    title: "Radiological Technologist Career Trends: Advanced MRI Skills in High Demand",
    category: "career",
    date: "2026-06-18",
    summary: "Annual salary review shows medical imaging practitioners with macrocyclic contrast and cardiac-MRI training command a 25% premium in urban clinical centers.",
    content: "With high-resolution 3T MRI installations skyrocketing across top hospitals, hospitals are facing a shortage of certified radiographers who possess practical safety protocols for pacemakers and renal patient screenings.",
    author: "Indian Radiography Journal"
  }
];

const mockJobs: JobItem[] = [
  {
    id: "j1",
    title: "Intern Radiography Technologist",
    type: "internship",
    organization: "Apex Diagnostics & Research Centre",
    location: "New Delhi, DL",
    eligibility: "Completed B.Sc. Medical Imaging Technology or equivalent. Basic knowledge of radiation safety.",
    description: "Assist on-duty radiologists with patient positioning for digital X-Rays, dental OPGs, and contrast administration procedures. Excellent opportunity for clinical exposure.",
    applyLink: "https://example.com/apply"
  },
  {
    id: "j2",
    title: "Junior X-Ray & CT Operator (Govt Contract)",
    type: "government",
    organization: "All India Institute of Medical Sciences (AIIMS)",
    location: "Bhopal, MP",
    eligibility: "B.Sc. Radiology with state registration. Max age limit 30 years.",
    description: "Operate general purpose radiography suites and multi-slice CT scanners under administrative protocols. Maintain dose calibration sheets.",
    applyLink: "https://example.com/apply-aiims"
  },
  {
    id: "j3",
    title: "Master of Science (M.Sc.) in Medical Imaging Technology",
    type: "higher-studies",
    organization: "Post Graduate Medical Academy",
    location: "Mumbai, MH",
    eligibility: "B.Sc. Radiology or MIT with at least 55% marks aggregate.",
    description: "2-year research-oriented masters curriculum covering advanced MRI physics, nuclear medicine imaging, PET-CT, and artificial intelligence diagnostic development.",
    applyLink: "https://example.com/apply-msc"
  }
];

export default function NewsCareer() {
  const [activeTab, setActiveTab] = useState<"news" | "jobs">("news");
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Bookmarking news articles
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("news_bookmarked_articles");
    if (saved) {
      try {
        setBookmarkedArticles(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleBookmarkArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking card
    let updated: string[];
    if (bookmarkedArticles.includes(id)) {
      updated = bookmarkedArticles.filter(aId => aId !== id);
    } else {
      updated = [...bookmarkedArticles, id];
    }
    setBookmarkedArticles(updated);
    localStorage.setItem("news_bookmarked_articles", JSON.stringify(updated));
  };

  const filteredNews = mockNews.filter((n) => {
    const catMatch = selectedCategory === "all" || n.category === selectedCategory;
    const searchMatch = 
      n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(newsSearch.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div id="news-career-module" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-premium-fade">
      
      {/* 1. Left Sidebar Filter & Bookmark Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Top Tab switcher */}
        <div className="bg-slate-100/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-150 dark:border-slate-850 flex gap-2">
          <button
            onClick={() => {
              setActiveTab("news");
              setSelectedNews(null);
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center leading-tight ${
              activeTab === "news"
                ? "bg-blue-600 text-white shadow-sm font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-205 hover:bg-white dark:hover:bg-slate-950"
            }`}
          >
            <Newspaper className="w-4 h-4 flex-shrink-0" />
            <span className="truncate sm:text-wrap">Bulletin board</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("jobs");
              setSelectedNews(null);
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center leading-tight ${
              activeTab === "jobs"
                ? "bg-blue-600 text-white shadow-sm font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-205 hover:bg-white dark:hover:bg-slate-950"
            }`}
          >
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="truncate sm:text-wrap">Career Hub</span>
          </button>
        </div>

        {/* Categories Sidebar Filter (visible for News) */}
        {activeTab === "news" && !selectedNews && (
          <div className="premium-card-design p-5 flex flex-col gap-4">
            <span className="caption-text block">News Categories</span>
            <div className="flex flex-col gap-1">
              {["all", "career", "research", "technology", "AI"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex justify-between items-center ${
                    selectedCategory === cat
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <span>{cat === "all" ? "All Updates" : cat === "career" ? "Career News" : cat === "research" ? "Research Journals" : cat === "technology" ? "Exam Board" : "AI & Tech"}</span>
                  <span className="text-[10px] bg-slate-150 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-500 font-bold font-mono">
                    {cat === "all" ? mockNews.length : mockNews.filter(n => n.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarked news summary */}
        <div className="premium-card-design p-5 flex flex-col gap-3.5">
          <span className="caption-text flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-blue-600 animate-pulse" /> Bookmarked Articles
          </span>
          <div className="flex flex-col gap-2">
            {bookmarkedArticles.map((aId) => {
              const item = mockNews.find(n => n.id === aId);
              if (!item) return null;
              return (
                <button
                  key={aId}
                  onClick={() => {
                    setActiveTab("news");
                    setSelectedNews(item);
                  }}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all text-xs cursor-pointer flex flex-col gap-1"
                >
                  <strong className="text-wrap break-words whitespace-normal font-bold text-slate-800 dark:text-slate-200 block">{item.title}</strong>
                  <span className="text-[10px] text-slate-400 font-semibold block">{item.category} • {item.date}</span>
                </button>
              );
            })}
            {bookmarkedArticles.length === 0 && (
              <span className="text-[11px] text-slate-400 italic text-center py-4">No bookmarked articles.</span>
            )}
          </div>
        </div>

      </div>      {/* 2. Right News or Career Feed Stage */}
      <div className="lg:col-span-8">
        
        {activeTab === "news" ? (
          /* News Feed Grid list */
          selectedNews ? (
            /* Detailed News View */
            <div id="detailed-news-card" className="premium-card-design p-6 sm:p-8 flex flex-col gap-5 shadow-sm min-h-[400px]">
              <button
                id="btn-back-news-list"
                onClick={() => setSelectedNews(null)}
                className="text-xs text-blue-600 font-bold self-start hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Back to Bulletin Feed
              </button>
              
              <div className="border-b border-slate-100 dark:border-slate-900/60 pb-4">
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/40 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {selectedNews.category.toUpperCase()} UPDATE
                </span>
                <h2 className="section-heading mt-3 text-slate-900 dark:text-slate-50 leading-snug">
                  {selectedNews.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-450 mt-3.5 font-semibold">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Published {selectedNews.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> By {selectedNews.author}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium italic">
                  "{selectedNews.summary}"
                </p>
              </div>

              <p className="body-text text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {selectedNews.content}
              </p>

              <div className="bg-blue-50/70 dark:bg-blue-950/20 p-5 rounded-2xl text-xs text-slate-800 dark:text-slate-200 mt-4 leading-relaxed flex items-center gap-3 border border-blue-200 dark:border-blue-900/40 shadow-sm font-medium">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Full critique reviewed and published in medical imaging academic journals. Reference with caution for internal exams.</span>
              </div>
            </div>
          ) : (
            
            <div id="news-feed-list-panel" className="flex flex-col gap-6 animate-premium-fade">
              
              {/* Search filter bar */}
              <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="news-search-input"
                  type="text"
                  placeholder="Search bulletin articles..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 h-10 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400 dark:placeholder-slate-500 shadow-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredNews.map((n) => {
                  const isBookmarked = bookmarkedArticles.includes(n.id);
                  return (
                    <div
                      key={n.id}
                      id={`news-card-feed-${n.id}`}
                      onClick={() => setSelectedNews(n)}
                      className="premium-card-design premium-card-interactive p-5 hover:shadow-md transition-all flex flex-col justify-between min-h-[190px]"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {n.category}
                          </span>
                          
                          {/* Bookmark Toggle Icon */}
                          <button
                            onClick={(e) => toggleBookmarkArticle(n.id, e)}
                            className={`p-1 rounded-lg border transition-all cursor-pointer ${
                              isBookmarked
                                ? "bg-amber-500/10 border-amber-400 text-amber-500"
                                : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800"
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                          </button>
                        </div>
                        
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-3 line-clamp-2 leading-relaxed">
                          {n.title}
                        </h3>
                        <p className="body-text text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {n.summary}
                        </p>
                      </div>
                      <span className="text-[10px] text-blue-600 font-bold hover:underline self-start mt-4 block">
                        Read Analysis & Abstract →
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )

        ) : (
          /* Career Clinical postings section */
          <div id="career-hub-panel" className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-premium-fade">
            {mockJobs.map((job) => (
              <div
                key={job.id}
                id={`job-card-feed-${job.id}`}
                className="premium-card-design flex flex-col justify-between min-h-[260px]"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                      job.type === "internship"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/30"
                        : job.type === "government"
                        ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/30"
                        : "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900/30"
                    }`}>
                      {job.type}
                    </span>
                    {job.type === "higher-studies" ? (
                      <GraduationCap className="w-4.5 h-4.5 text-indigo-500" />
                    ) : (
                      <Building className="w-4.5 h-4.5 text-blue-500" />
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-3.5 leading-snug">
                    {job.title}
                  </h3>
                  <span className="text-[10px] text-slate-450 block mt-1.5 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.organization} • {job.location}
                  </span>

                  <div className="text-[11px] text-slate-500 dark:text-slate-450 mt-3 border-t border-slate-100 dark:border-slate-900/60 pt-2.5 line-clamp-3 leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-350 font-bold">Eligibility:</strong> {job.eligibility}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-900/60 pt-3 mt-4">
                  <span className="text-[10px] text-slate-400 font-bold font-mono">B.Sc. Radiology preferred</span>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
