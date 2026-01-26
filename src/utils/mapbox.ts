// utils/geolocation.ts

import axios from 'axios';

interface Feature {
  place_type: string[];
  text: string;
}

export const getCityStateFromCoords = async (lat: number, lon: number) => {
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN; // Add to .env.local

  try {
    const res = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json`,
      {
        params: {
          access_token: MAPBOX_TOKEN,
          types: 'place,region,country',
        },
      }
    );

    const features = res.data.features;
    const city = features.find((f: Feature) => f.place_type.includes('place'))?.text;
    const state = features.find((f: Feature) => f.place_type.includes('region'))?.text;
    const country = features.find((f: Feature) => f.place_type.includes('country'))?.text;

    return { city, state, country };
  } catch (error) {
    console.error('Reverse geocoding failed', error);
    return null;
  }
};
