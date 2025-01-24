import { Text } from "../typography";
import { Loader } from "@/components";
import { useDispatch } from "react-redux";
import { selectedLocation } from "@/features/map/locationSlice";
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

  if (locations === null) {
    return <Loader />;
  }

  if (locations.length === 0) {
    return <Text>Nothing found</Text>;
  }

  return (
    <div>
      {locations.map((location: Location) => (
        <div key={location.osm_id}>
          <Text>
            <MapPin size={16} />
            &nbsp;
            <a
              href="#"
              onClick={() =>
                dispatch(
                  selectedLocation({
                    location: {
                      center: {
                        lng: parseFloat(location.lon),
                        lat: parseFloat(location.lat),
                      },
                      label: location.display_name,
                    },
                  }),
                )
              }
            >
              {location.display_name}
            </a>
          </Text>
        </div>
      ))}
    </div>
  );
}
