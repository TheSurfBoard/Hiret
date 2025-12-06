"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface JobProps {
  role: string;
  company: string;
  location: string;
  type: string;
  logoColor?: string;
  applyLink?: string;
  date: string;
  experience?: string; // 🔥 Added Experience Prop
}

export default function JobCard({ role, company, location, type, logoColor = "bg-brand-100", applyLink = "#", date, experience }: JobProps) {
  
  const [copied, setCopied] = useState(false);

 
  const websiteLink = "https://thehiret.vercel.app"; 

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const shareToWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    // 🔥 UPDATED: Sends user to Hiret instead of direct application
    const message = `*HIRING ALERT* \n\nRole: *${role}*\nCompany: *${company}*\nLocation: *${location}*\nExperience: *${experience || "Not specified"}*\n\n *Apply via Hiret:* ${websiteLink}\n\n_Don't apply blindly! Use our AI Resume Analyzer first._`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔥 UPDATED: Copies Hiret link to clipboard
    navigator.clipboard.writeText(websiteLink);
  
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={applyLink} target="_blank" rel="noopener noreferrer" className="block h-full relative group">
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full">
        
        {/* --- TOP SECTION --- */}
        <div className="flex justify-between items-start mb-4">
          <div className={`h-12 w-12 rounded-2xl ${logoColor} flex items-center justify-center text-xl font-bold text-brand-600 uppercase shrink-0`}>
            {company.charAt(0)}
          </div>
          
          {/* 🔥 Badges Container */}
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 rounded-full bg-gray-50 text-xs font-semibold text-gray-500 border border-gray-100 whitespace-nowrap">
              {type}
            </span>
            {experience && (
              <span className="px-3 py-1 rounded-full bg-purple-50 text-xs font-semibold text-purple-600 border border-purple-100 whitespace-nowrap">
                💼 {experience}
              </span>
            )}
          </div>
        </div>

        {/* --- MIDDLE SECTION --- */}
        <div className="mb-6">
          <h3 className="font-display text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-brand-600 transition">
            {role}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {company} • {location}
          </p>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="flex items-end justify-between mt-auto">
          
          <span className="text-[10px] text-gray-400 font-medium pb-1">
            Posted: {formattedDate}
          </span>

          <div className="flex items-center gap-2">
            
            {/* WhatsApp Share Button */}
            <button 
              onClick={shareToWhatsApp}
              className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </button>

            {/* Copy Link Button */}
            <button 
              onClick={copyLink}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition relative"
              title="Copy Link"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              )}
            </button>

            {/* Apply Button */}
            <div className="flex items-center bg-brand-50 text-brand-600 px-4 py-2 rounded-full text-sm font-bold ml-1 transition group-hover:bg-brand-600 group-hover:text-white">
              Apply
            </div>

          </div>
        </div>
        
      </div>
    </Link>
  );
}