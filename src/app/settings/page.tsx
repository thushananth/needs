'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { useLocation } from '@/context/LocationContext';

export default function SettingsPage() {
  const { location, openLocationModal, refreshLocation } = useLocation();

  const [name, setName] = useState('Saman Perera');
  const [email, setEmail] = useState('saman.perera@example.com');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [proSubscription, setProSubscription] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
            Account & Location Settings
          </h1>
          <p className="text-xs text-zinc-500">
            Manage your personal profile, IP geolocation settings, and provider subscriptions.
          </p>
        </div>

        {saved && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 flex items-center justify-between">
            <span>✓ Settings saved successfully!</span>
          </div>
        )}

        {/* Subscription Tier Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-zinc-900 to-indigo-950 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="rounded-full bg-emerald-400/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/30">
              ★ Provider Pro Active
            </span>
            <h3 className="text-lg font-bold">DoNow Unlimited Provider Tier</h3>
            <p className="text-xs text-zinc-300">
              $19/month • Priority access to high-budget local requests in {location?.city || 'Colombo'}.
            </p>
          </div>

          <button
            onClick={() => setProSubscription(!proSubscription)}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20 transition whitespace-nowrap"
          >
            {proSubscription ? 'Manage Subscription' : 'Upgrade to Pro ($19/mo)'}
          </button>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Details Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Location Preferences Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Location & Geolocation Preferences
              </h3>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                IP Auto-Detection
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">
                  Current Detected Location:
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {location ? `${location.city}, ${location.region}, ${location.country}` : 'Colombo, Sri Lanka'} ({location?.source === 'ip' ? 'IP Detected' : 'Manual Override'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={refreshLocation}
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  Re-Detect IP
                </button>
                <button
                  type="button"
                  onClick={openLocationModal}
                  className="rounded-xl bg-indigo-600 px-3 py-1.5 font-bold text-white shadow-sm hover:bg-indigo-500"
                >
                  Change Location
                </button>
              </div>
            </div>
          </div>

          {/* Notification Switches */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Notification Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Instant Nearby Job Alerts
                  </span>
                  <span className="text-zinc-500">
                    Receive push notifications when a request is posted within {location?.city || 'your city'}.
                  </span>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-indigo-600" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Proposal Updates & Chat Messages
                  </span>
                  <span className="text-zinc-500">
                    Get notified when a client accepts your bid or sends a message.
                  </span>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              Save All Settings
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
