"use client";
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { analyzeResume } from '../actions';
import ReactMarkdown from 'react-markdown'; 

export default function Analyzer() {
  const [jd, setJd] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!jd || !file) { alert("Please enter JD and upload a Resume PDF!"); return; }
    setLoading(true); setResult('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        const data = await analyzeResume(jd, base64Content, file.name);
        setResult(data);
        setLoading(false);
      };
    } catch (error) { console.error("Error:", error); alert("Analysis failed."); setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">AI Resume <span className="text-brand-600">Analyzer</span></h1>
          <p className="text-gray-500">Paste the JD and upload your Resume PDF.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3">📋 Job Description (JD)</label>
            <textarea className="w-full h-72 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm resize-none" placeholder="Paste JD here..." value={jd} onChange={(e) => setJd(e.target.value)} />
          </div>
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col justify-center items-center text-center relative">
            <label className="block text-sm font-bold text-gray-700 mb-4">📄 Your Resume (PDF)</label>
            <div className="flex-grow w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="p-4">{file ? <p className="text-brand-600 font-bold">{file.name}</p> : <p className="text-gray-400">Click or Drag PDF</p>}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button onClick={handleAnalyze} disabled={loading} className="bg-brand-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-brand-900 transition shadow-xl disabled:opacity-50">
            {loading ? "Scanning..." : "Check My Score 🚀"}
          </button>
        </div>

        {result && (
          <div className="mt-16 bg-white p-8 rounded-[2rem] border border-gray-200 shadow-2xl animate-fade-in">
            <div className="prose prose-lg prose-blue max-w-none text-gray-700"><ReactMarkdown>{result}</ReactMarkdown></div>
          </div>
        )}
      </div>
    </main>
  );
}