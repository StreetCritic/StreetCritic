import { useLocalize } from "@/hooks";
import { Box, Button, Card, Group } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectDirectionsState } from "@/features/map/directionsSlice";
import { Export, Ruler, Timer } from "@phosphor-icons/react";
import { downloadGPX } from "@/features/directions/valhalla";
import { showNotification } from "@/notifications";

export default function Directions() {
  const __ = useLocalize();
  const directionsState = useSelector(selectDirectionsState);

  if (directionsState.directions === null) {
    return;
  }

  const minutes = Math.round(directionsState.directions.duration / 60);
  const hours = Math.floor(minutes / 60);
  const restMinutes = Math.round(minutes % 60);

  const exportGPX = () => {
    (async () => {
      if (
        !directionsState.directions ||
        !downloadGPX(directionsState.directions)
        /* mapState.stops.map((stop) => new LngLat(stop.lng, stop.lat)),
         * {
         *   shortest: directionsState.useShortest,
         * }, */
        /* )) */
      ) {
        showNotification({
          title: "Could not export route",
          message:
            "The route could not be exported. If this problem persists, please contact us.",
          type: "error",
        });
      }
    })();
  };

  return (
    <Box>
      <Card shadow="xs">
        <Group>
          <Group>
            <Ruler size={20} />
            {Math.round(directionsState.directions.distance * 10) / 10} km
          </Group>
          <Group>
            <Timer size={20} />
            {hours && `${hours} h`} {restMinutes || "0"} min
          </Group>
        </Group>
      </Card>
      <Button
        size="xs"
        leftSection={<Export size={18} />}
        mt="sm"
        onClick={exportGPX}
      >
        Export track (GPX)
      </Button>
    </Box>
  );
}
