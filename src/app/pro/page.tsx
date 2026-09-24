'use client';

import React from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';

export default function ProSubscriptionPage() {
  return (
    <PageShell>
      <div className="pt-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-zinc-900 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                ★ DoNow Provider Pro
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight">
                Are you a skilled local provider? Earn more with Pro.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Get priority instant location alerts when new high-budget requests are posted near your city.
              </p>
              <div className="pt-2">
                <Link
                  href="/signup?role=provider"
                  className="inline-block rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition"
                >
                  Join as a Service Provider
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
