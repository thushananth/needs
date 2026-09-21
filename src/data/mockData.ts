import { ServiceRequest, ServiceProvider, LocationData } from '@/types/location';

export interface Proposal {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  rating: number;
  bidAmount: string;
  estimatedTime: string;
  coverLetter: string;
  submittedAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  date: string;
  comment: string;
  serviceCategory: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'proposal' | 'message' | 'system' | 'location';
  read: boolean;
  link?: string;
}

// Cleared mock datasets
export const MOCK_REQUESTS: (ServiceRequest & {
  fullDescription?: string;
  attachments?: string[];
  proposals?: Proposal[];
})[] = [];

export const MOCK_PROVIDERS: (ServiceProvider & {
  reviews?: Review[];
  portfolio?: string[];
})[] = [];

export const MOCK_CHAT_THREADS: ChatThread[] = [];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [];

// Location matching filter function
export function filterByLocation<T extends { city: string; region: string; country: string }>(
  items: T[],
  location: LocationData | null
): { matchedItems: T[]; matchScope: 'city' | 'region' | 'country' | 'global' } {
  if (!location || !items || items.length === 0) {
    return { matchedItems: items || [], matchScope: 'global' };
  }

  const userCity = location.city.toLowerCase().trim();
  const userRegion = location.region.toLowerCase().trim();
  const userCountry = location.country.toLowerCase().trim();

  const cityMatches = items.filter((item) => item.city.toLowerCase().trim() === userCity);
  if (cityMatches.length > 0) {
    return { matchedItems: cityMatches, matchScope: 'city' };
  }

  const regionMatches = items.filter((item) => item.region.toLowerCase().trim() === userRegion);
  if (regionMatches.length > 0) {
    return { matchedItems: regionMatches, matchScope: 'region' };
  }

  const countryMatches = items.filter((item) => item.country.toLowerCase().trim() === userCountry);
  if (countryMatches.length > 0) {
    return { matchedItems: countryMatches, matchScope: 'country' };
  }

  return { matchedItems: items, matchScope: 'global' };
}
