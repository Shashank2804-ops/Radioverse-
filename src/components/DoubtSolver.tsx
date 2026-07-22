/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Send, Sparkles, BookOpen, Layers, RefreshCw, 
  HelpCircle, User, Check, Bookmark, FileText, ChevronRight, Play 
} from "lucide-react";

interface Flashcard {
  front: string;
  back: string;
}

interface SummarizerResult {
  summary: string;
  keyPoints: string[];
  flashcards: Flashcard[];
}

export default function DoubtSolver() {
  const [activeSubTab, setActiveSubTab] = useState<"chat" | "summarizer" | "explain-xray">("chat");
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s fast timeout

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "ping" }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (res.status === 404 || res.status >= 502) {
          setIsBackendAvailable(false);
        }
      } catch (err) {
        setIsBackendAvailable(false);
      }
    };

    checkApi();
  }, []);

  // 1. Chat/Doubt Solver State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your RadioVerse AI Study Coach. Ask me any questions about human anatomy, X-Ray physics, positioning techniques, or radiographic pathologies. How can I help you study today?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 2. Notes Summarizer State
  const [summarizerInput, setSummarizerInput] = useState("");
  const [summarizerTopic, setSummarizerTopic] = useState("");
  const [summarizerResult, setSummarizerResult] = useState<SummarizerResult | null>(null);
  const [summarizerLoading, setSummarizerLoading] = useState(false);
  const [summarizerError, setSummarizerError] = useState<string | null>(null);
  const [activeFlashcardIdx, setActiveFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // 3. Explain This X-Ray Simulator State
  const [explainTitle, setExplainTitle] = useState("Routine Chest X-Ray Evaluation");
  const [explainHistory, setExplainHistory] = useState("24-year-old female presenting with non-productive cough for 10 days. No fever.");
  const [explainFindings, setExplainFindings] = useState("Mild increased bronchovascular markings in both lung bases. Hemidiaphragms are sharp. Costophrenic recesses are clear. Heart size is normal.");
  const [explainResult, setExplainResult] = useState<string>("");
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Send message to Express API
  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Gather chat history formatted for backend
      const historyPayload = chatMessages.slice(1).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: historyPayload }),
      });

      if (!res.ok) {
        throw new Error("AI Coach failed to respond. Please ensure GEMINI_API_KEY is configured.");
      }

      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ **Error**: ${err.message || "An unexpected error occurred. Please verify your internet connection and API keys."}`
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Call Summarizer API
  const handleSummarize = async () => {
    if (!summarizerInput.trim() || summarizerLoading) return;
    setSummarizerLoading(true);
    setSummarizerResult(null);
    setSummarizerError(null);
    setFlashcardFlipped(false);
    setActiveFlashcardIdx(0);

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: summarizerInput.trim(),
          topicName: summarizerTopic.trim() || "Notes Material",
        }),
      });

      if (!res.ok) {
        throw new Error("Summarization failed. Please verify your text content.");
      }

      const data = await res.json();
      setSummarizerResult(data);
    } catch (err: any) {
      setSummarizerError(err.message || "An unexpected error occurred during summarization.");
    } finally {
      setSummarizerLoading(false);
    }
  };

  // Call Explain X-Ray API
  const handleExplainXRay = async () => {
    if (explainLoading) return;
    setExplainLoading(true);
    setExplainResult("");
    setExplainError(null);

    try {
      const res = await fetch("/api/ai/explain-xray", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseTitle: explainTitle,
          historyText: explainHistory,
          findingsText: explainFindings,
        }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed. Please verify your inputs.");
      }

      const data = await res.json();
      setExplainResult(data.explanation);
    } catch (err: any) {
      setExplainError(err.message || "An unexpected error occurred during case analysis.");
    } finally {
      setExplainLoading(false);
    }
  };

  if (!isBackendAvailable) {
    return (
      <div id="ai-doubt-solver-wrapper" className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
          <Bot className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-base font-extrabold text-[#0F172A] dark:text-slate-100">AI Coach Offline</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold max-w-md leading-relaxed">
          AI Coach will be available in a future update.
        </p>
        <div className="mt-5 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
          Connection Status: Offline / Unavailable
        </div>
      </div>
    );
  }

  return (
    <div id="ai-doubt-solver-wrapper" className="bg-slate-50 dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
      
      {/* AI Header Switcher tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-2 gap-2 flex-wrap">
        {[
          { id: "chat", label: "AI Doubt Solver & Coach", icon: Bot },
          { id: "summarizer", label: "AI Flashcards & Summaries", icon: Sparkles },
          { id: "explain-xray", label: "AI 'Explain This X-Ray' Assistant", icon: FileText }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-ai-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-[2px] cursor-pointer text-center leading-tight ${
                activeSubTab === tab.id
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

      {/* 1. Chat doubt solver panel */}
      {activeSubTab === "chat" && (
        <div id="ai-chat-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
          
          {/* Messages block */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-900 p-5 flex flex-col h-[450px] lg:h-full overflow-hidden shadow-sm">
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mb-4 max-h-[340px] lg:max-h-none">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 max-w-[85%] ${
                    msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      msg.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {/* Render message with basic support for markdown structure */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-start gap-3 self-start max-w-[85%] animate-pulse">
                  <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="p-3.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-tl-none border border-slate-200 dark:border-slate-800">
                    Formulating response, loading clinical parameters...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex gap-2 items-center border-t border-slate-150 dark:border-slate-850 pt-3">
              <input
                id="ai-chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask e.g. 'What is the function of nickel cup in cathode?' or 'Explain CTR ratio calculation'..."
                className="flex-1 px-4 py-2.5 h-10 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
              <button
                id="btn-ai-send"
                onClick={handleSendMessage}
                disabled={chatLoading}
                className="h-10 w-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl shadow-sm transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column Recommended Prompts & Guidelines */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Study Coach Topics
            </h3>

            <div className="flex flex-col gap-2">
              {[
                "Explain the anatomical boundaries of the lung lobes",
                "What is Compton scattering in diagnostic X-Ray?",
                "Provide a viva preparation checklist for shoulder PA positioning",
                "Summarize how the lead grid works to filter scatter radiation"
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInput(p)}
                  className="text-left p-3 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 text-[11px] text-slate-600 dark:text-slate-300 transition-all flex items-start gap-2 cursor-pointer shadow-sm"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{p}</span>
                </button>
              ))}
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-950 dark:text-blue-200 mt-auto leading-relaxed shadow-sm">
              <span className="font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px] text-blue-800 dark:text-blue-400">
                <BookOpen className="w-3.5 h-3.5" /> Educational Guidelines
              </span>
              The Coach utilizes safe server-side AI referencing OpenStax, Wikimedia Commons and public domain radiological textbooks to answer your queries.
            </div>
          </div>
        </div>
      )}

      {/* 2. Summarizer & Flashcard panel */}
      {activeSubTab === "summarizer" && (
        <div id="ai-summarizer-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[450px]">
          
          {/* Input text Column */}
          <div className="lg:col-span-5 flex flex-col gap-5 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Topic Name</span>
              <input
                id="sum-topic-input"
                type="text"
                value={summarizerTopic}
                onChange={(e) => setSummarizerTopic(e.target.value)}
                placeholder="e.g. Compton Scattering & Physics"
                className="w-full px-4 py-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Notes / Text to Summarize</span>
              <textarea
                id="sum-content-input"
                value={summarizerInput}
                onChange={(e) => setSummarizerInput(e.target.value)}
                placeholder="Paste paragraphs of textbook material, clinical guidelines, or lecture notes here. The AI will immediately analyze, summarize, and output 3 flipping study flashcards."
                className="w-full flex-1 p-4 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm resize-none h-[220px] leading-relaxed"
              />
            </div>

            <button
              id="btn-sum-execute"
              onClick={handleSummarize}
              disabled={summarizerLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl shadow-sm font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {summarizerLoading ? "Synthesizing Summary..." : "Generate Summary & Flashcards"}
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 flex flex-col gap-5 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Study Pack Results
            </h3>

            {summarizerError && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs flex gap-2.5 items-start">
                <span className="text-base leading-none">⚠️</span>
                <div>
                  <strong className="block font-bold mb-0.5">Synthesis Interrupted</strong>
                  <p className="leading-relaxed">{summarizerError}</p>
                </div>
              </div>
            )}

            {summarizerResult ? (
              <div className="flex flex-col gap-5 flex-1">
                {/* Brief Summary */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1.5 text-[10px]">AI Brief Summary</span>
                  <p className="text-slate-650 dark:text-slate-300 leading-relaxed font-sans">{summarizerResult.summary}</p>
                </div>

                {/* Key points */}
                <div className="text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2.5 text-[10px]">Key Points & Definitions</span>
                  <div className="flex flex-col gap-2.5">
                    {summarizerResult.keyPoints.map((kp, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-slate-650 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0 font-bold" />
                        <span className="leading-relaxed">{kp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Double sided Flashcards */}
                {summarizerResult.flashcards && summarizerResult.flashcards.length > 0 && (
                  <div className="mt-2 border-t border-slate-200 dark:border-slate-850 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Interactive Study Flashcard ({activeFlashcardIdx + 1} of 3)</span>
                    
                    {/* The Flipping card wrapper */}
                    <div 
                      onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                      className="w-full h-36 bg-blue-50/40 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/40 rounded-2xl flex items-center justify-center p-6 text-center cursor-pointer transition-all hover:border-blue-300 select-none relative overflow-hidden shadow-sm"
                    >
                      <div className="absolute top-2.5 right-4 text-[9px] font-bold text-blue-500 uppercase tracking-wider font-mono">
                        {flashcardFlipped ? "ANSWER / CLICK TO FLIP" : "TERM / CLICK TO FLIP"}
                      </div>
                      
                      <div className="text-xs sm:text-sm font-semibold font-sans text-slate-800 dark:text-slate-250 px-4 leading-relaxed">
                        {flashcardFlipped 
                          ? summarizerResult.flashcards[activeFlashcardIdx].back 
                          : summarizerResult.flashcards[activeFlashcardIdx].front}
                      </div>
                    </div>

                    {/* Selector Buttons */}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] text-slate-400 font-mono">Click card above to flip and reveal definitions</span>
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((idx) => (
                          <button
                            key={idx}
                            id={`btn-flash-${idx}`}
                            onClick={() => {
                              setActiveFlashcardIdx(idx);
                              setFlashcardFlipped(false);
                            }}
                            className={`w-7 h-7 rounded-full text-xs font-bold cursor-pointer border transition-all flex items-center justify-center ${
                              activeFlashcardIdx === idx
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "bg-slate-100 border-slate-200 text-slate-650 hover:bg-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12">
                <Sparkles className="w-10 h-10 text-blue-500 mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">No Study Materials Prepared Yet</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mt-2 leading-relaxed">
                  Paste textbook material in the left box and trigger AI Synthesis to build your brief summaries and flipping flashcards.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. Explain This X-Ray Simulator panel */}
      {activeSubTab === "explain-xray" && (
        <div id="ai-explain-xray-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[450px]">
          
          {/* Input details */}
          <div className="lg:col-span-5 flex flex-col gap-5 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Radiography Exam/Study Type</span>
              <input
                id="explain-title-input"
                type="text"
                value={explainTitle}
                onChange={(e) => setExplainTitle(e.target.value)}
                className="w-full px-4 py-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm animate-fade-in"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Patient History</span>
              <textarea
                id="explain-history-input"
                value={explainHistory}
                onChange={(e) => setExplainHistory(e.target.value)}
                className="w-full p-3.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 h-[65px] resize-none leading-relaxed shadow-sm"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Clinical Findings / Notes</span>
              <textarea
                id="explain-findings-input"
                value={explainFindings}
                onChange={(e) => setExplainFindings(e.target.value)}
                className="w-full flex-1 p-3.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 resize-none h-[120px] leading-relaxed shadow-sm"
              />
            </div>

            <button
              id="btn-explain-execute"
              onClick={handleExplainXRay}
              disabled={explainLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Bot className="w-4 h-4 text-white" />
              {explainLoading ? "Analyzing findings..." : "Request Educational Radiology Analysis"}
            </button>
          </div>

          {/* Explanation Output */}
          <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Radiological Analysis Report
            </h3>

            {explainError && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs flex gap-2.5 items-start mb-4">
                <span className="text-base leading-none">⚠️</span>
                <div>
                  <strong className="block font-bold mb-0.5">Analysis Interrupted</strong>
                  <p className="leading-relaxed">{explainError}</p>
                </div>
              </div>
            )}

            {explainResult ? (
              <div className="flex-1 overflow-y-auto max-h-[380px] bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-750 dark:text-slate-250 whitespace-pre-wrap font-sans shadow-inner">
                {explainResult}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12">
                <FileText className="w-10 h-10 text-blue-500 mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">No Analysis Requested</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mt-2 leading-relaxed">
                  Enter patient credentials and film parameters on the left, then click analyze to generate an anatomical structure-by-structure breakdown and clinical advisor notes.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
