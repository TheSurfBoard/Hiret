"use client";
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { analyzeResume } from '../actions';
import ReactMarkdown from 'react-markdown';

// Helper to get color based on score
const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg--500";
  return "bg-red-500";
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
    if (!jd || !file) {
      alert("Please enter JD and upload a Resume PDF!");
      return;
    }
    setLoading(true);
    setResult('');
    setScore(0);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        const data = await analyzeResume(jd, base64Content, file.name);

        // Extract Score Logic
        const match = data.match(/Match Score:\s*(\d+)%/i);
        const extractedScore = match ? parseInt(match[1]) : 0;
        setScore(extractedScore);

        setResult(data);
        setLoading(false);
      };
    } catch (error) {
      console.error("Error:", error);
      alert("Analysis failed.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50 selection:bg-brand-100 selection:text-brand-900">
      <NavBar />

      <div className="pt-28 pb-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header - Fixed Spacing & &nbsp; */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-600 text-xs md:text-sm font-semibold tracking-wide border border-brand-100">
            AI POWERED
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            Check Your Resume <br />
            <span className="text-brand-600 inline-block mt-2">
              Score
            </span>
            &nbsp;&&nbsp;
            <span className="text-brand-600 inline-block mt-2">
              Insights
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Paste the Job Description and upload your resume to get a detailed ATS score.
          </p>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* JD Input */}
          <div className="group bg-white p-5 md:p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ring-4 ring-transparent focus-within:ring-brand-50/50 focus-within:border-brand-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <label className="text-sm font-bold text-gray-900 font-display">Job Description(Text)</label>
            </div>
            <textarea
              className="w-full h-48 md:h-64 p-4 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-brand-500/20 text-sm leading-relaxed resize-none transition-all placeholder:text-gray-400 text-gray-700"
              placeholder="Paste the JD here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          {/* File Upload & Privacy Note */}
          <div className="flex flex-col">
            <div className="group bg-white p-5 md:p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <label className="text-sm font-bold text-gray-900 font-display">Your Resume (PDF)</label>
              </div>

              <div className="flex-grow w-full h-48 md:h-64 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 relative overflow-hidden group-hover:border-brand-300 group-hover:bg-brand-50/10 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />

                <div className="text-center p-6 relative z-10">
                  {file ? (
                    <div className="animate-in fade-in zoom-in duration-300">
                      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-red-500 border border-red-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="font-bold text-gray-900 truncate max-w-[150px] md:max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-green-600 mt-1 font-medium">Ready to scan</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <p className="text-gray-900 font-medium text-sm">Upload Resume</p>
                      <p className="text-xs text-gray-400 mt-1">PDF only (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Added Privacy Note */}
            <div className="flex items-start gap-3 px-2">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="font-semibold text-gray-500">Privacy Note:</span> We respect your privacy. Resumes are processed in real-time for analysis and are <span className="underline">never stored</span> on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mb-16">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full md:w-auto px-10 py-4 bg-brand-600 text-white rounded-full font-bold text-lg hover:bg-brand-700 transition shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
          >
            {loading ? "Analyzing..." : "Check My Score 🚀"}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div className="animate-fade-in-up space-y-8">

            {/* Linear Progress Bar Section */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-4 gap-2">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900">Compatibility Score</h2>
                  <p className="text-gray-500 text-sm mt-1">Match based on JD keywords & skills</p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold text-2xl font-display ${getScoreBg(score)} ${getScoreColor(score)}`}>
                  {score}%
                </div>
              </div>

              {/* Linear Bar Container */}
              <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden relative">
                {/* Animated Fill */}
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreColor(score).split(' ')[0]}`}
                  style={{ width: `${score}%` }}
                >
                  {/* Shine Effect */}
                  <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                </div>
              </div>
            </div>

            {/* Detailed Report */}
            <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-200 shadow-xl">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="hidden" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-display font-bold text-brand-800 mt-8 mb-4 border-l-4 border-brand-500 pl-4" {...props} />,
                    p: ({ node, ...props }) => <p className="text-gray-600 text-base leading-relaxed mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="grid grid-cols-1 gap-4 my-6 list-none pl-0" {...props} />,
                    li: ({ node, ...props }) => (
                      <li className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors flex flex-col md:flex-row gap-3 items-start shadow-sm" {...props}>
                        <div className="mt-1 p-1.5 bg-white rounded-full shadow-sm text-brand-600 shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="flex-1 text-sm md:text-base">{props.children}</div>
                      </li>
                    ),
                    strong: ({ node, ...props }) => <span className="block text-gray-900 font-bold text-base md:text-lg mb-1" {...props} />,
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