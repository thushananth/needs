export interface LocationData {
  ip?: string;
  city: string;
  region: string;
  country: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  isDetected: boolean;
  source: 'ip' | 'manual' | 'fallback';
}

export interface ServiceRequest {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  urgency: 'Immediate' | 'Today' | 'This Week';
  postedAt: string;
  city: string;
  region: string;
  country: string;
  clientName: string;
  distanceKm?: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  category: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: string;
  verified: boolean;
  city: string;
  region: string;
  country: string;
  bio: string;
  responseTime: string;
  completedTasks: number;
  distanceKm?: number;
}
