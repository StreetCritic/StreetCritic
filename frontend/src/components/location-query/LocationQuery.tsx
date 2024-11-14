import { useEffect, useState } from "react";
import config from "@/config";
import { P } from "../typography";
import { useDispatch } from "react-redux";
import { selectedLocation } from "@/features/map/mapSlice";
import { MapPin } from "@phosphor-icons/react";

type Props = {
  // The location query.
  query: string;
};

export default function LocationQuery({ query }: Props) {
  const dispatch = useDispatch();
  const [locations, setLocations] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const locationsResponse = await fetch(
        `${config.locationSearchURL}?q=${encodeURIComponent(query)}&format=jsonv2&email=${encodeURIComponent("c--nominatim-streetcritic@2foo.net")}`,
      );
      const locations = await locationsResponse.json();
      setLocations(locations);
    })();
  }, [query]);

  if (!locations) {
    return <p>---</p>;
  }

  return (
    <div>
      {locations.map((location: any) => (
        <div key={location.osm_id}>
          <P>
            <MapPin size={16} />
            &nbsp;
            <a
              href="#"
              onClick={() =>
                dispatch(
                  selectedLocation({
                    lng: parseFloat(location.lon),
                    lat: parseFloat(location.lat),
                  }),
                )
              }
            >
              {location.display_name}
            </a>
          </P>
        </div>
      ))}
    </div>
  );
}
