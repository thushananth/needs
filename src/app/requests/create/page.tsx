'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { usePostRequest } from '@/data/requestStore';
import { saveRequestBudget } from '@/lib/priceService';

export default function CreateRequestPage() {
  const router = useRouter();
  const { location, openLocationModal } = useLocation();
  const { user } = useAuth();
  const postRequest = usePostRequest();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [urgency, setUrgency] = useState<'Immediate' | 'Today' | 'This Week'>('Immediate');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [budgetAmount, setBudgetAmount] = useState('40');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Provider Guard: Post Request is for Customers only
  if (user?.role === 'provider') {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-3xl">
            🛠️
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
              Customer Feature Only
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              You are currently signed in as a <strong>Service Provider</strong>. Posting job requests is reserved for customers looking to hire local help.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/requests"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
            >
              Browse Open Jobs to Quote →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              Go to Provider Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(async () => {
      const id = `req-u-${Date.now()}`;
      postRequest({
        id,
        title,
        category,
        description: description.length > 160 ? `${description.slice(0, 157)}...` : description,
        fullDescription: description,
        budget: budgetType === 'hourly' ? `$${budgetAmount}/hr` : `$${budgetAmount}`,
        urgency,
        postedAt: 'Just now',
        city: location?.city || 'Colombo',
        region: location?.region || 'Western Province',
        country: location?.country || 'Sri Lanka',
        clientName: user?.name || 'Guest Customer',
      });

      // Also persist budget to Firestore
      try {
        await saveRequestBudget(id, {
          budget: budgetType === 'hourly' ? `$${budgetAmount}/hr` : `$${budgetAmount}`,
          budgetType,
          requestId: id,
          clientName: user?.name || 'Guest Customer',
        });
      } catch {
        // Non-fatal: local request is already posted
      }

      setSubmitting(false);
      router.push(`/requests/${id}`);
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Post a Job
            </span>
            <span className="text-xs text-zinc-400">• Step 1 of 1</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            Create a New Service Request
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Reach top-rated verified local professionals in your area within minutes.
          </p>
        </div>

        {/* Auto IP Location Card */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📍</span>
            <div>
              <span className="block text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Target Location (Auto-Detected via IP)
              </span>
              <span className="text-xs text-indigo-800 dark:text-indigo-300">
                {location ? `${location.city}, ${location.region}, ${location.country}` : 'Colombo, Sri Lanka'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openLocationModal}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-400"
          >
            Change Location
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
              Job Title / Short Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Emergency Pipe Leak Repair under Kitchen Sink"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Category & Urgency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="Plumbing">Plumbing & Drainage</option>
                <option value="Electrical">Electrical & Wiring</option>
                <option value="Cleaning">House Cleaning</option>
                <option value="HVAC">AC Repair & Maintenance</option>
                <option value="Smart Home">Smart Home Security</option>
                <option value="Education">Tutoring & Education</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                Urgency Level
              </label>
              <div className="flex gap-2">
                {(['Immediate', 'Today', 'This Week'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      urgency === u
                        ? u === 'Immediate'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Budget Estimate
            </label>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setBudgetType('fixed')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                    budgetType === 'fixed'
                      ? 'bg-white text-zinc-900 shadow dark:bg-zinc-900 dark:text-white'
                      : 'text-zinc-500'
                  }`}
                >
                  Fixed Price ($)
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType('hourly')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                    budgetType === 'hourly'
                      ? 'bg-white text-zinc-900 shadow dark:bg-zinc-900 dark:text-white'
                      : 'text-zinc-500'
                  }`}
                >
                  Hourly Rate ($/hr)
                </button>
              </div>

              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-zinc-400">$</span>
                <input
                  type="number"
                  required
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white pl-7 pr-3 py-2 text-xs font-bold text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
              Detailed Requirements & Job Specifications
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, required tools, accessibility notes, or preferred schedule..."
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            ></textarea>
          </div>

          {/* Mock File Dropzone */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
              Attach Photos / Diagrams (Optional)
            </label>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-6 text-center hover:border-indigo-400 transition cursor-pointer dark:border-zinc-700">
              <span className="text-2xl mb-1">📷</span>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Click or drag images to upload
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG, PDF up to 10MB</span>
            </div>
          </div>

          {/* AI Matching Hint */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <span className="font-bold">Instant AI Matching Enabled:</span> Once posted, your request will be matched with verified local pros in {location?.city || 'Colombo'}.
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition flex items-center gap-2"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                'Publish Request Now'
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
