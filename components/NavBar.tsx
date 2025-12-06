"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Hiret Logo" width={32} height={32} />
              <span className="font-display text-2xl font-bold text-brand-600 pt-1 ">Hiret</span>
            </Link>
          </div>

          {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#jobs" className="text-gray-600 hover:text-brand-600 font-medium transition">Find Jobs</Link>
            <Link href="/analyzer" className="text-gray-600 hover:text-brand-600 font-medium transition">Resume Analyzer</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/request" className="text-sm font-medium text-gray-500 hover:text-black transition">Request a Job</Link>
            <a href="https://www.instagram.com/the_surfboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-semibold hover:bg-pink-100 transition">
              <span>♥</span> Support
            </a>
            {user ? (
              <Link href="/admin" className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition">Admin 🛡️</Link>
            ) : (
              <Link href="/login" className="bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-900 transition">Login</Link>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON (Hamburger) --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-black focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                // Close Icon (X)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                // Menu Icon (☰)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link href="/#jobs" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Find Jobs</Link>
            <Link href="/analyzer" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Resume Analyzer</Link>
            <Link href="/request" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Request a Job</Link>
            <a href="https://www.instagram.com/the_surfboard" target="_blank" className="block px-3 py-3 text-base font-medium text-pink-600 hover:bg-pink-50 rounded-lg">♥ Support Us</a>

            <div className="pt-2">
              {user ? (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-red-600 text-white px-5 py-3 rounded-xl font-bold">Go to Admin Panel</Link>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-brand-600 text-white px-5 py-3 rounded-xl font-bold">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}