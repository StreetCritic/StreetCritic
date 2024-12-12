import { TextInput } from "@mantine/core";
import LocationResults from "./LocationResults";
import useLocationResults from "./useLocationResults";
import { useState } from "react";

type Props = {
  stop: { lng: number; lat: number; inactive: boolean };
  setStop: ({ lng, lat }: { lng: number; lat: number }) => void;
};

export default function WayPoint({ stop, setStop }: Props) {
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("");
  const placeholder =
    label ||
    (stop.inactive
      ? "Search location..."
      : `${Math.round(stop.lng * 10000) / 10000}, ${Math.round(stop.lat * 10000) / 10000}`);
  const locationResults = useLocationResults();
  return (
    <>
      <LocationResults
        query={query}
        setLocation={({ lng, lat, label }) => {
          console.log(lng, lat, label);
          setStop({ lng, lat });
          setValue("");
          setLabel(label);
        }}
        locationResults={locationResults}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            locationResults.toggleDropdown();
            setQuery(value);
          }}
        >
          <TextInput
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder={placeholder}
          />
        </form>
      </LocationResults>
    </>
  );
}
