import { useLocalize } from "@/hooks";
import { Box, Flex, Group, Loader } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectDirectionsState } from "@/features/map/directionsSlice";
import {
  ArrowDownRight,
  ArrowUpRight,
  Ruler,
  Timer,
} from "@phosphor-icons/react";

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
        <Flex gap="md" align="baseline" wrap="wrap">
          <Group wrap="nowrap">
            <Group wrap="nowrap">
              <Ruler size={20} />
              {Math.round(directionsState.directions.distance * 10) / 10}
              &nbsp;km
            </Group>
            <Group wrap="nowrap">
              <Timer size={20} />
              {hours && `${hours}h`}&nbsp;{restMinutes || "0"}&nbsp;min
            </Group>
          </Group>
          <Group wrap="nowrap">
            <Group wrap="nowrap">
              <ArrowUpRight size={20} />
              {(directionsState.elevationGain &&
                directionsState.elevationGain[0]) || <Loader size={20} />}{" "}
              m
            </Group>
            <Group wrap="nowrap">
              <ArrowDownRight size={20} />
              {(directionsState.elevationGain &&
                directionsState.elevationGain[1]) || <Loader size={20} />}{" "}
              m
            </Group>
          </Group>
        </Flex>
      </Box>
    </Box>
  );
}
