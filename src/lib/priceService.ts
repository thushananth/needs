/**
 * priceService.ts
 * Firestore helpers for provider prices and request budgets.
 *
 * Collections:
 *   providerPrices/{sanitisedEmail}  – provider's hourly & fixed rates
 *   requestBudgets/{requestId}       – client's posted budget
 */

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProviderPriceData {
  hourlyRate: string;      // e.g. "$45/hr"
  fixedMinimum: string;    // e.g. "$80"
  currency: string;        // e.g. "USD"
  updatedAt?: unknown;     // server timestamp (write-only)
}

export interface RequestBudgetData {
  budget: string;          // e.g. "$120" or "$35/hr"
  budgetType: 'fixed' | 'hourly';
  requestId: string;
  clientName: string;
  updatedAt?: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Sanitise an email into a valid Firestore document ID. */
const emailToKey = (email: string) =>
  email.toLowerCase().replace(/[^a-z0-9]/g, '_');

// ─── Provider Prices ──────────────────────────────────────────────────────────

/**
 * Save (merge) a provider's price configuration to Firestore.
 * Document ID is derived from the provider's email.
 */
export async function saveProviderPrice(
  providerEmail: string,
  data: Omit<ProviderPriceData, 'updatedAt'>,
): Promise<void> {
  const ref = doc(db, 'providerPrices', emailToKey(providerEmail));
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Fetch a provider's price configuration from Firestore.
 * Returns null if no document exists yet.
 */
export async function getProviderPrice(
  providerEmail: string,
): Promise<ProviderPriceData | null> {
  const ref = doc(db, 'providerPrices', emailToKey(providerEmail));
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as ProviderPriceData) : null;
}

// ─── Request Budgets ──────────────────────────────────────────────────────────

/**
 * Save a posted request's budget to Firestore.
 */
export async function saveRequestBudget(
  requestId: string,
  data: Omit<RequestBudgetData, 'updatedAt'>,
): Promise<void> {
  const ref = doc(db, 'requestBudgets', requestId);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Fetch a request's budget from Firestore.
 * Returns null if not found.
 */
export async function getRequestBudget(
  requestId: string,
): Promise<RequestBudgetData | null> {
  const ref = doc(db, 'requestBudgets', requestId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as RequestBudgetData) : null;
}
