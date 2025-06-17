import { useLocalize } from "@/hooks";
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

/**
 * Way point UI with location search.
 */
export default function WayPoint({
  stop,
  setStop,
  label,
  isLocatedPosition,
}: Props) {
  const __ = useLocalize();
  const [locationName, setLocationName] = useState("");
  const placeholder = isLocatedPosition
    ? __("my-position")
    : locationName ||
      (stop.inactive
        ? __("search-location")
        : `${Math.round(stop.lng * 10000) / 10000}, ${Math.round(stop.lat * 10000) / 10000}`);
  return (
    <>
      <LocationSearch
        placeholder={placeholder}
        label={label}
        setLocation={({ center: { lng, lat }, label }) => {
          setStop({ lng, lat });
          if (label) {
            setLocationName(label);
          }
        }}
      />
    </>
  );
}
