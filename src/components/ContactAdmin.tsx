/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldAlert, Settings, Upload, Database, UserCheck, MessageSquare, 
  Send, CheckCircle, Sparkles, AlertCircle, BarChart3, HelpCircle 
} from "lucide-react";

export default function ContactAdmin() {
  const [activeTab, setActiveTab] = useState<"contact" | "admin">("contact");

  // Contact Form State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Admin Dashboard State
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminErr, setAdminErr] = useState("");

  // Upload simulation
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userMessage.trim()) return;
    setFeedbackSent(true);
    // Reset form
    setUserName("");
    setUserEmail("");
    setUserMessage("");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123" || adminPassword === "radiology") {
      setAdminLoggedIn(true);
      setAdminErr("");
    } else {
      setAdminErr("Invalid Admin credentials. Try 'admin123' for standard inspection.");
    }
  };

  const handleUploadSim = () => {
    if (uploading) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadedFileName("B.Sc._Radiology_Contrast_Agents_v2.pdf");

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadSuccess(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div id="contact-admin-module" className="flex flex-col gap-6 animate-premium-fade">
      
      {/* Tab Selectors */}
      <div className="bg-slate-150/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-wrap sm:flex-nowrap gap-2">
        <button
          id="tab-contact-form"
          onClick={() => setActiveTab("contact")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs transition-all cursor-pointer ${
            activeTab === "contact"
              ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold border border-slate-200/50 dark:border-slate-800/80"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold border border-transparent"
          }`}
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="truncate sm:text-wrap">Feedback & Support Desk</span>
        </button>
        <button
          id="tab-admin-dashboard"
          onClick={() => setActiveTab("admin")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs transition-all cursor-pointer ${
            activeTab === "admin"
              ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold border border-slate-200/50 dark:border-slate-800/80"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold border border-transparent"
          }`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="truncate sm:text-wrap">University Admin Portal</span>
        </button>
      </div>

      {activeTab === "contact" ? (
        /* 1. Contact and Feedback desk */
        <div id="contact-form-stage" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="premium-card-design flex flex-col justify-between">
            <div>
              <span className="caption-text block">Ask a Question</span>
              <h2 className="section-heading mt-2">
                B.Sc. Radiography Grievance Desk
              </h2>
              <p className="body-text mt-3">
                Need specific clinical explanations not answered by the Study Coach? Raise a query directly to our reviewing staff.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-650 dark:text-slate-300 space-y-2.5 mt-6 leading-relaxed shadow-sm">
              <span className="font-bold text-slate-850 dark:text-slate-150 block uppercase tracking-wider text-[10px]">⚡ Quick Help Guidelines</span>
              <p>• Response times are usually within 48 university working hours.</p>
              <p>• You may also request custom MCQ mock exam syllabus expansions.</p>
            </div>
          </div>

          <div className="premium-card-design">
            {feedbackSent ? (
              <div id="contact-success-panel" className="text-center py-8 flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-150">Grievance Ticket Raised!</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Your question has been logged successfully in the administrator database. We will review and append any necessary answers.
                </p>
                <button
                  id="btn-contact-reset"
                  onClick={() => setFeedbackSent(false)}
                  className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all"
                >
                  Send another query
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter full student credentials"
                    className="w-full px-4 py-2.5 h-10 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full px-4 py-2.5 h-10 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">What can we help you with?</label>
                  <textarea
                    id="contact-message"
                    required
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="e.g. Please add M.Sc. Radiology entrance syllabus, or correct a factual typo on the rib costal cartilage diagram."
                    className="w-full p-4 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent transition-all h-[110px] resize-none leading-relaxed shadow-sm"
                  />
                </div>

                <button
                  id="btn-contact-submit"
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Grievance Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* 2. Admin Portal block */
        !adminLoggedIn ? (
          /* Password protect panel */
          <div id="admin-login-stage" className="max-w-sm mx-auto bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-900 text-center shadow-sm my-6">
            <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100">University Administrator Credentials</h3>
            <p className="text-[11px] text-slate-400 mt-2 mb-5 leading-relaxed">
              Enter password to verify supervisor status. For assessment purposes, input <strong>admin123</strong>.
            </p>

            <form onSubmit={handleAdminLogin} className="flex flex-col gap-3.5">
              <input
                id="admin-pass-input"
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 h-10 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1.5 focus:ring-blue-600 focus:border-transparent text-center transition-all shadow-sm"
              />
              {adminErr && (
                <span className="text-[10px] text-rose-500 font-semibold block">{adminErr}</span>
              )}
              <button
                id="btn-admin-login"
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Verify Administrator Status
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Admin dashboard console */
          <div id="admin-dashboard-console" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Metrics */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Active Cohort", value: "1,420 students", icon: UserCheck, desc: "B.Sc. Enrolled" },
                { label: "Custom Quizzes", value: "3,892 generated", icon: Sparkles, desc: "AI Engine status active" },
                { label: "Grievance Logs", value: "12 Pending", icon: AlertCircle, desc: "Average response: 4 hrs" }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="premium-card-design p-5 flex items-center gap-3.5">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <span className="caption-text block">{m.label}</span>
                      <span className="font-extrabold text-slate-850 dark:text-slate-200 block text-sm mt-1">{m.value}</span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{m.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mock Action console uploads */}
            <div className="lg:col-span-6 premium-card-design p-6 flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-150 flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-3 mb-4">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Syllabus PDF & Resource Uploader
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Publish new notes, practical record templates, or question pools to the RadioVerse educational library instantly.
                </p>

                {uploadedFileName && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl text-xs border border-slate-150 dark:border-slate-800/80 mb-3 flex flex-col gap-2 font-mono shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-[200px] text-slate-700 dark:text-slate-305 font-semibold">{uploadedFileName}</span>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/20">{uploadProgress}%</span>
                    </div>
                    {uploadSuccess && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5 animate-premium-fade">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Notes successfully published to global storage!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                id="btn-admin-upload"
                onClick={handleUploadSim}
                disabled={uploading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Database className="w-4 h-4" />
                {uploading ? "Broadcasting syllabus array..." : "Select & Upload Syllabus PDF"}
              </button>
            </div>

            {/* Quick Metrics database */}
            <div className="lg:col-span-6 premium-card-design p-6 flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-150 flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-3 mb-3">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  System Health Logs
                </h3>
                
                <div className="space-y-2 text-xs font-mono text-slate-500 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl leading-relaxed border border-slate-200 dark:border-slate-800 shadow-inner">
                  <p>🟢 SERVER_NODE: Active on http://0.0.0.0:3000</p>
                  <p>🟢 GEMINI_API_KEY: Injected & Initialized</p>
                  <p>🟢 FIRESTORE_DATABASE: Mock Sandbox initialized</p>
                  <p>🟢 PORTAL_REGISTRY: 4 modules registered</p>
                </div>
              </div>

              <button
                id="btn-admin-logout"
                onClick={() => setAdminLoggedIn(false)}
                className="w-full py-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-650 font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer mt-4"
              >
                Lock Admin Console
              </button>
            </div>

          </div>
        )
      )}

    </div>
  );
}
