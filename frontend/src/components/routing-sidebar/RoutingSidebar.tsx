import { useLocalize } from "@/hooks";
import { SidebarContent } from "@/components";
import { Box, Chip, Group, Slider, Stack, Text } from "@mantine/core";
import Directions from "./Directions";
import WayPoints from "./WayPoints";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDirectionsState,
  toggledUseShortest,
} from "@/features/map/directionsSlice";
import {
  selectMapState,
  streetPreferenceChanged,
  StreetPreferences,
} from "@/features/map/mapSlice";

const preferences: { [key in keyof StreetPreferences]: { label: string } } = {
  safety: {
    label: "Safety",
  },
  comfort: {
    label: "Comfort",
  },
  beauty: {
    label: "Beauty",
  },
};

export default function RoutingSidebar() {
  const __ = useLocalize();
  const directionsState = useSelector(selectDirectionsState);
  const mapState = useSelector(selectMapState);
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
        <Text>Preferences:</Text>
        <Stack>
          {Object.entries(preferences).map(([id, preference]) => (
            <Group justify="space-between">
              <Text>{preference.label}</Text>
              <Slider
                w="75%"
                restrictToMarks
                value={
                  mapState.streetPreferences[id as keyof StreetPreferences]
                }
                onChange={(value) =>
                  dispatch(
                    streetPreferenceChanged({
                      id: id as keyof StreetPreferences,
                      value,
                    }),
                  )
                }
                marks={Array.from({ length: 5 }).map((_, index) => ({
                  value: index * 25,
                }))}
              />
            </Group>
          ))}
        </Stack>
      </SidebarContent>
      <Directions />
    </Box>
  );
}
