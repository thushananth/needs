'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MOCK_PROVIDERS, filterByLocation } from '@/data/mockData';
import { usePrices } from '@/context/PriceContext';
import type { ProviderPriceData } from '@/lib/priceService';

export const NearbyProviders: React.FC = () => {
  const { location, isLoading } = useLocation();
  const { fetchProviderPrice } = usePrices();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // Map from a mock provider email-stub to its Firestore price data
  const [firestorePrices, setFirestorePrices] = useState<Record<string, ProviderPriceData>>({});

  const { matchedItems, matchScope } = useMemo(() => {
    return filterByLocation(MOCK_PROVIDERS, location);
  }, [location]);

  const filteredProviders = useMemo(() => {
    if (selectedCategory === 'All') return matchedItems;
    return matchedItems.filter((prov) =>
      prov.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [matchedItems, selectedCategory]);

  // Fetch Firestore prices for each displayed provider (keyed by provider ID used as email-stub)
  useEffect(() => {
    if (filteredProviders.length === 0) return;
    filteredProviders.forEach((prov) => {
      // Use provider id as the email key (in real app this would be the provider's actual email)
      fetchProviderPrice(prov.id).then((data) => {
        if (data) {
          setFirestorePrices((prev) => ({ ...prev, [prov.id]: data }));
        }
      }).catch(() => { /* silently ignore */ });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProviders]);

  const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'AC Repair', 'Smart Home'];

  return (
    <section className="space-y-6">
      {/* Section Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Nearby Service Providers
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {filteredProviders.length} Local Pros
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Top-rated verified freelancers & local pros available in your area.
          </p>
        </div>

        {/* Location Match Scope Pill */}
        {location && (
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <span className="text-sm">📍</span>
            <span>
              Proximity:{' '}
              <strong className="text-zinc-900 dark:text-white font-semibold">
                {matchScope === 'city'
                  ? `${location.city}`
                  : matchScope === 'region'
                  ? `${location.region}`
                  : matchScope === 'country'
                  ? `${location.country}`
                  : 'Global'}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Provider Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
            ></div>
          ))}
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
          <span className="text-3xl mb-2">🧑‍🔧</span>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No service providers registered in this exact area yet
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Try switching location or viewing all categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProviders.map((prov) => (
            <div
              key={prov.id}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-emerald-800/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={prov.avatar}
                      alt={prov.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                          {prov.name}
                        </h3>
                        {prov.verified && (
                          <span
                            className="text-emerald-500 text-xs"
                            title="Verified Provider"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-600 font-medium dark:text-indigo-400">
                        {prov.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <span>★</span>
                      <span>{prov.rating}</span>
                      <span className="text-zinc-400 font-normal">({prov.reviewsCount})</span>
                    </div>
                    {/* Show Firestore live price if available, otherwise fall back to mock */}
                    {firestorePrices[prov.id] ? (
                      <div className="mt-0.5 space-y-0.5">
                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {firestorePrices[prov.id].hourlyRate}
                        </div>
                        <div className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                          min {firestorePrices[prov.id].fixedMinimum}
                        </div>
                        <span className="inline-block rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          ● Live
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">
                        {prov.hourlyRate}
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {prov.bio}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>📍 {prov.city}, {prov.region}</span>
                  <span>•</span>
                  <span>⚡ Responds {prov.responseTime}</span>
                </div>

                <button
                  onClick={() => alert(`Contacting ${prov.name}...`)}
                  className="rounded-xl border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white transition-colors"
                >
                  Direct Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
