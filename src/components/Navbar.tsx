'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { location, openLocationModal } = useLocation();
  const { user, signOut, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Hide 'Post a Request' for Providers
  const isProvider = user?.role === 'provider';

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Browse Requests', href: '/requests' },
    ...(!isProvider ? [{ name: 'Post a Request', href: '/requests/create' }] : []),
    { name: 'Messages', href: '/chat' },
    { name: 'Notifications', href: '/notifications' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-white tracking-tighter">DN</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                Do<span className="text-indigo-600 dark:text-indigo-400">Now</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase mt-0.5">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-zinc-100 text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section: Location Pill & Role / Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* IP Location Button */}
          <button
            onClick={openLocationModal}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40"
            title="Auto-detected IP Location. Click to change."
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {location ? `${location.city}, ${location.region}` : 'Detecting...'}
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
              IP
            </span>
          </button>

          {/* User Role & Profile Navigation */}
          {user ? (
            <div className="relative flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              {/* Role Indicator Pill */}
              <button
                onClick={() => switchRole(user.role === 'provider' ? 'client' : 'provider')}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition flex items-center gap-1.5 border ${
                  isProvider
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900 hover:bg-emerald-100'
                    : 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900 hover:bg-indigo-100'
                }`}
                title="Click to switch role view"
              >
                <span>{isProvider ? '🛠️ Provider Pro' : '🙋‍♂️ Customer'}</span>
                <span className="text-[9px] opacity-70">🔄</span>
              </button>

              {/* Profile Avatar & Dropdown */}
              <div className="relative flex items-center gap-1.5">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl p-1 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
                  />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>

                {/* Direct Sign Out Button in Header */}
                <button
                  onClick={() => signOut()}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white transition"
                  title="Sign out of your account"
                >
                  Sign Out
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-10 mt-2 w-48 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="block font-bold text-zinc-900 dark:text-white truncate">{user.name}</span>
                      <span className="block text-[10px] text-zinc-400 truncate">{user.email}</span>
                      <span className="inline-block mt-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 capitalize">
                        {user.role === 'provider' ? 'Service Provider' : 'Customer Account'}
                      </span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block rounded-xl px-3 py-1.5 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        switchRole(user.role === 'provider' ? 'client' : 'provider');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left rounded-xl px-3 py-1.5 font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                    >
                      Switch to {user.role === 'provider' ? 'Customer' : 'Provider'} Mode
                    </button>
                    <Link
                      href="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block rounded-xl px-3 py-1.5 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left rounded-xl px-3 py-1.5 font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <Link
                href="/login?role=client"
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
              >
                Customer Sign In
              </Link>
              <Link
                href="/login?role=provider"
                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition"
              >
                Provider Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={openLocationModal}
            className="flex items-center gap-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full"
          >
            📍 {location?.city || 'IP'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold ${
                  isActive(link.href)
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col space-y-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {user.name} ({user.role === 'provider' ? 'Provider' : 'Customer'})
                </span>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login?role=client"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-white py-2 text-xs font-bold text-center text-zinc-800"
                >
                  Customer Sign In
                </Link>
                <Link
                  href="/login?role=provider"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-emerald-600 py-2 text-xs font-bold text-center text-white"
                >
                  Provider Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
