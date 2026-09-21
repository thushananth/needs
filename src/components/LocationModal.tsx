'use client';

import React, { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';

export const LocationModal: React.FC = () => {
  const { isModalOpen, closeLocationModal, setManualLocation, location, refreshLocation } = useLocation();

  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (location) {
      setCity(location.city);
      setRegion(location.region);
      setCountry(location.country);
    }
  }, [location]);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !country) return;
    setManualLocation(city, region, country);
  };

  const PRESET_CITIES = [
    { city: 'Colombo', region: 'Western Province', country: 'Sri Lanka' },
    { city: 'Kandy', region: 'Central Province', country: 'Sri Lanka' },
    { city: 'Galle', region: 'Southern Province', country: 'Sri Lanka' },
    { city: 'New York', region: 'New York', country: 'United States' },
    { city: 'London', region: 'Greater London', country: 'United Kingdom' },
    { city: 'Toronto', region: 'Ontario', country: 'Canada' },
    { city: 'Singapore', region: 'Central', country: 'Singapore' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Location Settings</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              IP-based detection sets location automatically. You can override it below.
            </p>
          </div>
          <button
            onClick={closeLocationModal}
            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        {/* Current IP Status */}
        {location?.isDetected && (
          <div className="my-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200 flex items-center justify-between">
            <div>
              <span className="font-semibold">Detected IP Location:</span> {location.city}, {location.country}
            </div>
            <button
              onClick={() => {
                refreshLocation();
                closeLocationModal();
              }}
              className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Re-detect IP
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Colombo, New York"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              State / Region / Province
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Western Province, NY"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Country
            </label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Sri Lanka, United States"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Preset Suggestions */}
          <div>
            <span className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Popular Quick Cities:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CITIES.map((preset) => (
                <button
                  key={preset.city}
                  type="button"
                  onClick={() => {
                    setCity(preset.city);
                    setRegion(preset.region);
                    setCountry(preset.country);
                  }}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                >
                  {preset.city}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={closeLocationModal}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition"
            >
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
