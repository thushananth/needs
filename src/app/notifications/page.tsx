'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { MOCK_NOTIFICATIONS, NotificationItem } from '@/data/mockData';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'proposal' | 'location' | 'message'>('all');

  const filteredNotifs = notifications.filter(
    (n) => filter === 'all' || n.type === filter
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
              Notifications & Alerts
            </h1>
            <p className="text-xs text-zinc-500">
              Stay updated on job proposals, nearby location activity, and messages.
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            ✓ Mark All as Read
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {(['all', 'proposal', 'location', 'message'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                filter === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl border p-4 shadow-sm transition flex items-start justify-between gap-4 ${
                !n.read
                  ? 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/60 dark:bg-indigo-950/30'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  {n.type === 'proposal'
                    ? '💼'
                    : n.type === 'location'
                    ? '📍'
                    : n.type === 'message'
                    ? '💬'
                    : '⚙️'}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">{n.message}</p>
                  <span className="text-[10px] text-zinc-400 block">{n.timestamp}</span>
                </div>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-indigo-600 hover:text-white dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition whitespace-nowrap"
                >
                  View →
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
