// hooks/useSmartLocation.ts
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface LocationData {
  city: string;
  state: string;
  country: string;
  pin: string;
  coordinates: [number, number];
  source: 'gps' | 'ip';
  accuracy: 'high' | 'medium' | 'low';
}

export const useSmartLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const fetchFromMapbox = async (longitude: number, latitude: number) => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await res.json();
        const place = data.features[0];

        const getContextValue = (contextType: string) => {
          return place.context?.find((c: { id: string; text: string }) => c.id.includes(contextType))?.text || '';
        };

        const context = {
          city: getContextValue('place'),
          state: getContextValue('region'),
          country: getContextValue('country'),
          pin: getContextValue('postcode'),
          coordinates: [longitude, latitude] as [number, number],
        };

        return context;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to reverse geocode');
        return null;
      }
    };

    const fetchFromIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        return {
          city: data.city,
          state: data.region,
          country: data.country_name,
          pin: data.postal,
          coordinates: [data.longitude, data.latitude] as [number, number],
          source: 'ip' as const,
          accuracy: 'low'
        };
      } catch {
        toast.error('Could not get location from IP');
        return null;
      }
    };

    const init = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const context = await fetchFromMapbox(longitude, latitude);
          if (context) {
            setLocation({
              ...context,
              source: 'gps',
              accuracy:
                accuracy < 100 ? 'high' : accuracy < 1000 ? 'medium' : 'low',
            });
            toast.success('Location detected via GPS');
          } else {
            const fallback = await fetchFromIP();
            if (fallback) {
                setLocation({...fallback, source: 'ip', accuracy: 'high'});
                }
          }
          setLoading(false);
        },
        async () => {
          const fallback = await fetchFromIP();
          if (fallback) {
            setLocation({...fallback, source: 'ip', accuracy: 'high'});
            }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    init();
  }, []);

  return { location, loading };
};
