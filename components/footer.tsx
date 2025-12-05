import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- TOP SECTION: GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mb-12">
          
          {/* 1. Hiret Brand Section (With Logo) */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              {/* Hiret Logo */}
              <div className="bg-white p-1.5 rounded-lg">
                <Image 
                  src="/logo.png" 
                  alt="Hiret Logo" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h2 className="font-display text-3xl font-bold text-white tracking-wide pt-1">Hiret</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Your job search struggles end here.
            </p>
          </div>

          {/* 2. Contact Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-400">For any Queries</h3>
            <p className="text-gray-400 text-sm space-y-2">
              <span className="block">📧 Message us on Instagram</span>
              <span className="block">📍 Hyderabad, India</span>
            </p>
          </div>

          {/* 3. Social Icons */}
          <div className="flex flex-col items-center md:items-start justify-center">
            <h3 className="font-bold text-lg mb-4 text-brand-400">Join the Family</h3>
            <div className="flex gap-5">
              {/* Instagram */}
              <a href="https://www.instagram.com/the_surfboard" target="_blank" aria-label="Instagram" className="group">
                <div className="p-2.5 bg-gray-800 rounded-full group-hover:bg-pink-600 transition-all duration-300 border border-gray-700 group-hover:border-pink-500">
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@the_surfboard?sub_confirmation=1" target="_blank" aria-label="YouTube" className="group">
                <div className="p-2.5 bg-gray-800 rounded-full group-hover:bg-red-600 transition-all duration-300 border border-gray-700 group-hover:border-red-500">
                   <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
              </a>
            </div>
          </div>

        </div>
        
        {/* --- MIDDLE BADGE SECTION (Centered on Line) --- */}
        <div className="relative mt-16">
          {/* The Line */}
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          
          {/* The Centered Badge (Floating on line) */}
          <div className="relative flex justify-center">
            <div className="px-6 py-2 bg-gray-900 border border-gray-700 rounded-full flex items-center gap-3 shadow-xl">
              <span className="text-xs text-gray-400 font-medium">Made with ❤️ by</span>
              
              {/* SurfBoard Logo + Text */}
              <div className="flex items-center gap-2">
                 <Image 
                  src="/sb-logo.png" 
                  alt="SB Logo" 
                  width={20} 
                  height={20} 
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm font-bold text-white tracking-wide">The SurfBoard</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM COPYRIGHT --- */}
        <div className="mt-8 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Hiret. All rights reserved.
        </div>

      </div>
    </footer>
  );
}