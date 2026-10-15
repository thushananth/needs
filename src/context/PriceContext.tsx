'use client';

/**
 * PriceContext.tsx
 * React context that surfaces Firestore-backed provider price data and
 * helpers throughout the app. Must be used inside AuthProvider.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  saveProviderPrice,
  getProviderPrice,
  getRequestBudget,
  ProviderPriceData,
  RequestBudgetData,
} from '@/lib/priceService';

// ─── Context shape ─────────────────────────────────────────────────────────

interface PriceContextValue {
  /** The signed-in provider's current price settings (null = not loaded yet). */
  providerPrice: ProviderPriceData | null;
  /** True while the initial Firestore fetch is in flight. */
  priceLoading: boolean;
  /** True after a successful save; resets after 3 s. */
  priceSaved: boolean;
  /** Error message from the last save attempt, or null. */
  priceError: string | null;
  /** Persist updated price data to Firestore (provider only). */
  savePrice: (data: Omit<ProviderPriceData, 'updatedAt'>) => Promise<void>;
  /** One-off fetch of a specific provider's price (by email). */
  fetchProviderPrice: (email: string) => Promise<ProviderPriceData | null>;
  /** One-off fetch of a request's budget (by requestId). */
  fetchRequestBudget: (requestId: string) => Promise<RequestBudgetData | null>;
}

const PriceContext = createContext<PriceContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [providerPrice, setProviderPrice] = useState<ProviderPriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceSaved, setPriceSaved] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Auto-load price when a provider signs in
  useEffect(() => {
    if (user?.role === 'provider' && user.email) {
      setPriceLoading(true);
      getProviderPrice(user.email)
        .then((data) => {
          if (data) setProviderPrice(data);
        })
        .catch(() => {
          // Silently ignore; price is optional
        })
        .finally(() => setPriceLoading(false));
    } else {
      setProviderPrice(null);
    }
  }, [user]);

  const savePrice = useCallback(
    async (data: Omit<ProviderPriceData, 'updatedAt'>) => {
      if (!user?.email) return;
      setPriceError(null);
      try {
        await saveProviderPrice(user.email, data);
        setProviderPrice(data);
        setPriceSaved(true);
        setTimeout(() => setPriceSaved(false), 3000);
      } catch (err) {
        setPriceError(err instanceof Error ? err.message : 'Failed to save price.');
      }
    },
    [user],
  );

  const fetchProviderPrice = useCallback(
    (email: string) => getProviderPrice(email),
    [],
  );

  const fetchRequestBudget = useCallback(
    (requestId: string) => getRequestBudget(requestId),
    [],
  );

  return (
    <PriceContext.Provider
      value={{
        providerPrice,
        priceLoading,
        priceSaved,
        priceError,
        savePrice,
        fetchProviderPrice,
        fetchRequestBudget,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export const usePrices = () => {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error('usePrices must be used within a PriceProvider');
  return ctx;
};
