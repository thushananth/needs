'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { MOCK_REQUESTS, Proposal } from '@/data/mockData';
import { ServiceRequest } from '@/types/location';

export type PostedRequest = ServiceRequest & { fullDescription?: string };

const KEY = 'donow_posted_requests';
const EVENT = 'donow:requests-changed';

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

const getSnapshot = () => {
  try {
    return window.localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
};

const parse = (raw: string): PostedRequest[] => {
  try {
    return raw ? (JSON.parse(raw) as PostedRequest[]) : [];
  } catch {
    return [];
  }
};

const subscribeNone = () => () => {};

/** False during server render and hydration, true once browser-only data (posted requests) can be read. */
export function useStoreReady() {
  return useSyncExternalStore(subscribeNone, () => true, () => false);
}

/** Customer-posted requests (newest first) followed by the seeded requests. */
export function useAllRequests() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => '');
  return useMemo(() => [...parse(raw), ...MOCK_REQUESTS] as typeof MOCK_REQUESTS, [raw]);
}

/** Saves a customer's request so providers can browse and respond to it. */
export function usePostRequest() {
  return useCallback((request: PostedRequest) => {
    const current = parse(getSnapshot());
    try {
      window.localStorage.setItem(KEY, JSON.stringify([request, ...current]));
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
}

const PROPOSALS_KEY = 'donow_proposals';

/** Smallest bid (in dollars) a provider may submit on a request. */
export const MIN_BID_AMOUNT = 5;

type ProposalMap = Record<string, Proposal[]>;

const getProposalSnapshot = () => {
  try {
    return window.localStorage.getItem(PROPOSALS_KEY) ?? '';
  } catch {
    return '';
  }
};

const parseProposals = (raw: string): ProposalMap => {
  try {
    return raw ? (JSON.parse(raw) as ProposalMap) : {};
  } catch {
    return {};
  }
};

/** Proposals providers have submitted for a request, newest first. */
export function useSubmittedProposals(requestId: string): Proposal[] {
  const raw = useSyncExternalStore(subscribe, getProposalSnapshot, () => '');
  return useMemo(() => parseProposals(raw)[requestId] ?? [], [raw, requestId]);
}

/** Saves a provider's proposal so the customer sees it on the request. */
export function useSubmitProposal() {
  return useCallback((requestId: string, proposal: Proposal) => {
    const all = parseProposals(getProposalSnapshot());
    all[requestId] = [proposal, ...(all[requestId] ?? [])];
    try {
      window.localStorage.setItem(PROPOSALS_KEY, JSON.stringify(all));
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
}
