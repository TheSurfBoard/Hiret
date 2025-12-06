import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";
import JobFeed from "@/components/JobFeed"; // 🔥 Import the new component

export const revalidate = 0; 

export default async function Home() { 
  
  // 1. Fetch ALL jobs from Server
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error("Error:", error);

  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <HeroSection />

      <section id="jobs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Promo Card */}
        <div className="mb-12 bg-gradient-to-r from-brand-600 to-blue-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 relative z-10">Don't Apply Blindly! 🛑</h2>
          <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto leading-relaxed relative z-10">
            Get a detailed <strong>ATS Compatibility Score</strong>, identify <strong>Missing Keywords</strong>, and receive <strong>Actionable Feedback</strong>.
          </p>
          <Link href="/analyzer" className="inline-block bg-white text-brand-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg relative z-10 transform hover:scale-105 duration-200">
            ✨ Try our Resume Analyzer
          </Link>
        </div>

        {/* Jobs Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
             <h2 className="font-display text-4xl font-bold text-gray-900 leading-none mb-2">Latest <span className="text-brand-600">Openings</span></h2>
             <p className="text-gray-500 text-sm">Find your next role.</p>
          </div>
        </div>

        {/* 2. 🔥 LOAD THE INTERACTIVE JOB FEED */}
        {/* We pass the server-fetched jobs to the client component */}
        <JobFeed jobs={jobs || []} />
      </section>
    </main>
  );
}