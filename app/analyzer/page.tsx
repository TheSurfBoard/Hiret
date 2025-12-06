"use client";
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { analyzeResume } from '../actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

// Helper to get color based on score
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-rose-600 bg-rose-50 border-rose-200";
};

// Circular Progress Component (Better for Mobile than linear)
const ScoreRing = ({ score }: { score: number }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = "text-rose-500";
  if (score >= 50) strokeColor = "text-amber-500";
  if (score >= 80) strokeColor = "text-emerald-500";

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${strokeColor} transition-all duration-1000 ease-out`} />
      </svg>
      <span className="absolute text-xl font-bold font-display text-gray-900">{score}%</span>
    </div>
  );
};

export default function Analyzer() {
  const [jd, setJd] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!jd || !file) { alert("Please enter JD and upload a Resume PDF!"); return; }
    setLoading(true); setResult(''); setScore(0);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        const data = await analyzeResume(jd, base64Content, file.name);

        // 🔥 ROBUST REGEX FIX: Handles newlines, brackets, stars
        // Looks for "Overall Match" followed by any characters until it hits a number
        const match = data.match(/Overall Match[:\s\W]*(\d{1,3})/i);
        if (match && match[1]) {
          setScore(parseInt(match[1]));
        } else {
          setScore(0);
        }

        setResult(data);
        setLoading(false);
      };
    } catch (error) { console.error("Error:", error); alert("Analysis failed."); setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50 selection:bg-brand-100 selection:text-brand-900 font-sans">
      <NavBar />

      <div className="pt-28 pb-10 max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-12 h-12 object-contain" />
            </div>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Resume Analyzer
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Paste the JD and upload your resume. We'll give you a combined ATS score and feedback.
          </p>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Job Description</label>
            <textarea
              className="w-full h-40 bg-transparent border-0 p-0 text-sm resize-none focus:ring-0 text-gray-800 placeholder:text-gray-300"
              placeholder="Paste JD text here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center relative hover:border-brand-300 transition-all">
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="p-4">
              {file ? (
                <div>
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="font-bold text-sm text-gray-900 truncate max-w-[150px]">{file.name}</p>
                </div>
              ) : (
                <div>
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <p className="font-bold text-sm text-gray-900">Upload PDF</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg disabled:opacity-70 mb-12 flex items-center justify-center gap-2"
        >
          {loading ? "Scanning Resume..." : "Analyze Now ✨"}
        </button>

        {/* 🔥 UNIFIED REPORT CARD (Single Component) */}
        {result && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">

            {/* 1. Top Section: Score & Verdict */}
            <div className="bg-gray-50/50 p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
              {/* Score Ring */}
              <div className="shrink-0">
                <ScoreRing score={score} />
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Analysis Complete</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We found a <span className={`font-bold ${getScoreColor(score).split(' ')[0]}`}>{score}% match</span> based on the keywords and skills found in your resume compared to the job description.
                </p>
              </div>
            </div>

            {/* 2. Scrollable Report Body */}
            <div className="p-6 md:p-8">
              <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: () => null, // Hide H1
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2" {...props} />,
                    // Compact Tables
                    table: ({ node, ...props }) => <div className="overflow-x-auto my-6 border border-gray-200 rounded-xl"><table className="w-full text-xs md:text-sm text-left" {...props} /></div>,
                    thead: ({ node, ...props }) => <thead className="bg-gray-50 text-gray-900 font-bold" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-3 whitespace-nowrap" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3 border-t border-gray-100" {...props} />,
                    // Clean Lists
                    ul: ({ node, ...props }) => <ul className="space-y-2 my-4 pl-0 list-none" {...props} />,
                    li: ({ node, ...props }) => (
                      <li className="flex items-start gap-3 text-sm bg-gray-50 p-3 rounded-lg border border-transparent hover:border-gray-200 transition-colors" {...props}>
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span className="flex-1">{props.children}</span>
                      </li>
                    ),
                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                    strong: ({ node, ...props }) => <span className="font-bold text-gray-900" {...props} />,
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}