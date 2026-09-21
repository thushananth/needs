'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white font-black">
                DN
              </div>
              <span className="text-xl font-black text-zinc-900 dark:text-white">
                Do<span className="text-indigo-600 dark:text-indigo-400">Now</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              The next-generation hyperlocal marketplace. Instantly connecting local service seekers with top-rated verified professionals using automatic location intelligence.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                ● Global Geolocation Active
              </span>
              <span>•</span>
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/requests" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Browse Nearby Requests</Link></li>
              <li><Link href="/requests/create" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Post a Service Request</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Client & Provider Dashboard</Link></li>
              <li><Link href="/settings" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Pro Subscriptions ($19/mo)</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/requests?cat=Plumbing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Plumbing & Drainage</Link></li>
              <li><Link href="/requests?cat=Electrical" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Electrical & Wiring</Link></li>
              <li><Link href="/requests?cat=Cleaning" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Deep House Cleaning</Link></li>
              <li><Link href="/requests?cat=HVAC" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">AC Repair & Maintenance</Link></li>
              <li><Link href="/requests?cat=Smart Home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Smart Home & Automation</Link></li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Company & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/settings" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Trust & Safety Guarantee</Link></li>
              <li><Link href="/notifications" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">System Status & Alerts</Link></li>
              <li><Link href="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Become a Verified Provider</Link></li>
              <li><Link href="/chat" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Help Center & Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} DoNow Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/settings" className="hover:underline">Privacy Policy</Link>
            <Link href="/settings" className="hover:underline">Terms of Service</Link>
            <Link href="/settings" className="hover:underline">IP Data Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
