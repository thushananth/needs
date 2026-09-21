'use client';

import React from 'react';
import { PageShell } from '@/components/PageShell';
import { NearbyProviders } from '@/components/NearbyProviders';

export default function NearbyProvidersPage() {
  return (
    <PageShell>
      <div className="pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NearbyProviders />
        </div>
      </div>
    </PageShell>
  );
}
