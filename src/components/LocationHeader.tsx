'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';

export const LocationHeader: React.FC = () => {
  const { location, isLoading, openLocationModal, refreshLocation } = useLocation();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 shadow-md shadow-indigo-500/20">
            <span className="text-xl font-black text-white tracking-tighter">DN</span>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Do<span className="text-indigo-600 dark:text-indigo-400">Now</span>
            </span>
            <span className="ml-2 hidden text-xs font-medium text-zinc-500 sm:inline-block">
              Nearby Services & Tasks
            </span>
          </div>
        </div>

        {/* Location Detection Indicator */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <svg
                className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Detecting location via IP...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Location Badge */}
              <button
                onClick={openLocationModal}
                className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3.5 py-1.5 text-xs font-medium text-zinc-800 transition-all hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40"
                title="Click to change location manually"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">
                  {location ? `${location.city}, ${location.region}` : 'Location Set'}
                </span>
                {location?.countryCode && (
                  <span className="rounded bg-zinc-200 px-1 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {location.countryCode}
                  </span>
                )}
                
                {/* Source Pill */}
                {location?.source === 'ip' && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-indigo-600 font-medium dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-900">
                    ⚡ IP Detected
                  </span>
                )}
                {location?.source === 'manual' && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-600 font-medium dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                    ✏️ Manual
                  </span>
                )}

                <span className="text-zinc-400 group-hover:text-indigo-600 dark:text-zinc-500 dark:group-hover:text-indigo-400">
                  ✏️
                </span>
              </button>

              {/* Refresh IP Button */}
              <button
                onClick={refreshLocation}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                title="Re-detect IP location"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
