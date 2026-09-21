import { NextRequest, NextResponse } from 'next/server';
import { LocationData } from '@/types/location';

export async function GET(request: NextRequest) {
  try {
    // Extract IP from standard proxy headers
    let ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip')?.trim() ||
      '';

    // Handle local development IPs (loopback)
    const isLocalhost =
      !ip ||
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('::ffff:127.0.0.1');

    let locationData: LocationData;

    // Fetch IP location details
    const targetUrl = isLocalhost ? 'https://ipwho.is/' : `https://ipwho.is/${ip}`;
    
    const response = await fetch(targetUrl, {
      next: { revalidate: 3600 }, // cache for 1 hour
      headers: {
        'User-Agent': 'DoNow-Location-Detector/1.0',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success !== false) {
        locationData = {
          ip: data.ip || ip,
          city: data.city || 'Colombo',
          region: data.region || 'Western Province',
          country: data.country || 'Sri Lanka',
          countryCode: data.country_code || 'LK',
          latitude: data.latitude,
          longitude: data.longitude,
          isDetected: true,
          source: 'ip',
        };
        return NextResponse.json(locationData);
      }
    }

    // Fallback if IP service is unreachable or rate-limited
    locationData = {
      ip: ip || '127.0.0.1',
      city: 'Colombo',
      region: 'Western Province',
      country: 'Sri Lanka',
      countryCode: 'LK',
      latitude: 6.9271,
      longitude: 79.8612,
      isDetected: false,
      source: 'fallback',
    };

    return NextResponse.json(locationData);
  } catch (error) {
    console.error('IP Geolocation error:', error);
    
    const fallbackLocation: LocationData = {
      city: 'Colombo',
      region: 'Western Province',
      country: 'Sri Lanka',
      countryCode: 'LK',
      latitude: 6.9271,
      longitude: 79.8612,
      isDetected: false,
      source: 'fallback',
    };

    return NextResponse.json(fallbackLocation);
  }
}
