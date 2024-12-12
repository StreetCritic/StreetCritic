import { P } from "../typography";
import { useDispatch } from "react-redux";
import { selectedLocation } from "@/features/map/mapSlice";
import { MapPin } from "@phosphor-icons/react";
import {
  default as useLocationSearch,
  type Location,
} from "@/hooks/useLocationSearch";

type Props = {
  // The location query.
  query: string;
};

export default function LocationQuery({ query }: Props) {
  const dispatch = useDispatch();

  const { locations } = useLocationSearch({ query });

  if (!locations) {
    return <p>---</p>;
  }

  return (
    <div>
      {locations.map((location: Location) => (
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
