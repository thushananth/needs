'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { useLocation } from '@/context/LocationContext';
import { filterByLocation } from '@/data/mockData';
import { useAllRequests } from '@/data/requestStore';

export default function BrowseRequestsPage() {
  const { location, openLocationModal } = useLocation();
  const allRequests = useAllRequests();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  const { matchedItems, matchScope } = useMemo(() => {
    return filterByLocation(allRequests, location);
  }, [allRequests, location]);

  const filteredRequests = useMemo(() => {
    return matchedItems.filter((req) => {
      const matchCat =
        selectedCategory === 'All' ||
        req.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchUrgency =
        urgencyFilter === 'All' || req.urgency.toLowerCase() === urgencyFilter.toLowerCase();

      return matchCat && matchSearch && matchUrgency;
    });
  }, [matchedItems, selectedCategory, searchQuery, urgencyFilter]);

  const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'HVAC', 'Smart Home', 'Education'];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Location Scope */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                Browse Service Requests
              </h1>
              <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {filteredRequests.length} Active Jobs
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Live tasks posted by clients in your detected region.
            </p>
          </div>

          {/* Location pill indicator */}
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span>📍 Location Scope:</span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
              {matchScope === 'city'
                ? `${location?.city}`
                : matchScope === 'region'
                ? `${location?.region}`
                : matchScope === 'country'
                ? `${location?.country}`
                : 'Global Directory'}
            </strong>
            <button
              onClick={openLocationModal}
              className="ml-2 rounded bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              Change IP
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search job title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <span className="absolute left-3 top-2.5 text-xs text-zinc-400">🔍</span>
            </div>

            {/* Urgency Filter pills */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-zinc-500 mr-1">Urgency:</span>
              {['All', 'Immediate', 'Today', 'This Week'].map((urg) => (
                <button
                  key={urg}
                  onClick={() => setUrgencyFilter(urg)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                    urgencyFilter === urg
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
            <span className="text-4xl">🔎</span>
            <h3 className="mt-2 text-base font-bold text-zinc-800 dark:text-zinc-200">
              No matching requests found
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Try adjusting your search query, selecting "All" categories, or changing location scope.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {req.category}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          req.urgency === 'Immediate'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        ⚡ {req.urgency} Urgency
                      </span>
                    </div>

                    <Link
                      href={`/requests/${req.id}`}
                      className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition"
                    >
                      {req.title}
                    </Link>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {req.budget}
                    </span>
                    <span className="text-xs text-zinc-500">Fixed / Hourly</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {req.description}
                </p>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span>👤 Posted by {req.clientName}</span>
                    <span>•</span>
                    <span>📍 {req.city}, {req.region} ({req.distanceKm} km away)</span>
                    <span>•</span>
                    <span>🕒 {req.postedAt}</span>
                  </div>

                  <Link
                    href={`/requests/${req.id}`}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition text-center"
                  >
                    View Request & Submit Proposal →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
