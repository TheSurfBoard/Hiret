import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import JobCard from "@/components/JobCard";
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0; 

export default async function Home() { 
  
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
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-4 relative z-10">Don't Apply Blindly! 🛑</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto relative z-10">Check if your resume matches the Job Description. Use our AI Analyzer.</p>
          <Link href="/analyzer" className="inline-block bg-white text-brand-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg relative z-10">✨ Try AI Analyzer Free</Link>
        </div>

        {/* Jobs Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-4xl font-bold text-gray-900 leading-none">Latest <span className="text-brand-600">Openings</span></h2>
          <Link href="#jobs" className="text-sm font-medium text-gray-500 hover:text-brand-600 transition">View all jobs →</Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} role={job.title} company={job.company} location={job.location} type={job.type} logoColor={job.logo_color || "bg-blue-100"} applyLink={job.apply_link} date={job.created_at} />
            ))
          ) : (
             <p className="text-gray-500 col-span-3 text-center py-10">No jobs posted yet... Waiting for Admin! ⏳</p>
          )}
        </div>
      </section>
    </main>
  );
}