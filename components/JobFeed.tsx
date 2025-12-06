"use client";

import { useState } from "react";
import JobCard from "@/components/JobCard";

export default function JobFeed({ jobs }: { jobs: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");

  // Case -1: If no jobs available
  if (!jobs || jobs.length === 0) {
    return (
      <div className="col-span-3 text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mb-20">
        <p className="text-2xl font-bold text-gray-900 mb-2">No active openings 📭</p>
        <p className="text-gray-500">Please check back later!</p>
      </div>
    );
  }

  // 🔥 CASE 2: jobs available
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === "All Types" || 
      job.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* SEARCH & FILTER UI (Only shows when jobs exist) */}
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-grow relative">
          <span className="absolute left-4 top-3.5 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="Search by role or company..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white focus:ring-2 focus:ring-brand-500 transition text-gray-800 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="md:w-1/4">
          <select 
            className="w-full p-3 rounded-xl border-0 bg-white focus:ring-2 focus:ring-brand-500 text-gray-700 cursor-pointer h-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All Types">Filter by: All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* JOBS GRID - Displays Filtered Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              role={job.title} 
              company={job.company} 
              location={job.location} 
              type={job.type} 
              logoColor={job.logo_color || "bg-blue-100"} 
              applyLink={job.apply_link} 
              date={job.created_at} 
              experience={job.experience}
            />
          ))
        ) : (
           // Case 3: no matches available to posted jobs
           <div className="col-span-3 text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
             <p className="text-xl font-bold text-gray-900 mb-2">No jobs found 😔</p>
             <p className="text-gray-500">Try adjusting your search or filters.</p>
           </div>
        )}
      </div>
    </div>
  );
}