'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LocationData } from '@/types/location';

interface LocationContextType {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  setManualLocation: (city: string, region: string, country: string) => void;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'donow_user_location';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch location via IP API
  const detectLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/location');
      if (!response.ok) {
        throw new Error(`Location detection failed with status ${response.status}`);
      }
      const data: LocationData = await response.json();
      setLocation(data);
      // Cache in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
    } catch (err: any) {
      console.error('Failed to detect location:', err);
      setError('Unable to detect location automatically.');
      
      // Default fallback location
      const fallback: LocationData = {
        city: 'Colombo',
        region: 'Western Province',
        country: 'Sri Lanka',
        countryCode: 'LK',
        isDetected: false,
        source: 'fallback',
      };
      setLocation(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize location on startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          const parsed: LocationData = JSON.parse(cached);
          setLocation(parsed);
          setIsLoading(false);
          return;
        } catch (e) {
          // ignore cache parsing error and fetch fresh
        }
      }
    }
    detectLocation();
  }, [detectLocation]);

  const openLocationModal = () => setIsModalOpen(true);
  const closeLocationModal = () => setIsModalOpen(false);

  const setManualLocation = (city: string, region: string, country: string) => {
    const manualData: LocationData = {
      city: city.trim() || 'Colombo',
      region: region.trim() || 'Western Province',
      country: country.trim() || 'Sri Lanka',
      isDetected: false,
      source: 'manual',
    };
    setLocation(manualData);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(manualData));
    }
    setIsModalOpen(false);
  };

  const refreshLocation = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    await detectLocation();
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        error,
        isModalOpen,
        openLocationModal,
        closeLocationModal,
        setManualLocation,
        refreshLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
