'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { filterByLocation } from '@/data/mockData';
import { useAllRequests } from '@/data/requestStore';

export const NearbyRequests: React.FC = () => {
  const { location, isLoading } = useLocation();
  const { requireProvider } = useAuth();
  const allRequests = useAllRequests();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { matchedItems, matchScope } = useMemo(() => {
    return filterByLocation(allRequests, location);
  }, [allRequests, location]);

  const filteredRequests = useMemo(() => {
    return matchedItems.filter((req) => {
      const matchesCat = selectedCategory === 'All' || req.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [matchedItems, selectedCategory, searchQuery]);

  const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'HVAC', 'Smart Home', 'Education'];

  return (
    <section className="space-y-6">
      {/* Section Title & Scope Info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Nearby Service Requests
            </h2>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              {filteredRequests.length} Available
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Open jobs posted by clients nearby your location.
          </p>
        </div>

        {/* Location Match Scope Pill */}
        {location && (
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <span className="text-sm">📍</span>
            <span>
              Showing results for{' '}
              <strong className="text-zinc-900 dark:text-white font-semibold">
                {matchScope === 'city'
                  ? `${location.city}`
                  : matchScope === 'region'
                  ? `${location.region}`
                  : matchScope === 'country'
                  ? `${location.country}`
                  : 'Global / All Regions'}
              </strong>
            </span>
            {matchScope === 'city' && (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                City Match
              </span>
            )}
            {matchScope === 'region' && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Region Match
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
            ></div>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
          <span className="text-3xl mb-2">🔍</span>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No active requests found nearby
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Try selecting another category or changing your detected location.
          </p>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-indigo-800/60"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                    {req.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      req.urgency === 'Immediate'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : req.urgency === 'Today'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    ⚡ {req.urgency}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                  {req.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {req.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {req.budget}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    <span>📍 {req.city}, {req.region}</span>
                    {req.distanceKm && <span>• {req.distanceKm} km away</span>}
                  </div>
                </div>

                <button
                  onClick={() => requireProvider(() => alert(`Submitted response for request: "${req.title}"`))}
                  className="rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-indigo-500 dark:hover:text-white transition-colors"
                >
                  Send Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
