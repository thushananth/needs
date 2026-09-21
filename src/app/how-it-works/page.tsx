'use client';

import React from 'react';
import { PageShell } from '@/components/PageShell';

export default function HowItWorksPage() {
  return (
    <PageShell>
      <div className="pt-12">
        <section className="bg-zinc-100 dark:bg-zinc-900/60 py-16 border-y border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Seamless Workflow
              </span>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                How DoNow Works in 3 Simple Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  1
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Automatic Location Detection
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Your approximate IP city & region are detected instantly. Post a job or view local requests in 1-click.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  2
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Receive Local Proposals
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Verified nearby professionals inspect your request specs and send competitive quotes within minutes.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  3
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Hire & Complete Task
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Chat directly, approve milestones, and release payment safely upon task satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
