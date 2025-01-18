import { useLocalize } from "@/hooks";
import { Title } from "@/components";
import { Box, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { selectLocationState } from "@/features/map/locationSlice";
import { TrafficSign } from "@phosphor-icons/react";
import { switchedToRouting } from "@/features/map/appSlice";

export default function LocationSidebar() {
  const __ = useLocalize();
  const locationState = useSelector(selectLocationState);
  const dispatch = useDispatch();
  return (
    <Box p="sm">
      {/* <SidebarContent hideWhenFolded> */}
      <Title order={2}>{locationState.location?.label}</Title>
      {locationState.location && (
        <Button
          leftSection={<TrafficSign size={24} weight="fill" />}
          onClick={() =>
            dispatch(
              switchedToRouting({
                target: {
                  lng: locationState.location?.center.lng || 0,
                  lat: locationState.location?.center.lat || 0,
                },
              }),
            )
          }
        >
          Calculate route
        </Button>
      )}
      {/* </SidebarContent> */}
    </Box>
  );
}
