import { useLocalize } from "@/hooks";
import { SidebarContent } from "@/components";
import { Box, Chip, Text } from "@mantine/core";
import Directions from "./Directions";
import WayPoints from "./WayPoints";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDirectionsState,
  toggledUseShortest,
} from "@/features/map/directionsSlice";

export default function RoutingSidebar() {
  const __ = useLocalize();
  const directionsState = useSelector(selectDirectionsState);
  const dispatch = useDispatch();
  return (
    <Box p="sm">
      <SidebarContent hideWhenFolded>
        <WayPoints />
        <Text mb="xs">Options:</Text>
        <Chip
          defaultChecked
          radius="sm"
          mb="md"
          variant="outline"
          checked={directionsState.useShortest}
          onChange={() => dispatch(toggledUseShortest())}
        >
          Shortest route
        </Chip>
      </SidebarContent>
      <Directions />
    </Box>
  );
}
