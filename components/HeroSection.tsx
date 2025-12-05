import React from 'react';

export default function HeroSection() {
  return (
    <div className="pt-28 pb-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 text-center">

        {/* Main Headline: Bold & Modern */}
        {/* Text size konchem adjust chesam fit avvadaniki */}
        <h1 className="font-display text-6xl sm:text-8xl font-extrabold text-gray-900 tracking-tight leading-tight">
          The Modern <span className="text-brand-600">Hir</span>ing Mark<span className="text-brand-600">et</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 font-medium">
          <span className="text-gray-900 font-bold"> FIND
          </span> - <span className="text-gray-900 font-bold"> ANALYZE </span> -
          <span className="text-gray-900 font-bold"> GET HIRED </span>.
        </p>

      </div>
    </div>
  );
}