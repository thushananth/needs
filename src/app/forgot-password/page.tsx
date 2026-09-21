'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Reset Your Password
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter your registered email address to receive password recovery instructions.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            {submitted ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Reset Link Sent!
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  We sent a password reset link to <strong className="text-zinc-900 dark:text-white">{email}</strong>. Please check your inbox and spam folder.
                </p>
                <Link
                  href="/login"
                  className="inline-block w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                >
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  ) : (
                    'Send Recovery Email'
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
