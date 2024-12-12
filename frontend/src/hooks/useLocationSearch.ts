import { useState, useEffect } from "react";
import config from "@/config";

export type Location = {
  osm_id: string;
  lon: string;
  lat: string;
  display_name: string;
};

type Props = {
  query: string;
};

export default function useLocationSearch({ query }: Props) {
  const [locations, setLocations] = useState<Location[] | null>(null);

  useEffect(() => {
    if (!query) {
      return;
    }
    (async () => {
      const locationsResponse = await fetch(
        `${config.locationSearchURL}?q=${encodeURIComponent(query)}&format=jsonv2&email=${encodeURIComponent("c--nominatim-streetcritic@2foo.net")}`,
      );
      const locations = await locationsResponse.json();
      setLocations(locations);
    })();
  }, [query]);

  return { locations };
}
