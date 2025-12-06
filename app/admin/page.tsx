"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import { checkIsAdmin } from '@/app/actions/checkAdmin'; // 👈 IMPORT THIS (Path correct ga chusko)

// 🔥 Define the structure strictly
interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  apply_link: string;
  logo_color: string;
  experience: string;       // Explicitly defined
  responsibilities: string; // Explicitly defined
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // 🔒 New Security State
  const [requests, setRequests] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const router = useRouter();

  // STATS STATE
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0
  });

  // 🔥 Added <any> to fix type error
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    apply_link: '',
    logo_color: 'bg-blue-100',
    experience: '',
    responsibilities: ''
  });

  useEffect(() => {
    verifyAdminAndFetch();
  }, []);

  // 🔒 THE MAIN SECURITY CHECKPOST
  const verifyAdminAndFetch = async () => {
    // 1. Get current logged in user
    const { data: { session } } = await supabase.auth.getSession();

    // 2. If login doesnt work
    if (!session?.user?.email) {
      router.push('/login');
      return;
    }

    // 3. SERVER CHECK
    const isAdmin = await checkIsAdmin(session.user.email);

    if (!isAdmin) {
      alert("🚫 ACCESS DENIED: You are not the Admin!");
      await supabase.auth.signOut(); // Logout them immediately
      router.push('/'); // Go Home
      return;
    }

    // 4. Success! Admin confirmed.
    setIsAuthorized(true); // Show page content
    fetchData(); // Load data
  };

  const fetchData = async () => {
    // Fetch Requests
    const { data: reqData } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
    if (reqData) setRequests(reqData);

    // Fetch Jobs
    const { data: jobData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (jobData) setJobs(jobData);

    // CALCULATE STATS
    if (reqData && jobData) {
      setStats({
        totalJobs: jobData.length,
        totalRequests: reqData.length,
        pendingRequests: reqData.filter(r => r.status === 'Pending').length,
        completedRequests: reqData.filter(r => r.status === 'Completed').length,
      });
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { const { error } = await supabase.from('jobs').insert([formData]); if (error) throw error; alert("Posted!"); setFormData({ title: '', company: '', location: '', type: 'Full-time', apply_link: '', logo_color: 'bg-blue-100' }); fetchData(); }
    catch (error: any) { alert(error.message); } finally { setLoading(false); }
  };
  const handleDeleteJob = async (id: number) => { if (!confirm("Delete?")) return; await supabase.from('jobs').delete().eq('id', id); fetchData(); };
  const handleMarkDone = async (id: number) => { await supabase.from('requests').update({ status: 'Completed' }).eq('id', id); fetchData(); };
  const handleDeleteRequest = async (id: number) => { if (!confirm("Delete?")) return; await supabase.from('requests').delete().eq('id', id); fetchData(); };


  // 🔒 Prevent flashing: Only show content if authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-bold text-gray-400 animate-pulse">Verifying Admin Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Admin <span className="text-brand-600">Dashboard</span>
          </h1>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
          >
            Logout 🚪
          </button>
        </div>

        {/* --- 📊 STATS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Active Jobs</p>
            <p className="text-3xl font-display font-bold text-brand-600 mt-1">{stats.totalJobs}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Total Requests</p>
            <p className="text-3xl font-display font-bold text-gray-900 mt-1">{stats.totalRequests}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Pending</p>
            <p className="text-3xl font-display font-bold text-yellow-600 mt-1">{stats.pendingRequests}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Completed</p>
            <p className="text-3xl font-display font-bold text-green-600 mt-1">{stats.completedRequests}</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT: POST & MANAGE JOBS */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">🚀 Post a New Job</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Job Title" required className="w-full p-3 border rounded-xl" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <input type="text" placeholder="Company" required className="w-full p-3 border rounded-xl" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                <div className="flex gap-2">
                  <input type="text" placeholder="Location" required className="w-full p-3 border rounded-xl" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                  <input type="url" placeholder="Apply Link" required className="w-full p-3 border rounded-xl" value={formData.apply_link} onChange={e => setFormData({ ...formData, apply_link: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Experience" required className="w-full p-3 border rounded-xl" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />

                  <select className="p-3 border rounded-xl flex-1 bg-white" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option>Full-time</option><option>Internship</option><option>Contract</option>
                  </select>
                  <select className="p-3 border rounded-xl flex-1 bg-white" value={formData.logo_color} onChange={e => setFormData({ ...formData, logo_color: e.target.value })}>
                    <option value="bg-blue-100">Blue</option><option value="bg-green-100">Green</option><option value="bg-orange-100">Orange</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800">
                  {loading ? "Posting..." : "Publish Job"}
                </button>
              </form>
            </div>

            {/* JOB LIST */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">🗑️ Active Jobs ({jobs.length})</h2>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border">
                    <div><p className="font-bold text-sm">{job.title}</p><p className="text-xs text-gray-500">{job.company}</p></div>
                    <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 text-xs font-bold px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: REQUESTS */}
          <div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 h-full">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-6">📩 Requests ({requests.length})</h2>
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {requests.map((req) => (
                  <div key={req.id} className={`p-4 rounded-xl border ${req.status === 'Completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">{req.user_name || "Anonymous"}</span>
                      <span className="text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{req.message}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${req.status === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-700'}`}>
                        {req.status}
                      </span>
                      <div className="flex gap-2">
                        {req.status !== 'Completed' && (
                          <button onClick={() => handleMarkDone(req.id)} className="text-xs bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800">Mark Done</button>
                        )}
                        <button onClick={() => handleDeleteRequest(req.id)} className="text-xs text-red-500 hover:text-red-700 font-bold px-2">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}