import { useLocalize } from "@/hooks";
import { Box, Flex, Group } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectDirectionsState } from "@/features/map/directionsSlice";
import { Ruler, Timer } from "@phosphor-icons/react";

/**
 * Shows information about the calculated route.
 */
export default function Directions() {
  const __ = useLocalize();
  const directionsState = useSelector(selectDirectionsState);

  if (directionsState.directions === null) {
    return;
  }

  const minutes = Math.round(directionsState.directions.duration / 60);
  const hours = Math.floor(minutes / 60);
  const restMinutes = Math.round(minutes % 60);

  return (
    <Box>
      <Box p="sm">
        <Flex gap="md" align="baseline">
          <Group>
            <Ruler size={20} />
            {Math.round(directionsState.directions.distance * 10) / 10} km
          </Group>
          <Group>
            <Timer size={20} />
            {hours && `${hours} h`} {restMinutes || "0"} min
          </Group>
        </Flex>
      </Box>
    </Box>
  );
}
