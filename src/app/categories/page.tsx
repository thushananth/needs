'use client';

import React from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { useLocation } from '@/context/LocationContext';

export default function CategoriesPage() {
  const { location } = useLocation();

  const categories = [
    { name: 'Plumbing', icon: '🚰', count: '48 pros nearby' },
    { name: 'Electrical', icon: '⚡', count: '32 pros nearby' },
    { name: 'House Cleaning', icon: '🧹', count: '65 pros nearby' },
    { name: 'AC & Cooling', icon: '❄️', count: '29 pros nearby' },
    { name: 'Smart Home', icon: '🔒', count: '18 pros nearby' },
    { name: 'Tutoring', icon: '📚', count: '42 pros nearby' },
  ];

  return (
    <PageShell>
      <div className="pt-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
              Explore Popular Service Categories
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Browse top categories with available local talent near {location?.city || 'you'}.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/requests?cat=${c.name}`}
                className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm transition hover:border-indigo-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {c.icon}
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {c.name}
                </span>
                <span className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                  {c.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
