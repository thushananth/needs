'use client';

import React from 'react';
import { PageShell } from '@/components/PageShell';
import { NearbyRequests } from '@/components/NearbyRequests';

export default function NearbyRequestsPage() {
  return (
    <PageShell>
      <div className="pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NearbyRequests />
        </div>
      </div>
    </PageShell>
  );
}
