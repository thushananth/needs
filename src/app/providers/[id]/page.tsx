'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { MOCK_PROVIDERS } from '@/data/mockData';
import { usePrices } from '@/context/PriceContext';
import type { ProviderPriceData } from '@/lib/priceService';

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = (params.id as string) || 'prov-1';

  const provider = MOCK_PROVIDERS.find((p) => p.id === providerId) || MOCK_PROVIDERS[0];
  const [hireModalOpen, setHireModalOpen] = useState(false);

  // Firestore price
  const { fetchProviderPrice } = usePrices();
  const [firestorePrice, setFirestorePrice] = useState<ProviderPriceData | null>(null);

  useEffect(() => {
    if (providerId) {
      fetchProviderPrice(providerId)
        .then((data) => { if (data) setFirestorePrice(data); })
        .catch(() => { /* silently ignore */ });
    }
  }, [providerId, fetchProviderPrice]);

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-4xl">🧑‍🔧</span>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Provider Profile Not Found</h1>
          <p className="text-xs text-zinc-500">There are currently no active registered service provider profiles matching this ID.</p>
          <Link
            href="/requests"
            className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
          >
            Browse Requests & Pros
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Cover & Profile Card Header */}
        <div className="relative rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Banner */}
          <div className="h-40 sm:h-52 w-full bg-gradient-to-r from-indigo-900 via-indigo-950 to-zinc-900"></div>

          <div className="px-6 pb-6 pt-0 sm:px-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              <div className="flex items-end gap-4">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-cover border-4 border-white dark:border-zinc-900 shadow-xl"
                />
                <div className="mb-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                      {provider.name}
                    </h1>
                    {provider.verified && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ Verified Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {provider.category}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  href="/chat"
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  💬 Send Message
                </Link>
                <button
                  onClick={() => setHireModalOpen(true)}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  Hire Provider Directly
                </button>
              </div>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px]">Rating & Reviews</span>
                <span className="text-amber-500 font-bold text-sm">★ {provider.rating} ({provider.reviewsCount})</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Hourly Rate</span>
                {firestorePrice ? (
                  <div className="space-y-0.5">
                    <span className="text-emerald-600 font-black text-sm dark:text-emerald-400">{firestorePrice.hourlyRate}</span>
                    <div className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">min {firestorePrice.fixedMinimum}</div>
                    <span className="inline-block rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">● Live Price</span>
                  </div>
                ) : (
                  <span className="text-zinc-900 dark:text-white font-bold text-sm">{provider.hourlyRate}</span>
                )}
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Response Time</span>
                <span className="text-emerald-600 font-bold text-sm">⚡ {provider.responseTime}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">Service Area</span>
                <span className="text-zinc-900 dark:text-white font-bold text-sm">📍 {provider.city}, {provider.region}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bio & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                About & Experience
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {provider.bio}
              </p>
            </div>

            {/* Portfolio Showcase */}
            {provider.portfolio && provider.portfolio.length > 0 && (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Work Gallery & Portfolio
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {provider.portfolio.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Portfolio sample"
                      className="h-40 w-full rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Client Reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Client Reviews ({provider.reviews?.length || 0})
              </h3>

              {provider.reviews && provider.reviews.length > 0 ? (
                <div className="space-y-3">
                  {provider.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.clientAvatar}
                            alt={rev.clientName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {rev.clientName}
                            </span>
                            <span className="block text-[10px] text-zinc-400">{rev.date}</span>
                          </div>
                        </div>
                        <div className="text-amber-500 font-bold text-xs">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">No client reviews submitted yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar Hire Card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Hire {provider.name}
              </h3>
              <p className="text-xs text-zinc-500">
                Directly book this pro for your job with DoNow Escrow Protection.
              </p>

              {/* Firestore live pricing breakdown */}
              {firestorePrice && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-semibold">Hourly Rate</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">{firestorePrice.hourlyRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-semibold">Fixed Minimum</span>
                    <span className="font-black text-indigo-700 dark:text-indigo-300 text-sm">{firestorePrice.fixedMinimum}</span>
                  </div>
                  <div className="pt-1 border-t border-emerald-200 dark:border-emerald-900/40">
                    <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">● Live Firestore Price</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setHireModalOpen(true)}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  Request Direct Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* HIRE MODAL */}
      {hireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Direct Job Request to {provider.name}
              </h3>
              <button
                onClick={() => setHireModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Send job details directly to this verified provider. They will receive an instant notification.
              </p>
              <textarea
                rows={3}
                placeholder="Describe your job needs and budget..."
                className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setHireModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setHireModalOpen(false);
                  alert(`Direct request sent to ${provider.name}!`);
                }}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md"
              >
                Send Direct Request
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
