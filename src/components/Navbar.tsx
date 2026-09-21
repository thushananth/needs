'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { location, openLocationModal } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Browse Requests', href: '/requests' },
    { name: 'Post a Request', href: '/requests/create' },
    { name: 'Messages', href: '/chat', badge: 1 },
    { name: 'Notifications', href: '/notifications', badge: 2 },
  ];

  const handleSignOut = () => {
    signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

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
                {link.badge && (
                  <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section: Location Pill & Profile / Auth */}
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
              {location ? `${location.city}, ${location.region}` : 'Detecting location...'}
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
              IP
            </span>
          </button>

          {/* User Auth Links / Profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            {user ? (
              <button
                onClick={handleSignOut}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
              >
                Sign Out
              </button>
            ) : (
              <>
              <Link
                href="/login"
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition"
              >
                Join DoNow
              </Link>
              </>
            )}

            <Link
              href="/settings"
              className="ml-1 h-8 w-8 rounded-full border border-zinc-300 overflow-hidden dark:border-zinc-700 hover:ring-2 hover:ring-indigo-500 transition"
              title="Profile & Settings"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
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
                {link.badge && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            {user ? (
              <button onClick={handleSignOut} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Sign Out
              </button>
            ) : (
              <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
              >
                Get Started
              </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
