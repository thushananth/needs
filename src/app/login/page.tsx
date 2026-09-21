'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, safeNext } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInSocial } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'not-found' | 'bad-password' | 'use-social' | null>(null);

  const finishSignIn = async (address: string | null) => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role') === 'provider' ? 'provider' : 'client';
    if (address) {
      const outcome = await signIn(address, password, role);
      if (outcome.error) {
        setError(outcome.error);
        return;
      }
    } else {
      signInSocial('social.user@example.com', 'Social User', role);
    }
    router.push(safeNext(params.get('next')) || '/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(async () => {
      await finishSignIn(email);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white font-black text-2xl shadow-lg shadow-indigo-600/20">
              DN
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Welcome back to DoNow
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access your local requests and active contracts.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
                  {error === 'not-found' && (
                    <>
                      No account uses this email yet.{' '}
                      <Link href="/signup" className="font-bold underline">
                        Create an account
                      </Link>
                    </>
                  )}
                  {error === 'bad-password' && 'Incorrect password. Please try again.'}
                  {error === 'use-social' && 'This account uses Google or Apple sign-in. Use one of those buttons below.'}
                </p>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="text-xs text-zinc-600 dark:text-zinc-400">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  'Sign In to Account'
                )}
              </button>
            </form>

            {/* OAuth Dividers */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold text-zinc-400 dark:bg-zinc-900">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => finishSignIn(null)}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <span>🌐</span> Google
              </button>
              <button
                type="button"
                onClick={() => finishSignIn(null)}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <span></span> Apple
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don’t have a DoNow account?{' '}
            <Link
              href="/signup"
              className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
