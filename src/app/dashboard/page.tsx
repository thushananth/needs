'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { NearbyProviders } from '@/components/NearbyProviders';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { location, openLocationModal } = useLocation();
  const { user, signOut, switchRole } = useAuth();

  const isProvider = user?.role === 'provider';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Workspace Header Banner */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all ${
            isProvider
              ? 'bg-gradient-to-r from-emerald-950 via-zinc-900 to-indigo-950 border border-emerald-900/50'
              : 'bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 border border-indigo-900/50'
          }`}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-bold border ${
                  isProvider
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}
              >
                ● {isProvider ? 'Provider Pro Workspace' : 'Customer Workspace'}
              </span>
              <button
                onClick={openLocationModal}
                className="text-xs text-zinc-300 hover:text-white underline"
              >
                📍 {location ? `${location.city}, ${location.region}` : 'Location Set'}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, <span className={isProvider ? 'text-emerald-400' : 'text-indigo-400'}>{user?.name || (isProvider ? 'Provider' : 'Customer')}</span>
            </h1>

            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              {isProvider
                ? `Provider Dashboard: Inspect nearby client requests, submit bid proposals, and manage your provider profile in ${location?.city || 'your area'}.`
                : `Customer Dashboard: Create job requests, review proposals, and select local service providers in ${location?.city || 'your area'}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isProvider ? (
              <>
                <Link
                  href="/requests"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
                >
                  Browse Open Jobs
                </Link>
                <Link
                  href="/chat"
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
                >
                  Messages & Quotes
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/requests/create"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  + Post New Request
                </Link>
                <Link
                  href="/nearby-providers"
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
                >
                  Browse Providers Directory
                </Link>
              </>
            )}

            {/* Quick Role Toggle */}
            <button
              onClick={() => switchRole(isProvider ? 'client' : 'provider')}
              className="rounded-xl border border-white/30 bg-white/20 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/30 transition flex items-center gap-1.5"
              title="Switch active role view mode"
            >
              🔄 Switch to {isProvider ? 'Customer' : 'Provider'} Mode
            </button>

            {/* Working Sign Out Button in Banner */}
            <button
              onClick={() => signOut()}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition flex items-center gap-1.5"
              title="Sign out of account"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Role Specific Layout */}
        {isProvider ? (
          /* PROVIDER WORKSPACE VIEW */
          <div className="space-y-8">
            {/* Provider Profile Details Card */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛠️</span>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                    Provider Account Profile Details
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ Verified Service Provider
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <span className="text-zinc-500 block text-[10px]">Provider Name</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">{user?.name}</span>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <span className="text-zinc-500 block text-[10px]">Primary Category</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Plumbing & Services</span>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <span className="text-zinc-500 block text-[10px]">Service City / Scope</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">📍 {location?.city || 'Colombo'}</span>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <span className="text-zinc-500 block text-[10px]">Response SLA</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">⚡ &lt; 15 Mins</span>
                </div>
              </div>
            </div>

            {/* Provider Alert Stream */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Provider Job Dispatch: Nearby Requests in {location?.city || 'Colombo'}
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  IP Auto-Matched
                </span>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-center space-y-3">
                <span className="text-3xl">📥</span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Inspect client requests and submit quotes
                </h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Browse open tasks posted by local customers near {location?.city || 'your location'} and send instant proposals.
                </p>
                <Link
                  href="/requests"
                  className="inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
                >
                  Browse Open Requests Directory →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* CUSTOMER WORKSPACE VIEW */
          <div className="space-y-8">
            {/* Customer Post Request Banner */}
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/50 dark:bg-indigo-950/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Post a Service Job or Task
                  </h3>
                </div>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Customer Action
                </span>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Need help with a local service or repair?
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-lg">
                    Describe your task, budget, and urgency level to receive competitive quotes from verified pros near {location?.city || 'your area'}.
                  </p>
                </div>
                <Link
                  href="/requests/create"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition whitespace-nowrap text-center"
                >
                  + Post New Request
                </Link>
              </div>
            </div>

            {/* Available Service Providers List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Available Local Service Providers
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Select a verified provider near {location?.city || 'your city'} to contact directly or request quotes.
                  </p>
                </div>
                <Link
                  href="/nearby-providers"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View All Directory →
                </Link>
              </div>

              {/* Embedded Nearby Providers Component */}
              <NearbyProviders />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
