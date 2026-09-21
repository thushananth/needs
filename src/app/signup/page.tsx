'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, safeNext } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLocation } from '@/context/LocationContext';

export default function SignUpPage() {
  const router = useRouter();
  const { location } = useLocation();
  const { register, addRole } = useAuth();

  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState<{ type: 'exists' | 'role-conflict'; existingRole?: 'client' | 'provider' } | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('role') === 'provider') setRole('provider');
  }, []);

  const goNext = () =>
    router.push(safeNext(new URLSearchParams(window.location.search).get('next')) || '/dashboard');

  const roleLabel = (r: 'client' | 'provider') => (r === 'provider' ? 'Provider' : 'Customer');

  const [confirmError, setConfirmError] = useState('');

  const confirmAddRole = async () => {
    const outcome = await addRole(email, role, password);
    if (outcome.error) {
      setConfirmError(
        outcome.error === 'bad-password'
          ? 'Incorrect password for this email. Enter your existing account password above.'
          : 'This account uses Google or Apple sign-in, so a role cannot be added here.',
      );
      return;
    }
    goNext();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setConflict(null);
    setLoading(true);
    setConfirmError('');
    setTimeout(async () => {
      const outcome = await register({ name: fullName || email.split('@')[0], email, role }, password);
      setLoading(false);
      if (outcome.result === 'created') {
        goNext();
      } else {
        setConflict({ type: outcome.result, existingRole: outcome.existingRole });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Join DoNow Marketplace
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Create your account to start hiring local talent or offering services in your area.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            {/* Account Role Selector */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
              <button
                type="button"
                onClick={() => { setRole('client'); setConflict(null); }}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all ${
                  role === 'client'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                🙋‍♂️ I Want to Hire Local Help
              </button>
              <button
                type="button"
                onClick={() => { setRole('provider'); setConflict(null); }}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all ${
                  role === 'provider'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                🛠️ I Am a Service Provider
              </button>
            </div>

            {/* IP Location Box */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold">Detected Registration Region:</span>{' '}
                {location ? `${location.city}, ${location.region}, ${location.country}` : 'Colombo, Sri Lanka'}
              </div>
              <span className="rounded bg-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                IP Matched
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Silva"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setConflict(null); }}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {role === 'provider' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Service Skill
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="Plumbing">Plumbing & Drainage</option>
                    <option value="Electrical">Electrical & Automation</option>
                    <option value="Cleaning">House Cleaning</option>
                    <option value="HVAC">AC Repair & Maintenance</option>
                    <option value="Smart Home">Smart Home Security</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="agreed" className="text-xs text-zinc-600 dark:text-zinc-400">
                  I agree to the <span className="font-semibold underline">Terms of Service</span>, <span className="font-semibold underline">Privacy Policy</span>, and IP location processing.
                </label>
              </div>

              {conflict?.type === 'exists' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                  A {roleLabel(role)} account already exists for this email.{' '}
                  <Link
                    href={`/login?role=${role}${new URLSearchParams(window.location.search).get('next') ? `&next=${encodeURIComponent(new URLSearchParams(window.location.search).get('next') as string)}` : ''}`}
                    className="font-bold underline"
                  >
                    Sign in instead
                  </Link>
                </div>
              )}

              {conflict?.type === 'role-conflict' && conflict.existingRole && (
                <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                  <p>
                    This email already has a {roleLabel(conflict.existingRole)} account. Add {roleLabel(role)} access to
                    the same account? Enter that account&apos;s existing password in the password field above to
                    confirm. Your existing account will not be overwritten.
                  </p>
                  {confirmError && <p className="font-bold text-rose-700 dark:text-rose-300">{confirmError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={confirmAddRole}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500"
                    >
                      Yes, add {roleLabel(role)} access
                    </button>
                    <button
                      type="button"
                      onClick={() => setConflict(null)}
                      className="rounded-lg px-3 py-1.5 font-semibold text-zinc-700 hover:bg-amber-100 dark:text-zinc-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  `Create ${role === 'provider' ? 'Provider' : 'Client'} Account`
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
