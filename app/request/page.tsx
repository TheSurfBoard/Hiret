"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import NavBar from '@/components/NavBar';

export default function RequestPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('requests')
        .insert([{ user_name: formData.name, message: formData.message }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ name: '', message: '' });
    } catch (error: any) {
      alert("Error sending request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto flex flex-col justify-center min-h-[60vh]">

        {success ? (
          // --- SCENARIO 1: SUCCESS (Only Green Box) ---
          <div className="bg-green-50 p-10 rounded-3xl text-center border border-green-100 animate-fade-in shadow-sm">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-display font-bold text-green-700 mb-3">Request Sent!</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Thank you, we have received your request. <br/>
              We will update you soon.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-8 bg-white text-green-700 px-6 py-2 rounded-full font-bold border border-green-200 hover:bg-green-50 transition shadow-sm"
            >
              Submit another request
            </button>
          </div>
        ) : (
          // --- SCENARIO 2: FORM (Header + Form Inputs) ---
          <>
            <div className="text-center mb-10">
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                Request a <span className="text-brand-600">Job</span>
              </h1>
              <p className="text-gray-500">Looking for something specific? Tell us, we will hunt it for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Sai"
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">What kind of job are you looking for?</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Ex: Need React Native internship in Hyderabad..."
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-900 transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Request 📨"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}