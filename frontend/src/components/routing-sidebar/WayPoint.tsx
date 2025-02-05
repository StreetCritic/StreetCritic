import { useState } from "react";
import LocationSearch from "../location-search";

type Props = {
  stop: { lng: number; lat: number; inactive: boolean };
  setStop: ({ lng, lat }: { lng: number; lat: number }) => void;
  // Label shown above the location text input.
  label: string;
  // Is this stop from the located position?
  isLocatedPosition: boolean;
};

export default function WayPoint({
  stop,
  setStop,
  label,
  isLocatedPosition,
}: Props) {
  const [locationName, setLocationName] = useState("");
  const placeholder = isLocatedPosition
    ? "My position"
    : locationName ||
      (stop.inactive
        ? "Search location..."
        : `${Math.round(stop.lng * 10000) / 10000}, ${Math.round(stop.lat * 10000) / 10000}`);
  return (
    <>
      <LocationSearch
        placeholder={placeholder}
        label={label}
        setLocation={({ lng, lat, label }) => {
          setStop({ lng, lat });
          setLocationName(label);
        }}
      />
    </>
  );
}
