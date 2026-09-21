'use client';

import React from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { useLocation } from '@/context/LocationContext';

export default function LandingPage() {
  const { location, openLocationModal } = useLocation();

  return (
    <PageShell mainClassName="flex-1 pb-20">
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-zinc-900 to-zinc-950 py-24 text-white">
          {/* Subtle Ambient Glows */}
          <div className="absolute left-1/2 -top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-10 top-1/2 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                📍 Automatic IP Location:{' '}
                <strong className="text-emerald-300 font-bold">
                  {location ? `${location.city}, ${location.region}` : 'Detecting...'}
                </strong>
              </span>
              <button
                onClick={openLocationModal}
                className="ml-1 text-indigo-300 hover:text-white underline"
              >
                Change
              </button>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-6xl leading-[1.1]">
              Instant Local Help & Requests in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-300">
                {location ? location.city : 'Your Neighborhood'}
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              DoNow uses real-time IP location intelligence to match urgent service requests with verified local pros, plumbers, electricians, and handymen within minutes.
            </p>

            {/* Quick Hero Search & CTA */}
            <div className="mx-auto max-w-2xl flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-1 items-center gap-2 px-3 py-2 w-full">
                <span className="text-lg">🔍</span>
                <input
                  type="text"
                  placeholder="What service do you need today? (e.g. Pipe leak, AC service)"
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-400 focus:outline-none"
                />
              </div>
              <Link
                href="/requests"
                className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/40 hover:bg-indigo-500 transition-all text-center whitespace-nowrap"
              >
                Search Nearby
              </Link>
            </div>

            {/* Stats row */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-400 border-t border-white/10 max-w-3xl mx-auto">
              <div>
                <span className="block text-xl font-extrabold text-white">100%</span>
                <span>IP Location Match</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
              <div>
                <span className="block text-xl font-extrabold text-amber-400">4.9 ★</span>
                <span>Verified Pro Rating</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
              <div>
                <span className="block text-xl font-extrabold text-emerald-400">&lt; 15 Mins</span>
                <span>Avg Response Time</span>
              </div>
            </div>
          </div>
        </section>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
        {[
          { name: 'Service Categories', href: '/categories' },
          { name: 'How It Works', href: '/how-it-works' },
          { name: 'Nearby Requests', href: '/nearby-requests' },
          { name: 'Nearby Providers', href: '/nearby-providers' },
          { name: 'Provider Pro', href: '/pro' },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 shadow-sm transition hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-indigo-500"
          >
            {l.name}
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}
