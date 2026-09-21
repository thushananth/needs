'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { useLocation } from '@/context/LocationContext';
import { useAllRequests } from '@/data/requestStore';
import { MOCK_PROVIDERS } from '@/data/mockData';

export default function DashboardPage() {
  const { location, openLocationModal } = useLocation();

  const allRequests = useAllRequests();
  const urgentRequests = allRequests.slice(0, 3);
  const topProviders = MOCK_PROVIDERS.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Workspace Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                ● Live Marketplace Session
              </span>
              <button
                onClick={openLocationModal}
                className="text-xs text-indigo-300 hover:text-white underline"
              >
                📍 {location ? `${location.city}, ${location.region}` : 'Location Set'}
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, <span className="text-indigo-400">Saman</span>
            </h1>
            <p className="text-xs text-zinc-300">
              Here is what is happening in your neighborhood marketplace near {location?.city || 'Colombo'}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/requests/create"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              + Post New Request
            </Link>
            <Link
              href="/requests"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Active Requests
            </span>
            <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">1</div>
            <span className="text-[10px] text-emerald-600 font-semibold dark:text-emerald-400">
              1 proposal pending review
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Proposals Received
            </span>
            <div className="mt-2 text-2xl font-black text-indigo-600 dark:text-indigo-400">2</div>
            <span className="text-[10px] text-zinc-500">Avg $40 response</span>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              IP Location
            </span>
            <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-white truncate">
              {location ? location.city : 'Colombo'}
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold dark:text-indigo-400">
              ⚡ Auto-Matched via IP
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Unread Messages
            </span>
            <div className="mt-2 text-2xl font-black text-amber-500">1</div>
            <Link href="/chat" className="text-[10px] text-amber-600 hover:underline font-semibold">
              Open MasterCraft Chat →
            </Link>
          </div>
        </div>

        {/* Active Request Status Box */}
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/50 dark:bg-indigo-950/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Active Urgency Job: Emergency Pipe Leak Repair
              </h3>
            </div>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              Immediate Urgency
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
            <div>
              <p className="font-semibold">2 Local Plumbers responded within 10 minutes</p>
              <p className="text-zinc-500 dark:text-zinc-400">Budget: $35 - $50 • Posted 15 mins ago in {location?.city || 'Colombo'}</p>
            </div>
            <Link
              href="/requests/req-1"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition text-center"
            >
              Review Proposals & Hire
            </Link>
          </div>
        </div>

        {/* Dashboard Grid: Nearby Jobs & Pros */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed: Urgent Nearby Requests */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Urgent Requests Near {location?.city || 'Your City'}
              </h2>
              <Link href="/requests" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All ({allRequests.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {urgentRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:border-indigo-300 transition dark:border-zinc-800 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {req.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">{req.budget}</span>
                    </div>
                    <Link
                      href={`/requests/${req.id}`}
                      className="text-sm font-bold text-zinc-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                    >
                      {req.title}
                    </Link>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      📍 {req.city}, {req.region} • {req.postedAt}
                    </p>
                  </div>
                  <Link
                    href={`/requests/${req.id}`}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-indigo-600 hover:text-white dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-indigo-600 dark:hover:text-white transition text-center"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Recommended Local Pros */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Top Local Pros
              </h2>
              <Link href="/requests" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Explore Pros →
              </Link>
            </div>

            <div className="space-y-3">
              {topProviders.map((prov) => (
                <div
                  key={prov.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prov.avatar}
                      alt={prov.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        {prov.name}
                      </h4>
                      <p className="text-[11px] text-indigo-600 font-medium dark:text-indigo-400">
                        {prov.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-amber-500 font-bold">★ {prov.rating} ({prov.reviewsCount})</span>
                    <Link
                      href={`/providers/${prov.id}`}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
