import { Location, selectLocationState } from "@/features/map/locationSlice";
import { useSelector } from "react-redux";
import { Text } from "@/components";
import { useLocalize } from "@/hooks";
import styles from "./RecentLocations.module.css";
import { Button } from "@mantine/core";

type Props = {
  onSelect: (location: Location) => void;
};

/** A list of recently visited locations. */
export default function RecentLocations({ onSelect }: Props) {
  const __ = useLocalize();
  const locations = useSelector(selectLocationState).recentLocations;
  if (locations.length === 0) {
    return (
      <Text size="sm">{__("location-search-recent-locations-empty")}</Text>
    );
  }
  return (
    <ul className={styles.locations}>
      {locations.map(
        (location) =>
          location.label && (
            <li key={location.label}>
              <Button
                variant="outline"
                justify="flex-start"
                color="gray"
                onClick={() => onSelect(location)}
              >
                {location.label}
              </Button>
            </li>
          ),
      )}
    </ul>
  );
}
