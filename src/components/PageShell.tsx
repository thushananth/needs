'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';

export const PageShell: React.FC<{ children: React.ReactNode; mainClassName?: string }> = ({
  children,
  mainClassName = 'flex-1 space-y-20 pb-20',
}) => (
  <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
    <Navbar />
    <LocationModal />
    <main className={mainClassName}>{children}</main>
    <Footer />
  </div>
);
