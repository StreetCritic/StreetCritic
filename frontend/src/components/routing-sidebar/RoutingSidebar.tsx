import { useLocalize } from "@/hooks";
import { Icon, SidebarContent } from "@/components";
import { Box, Button, Flex, Stack } from "@mantine/core";
import Directions from "./Directions";
import WayPoints from "./WayPoints";

import { Export } from "@phosphor-icons/react";
import { downloadGPX } from "@/features/directions/valhalla";
import { showNotification } from "@/notifications";

import { SlidersHorizontal } from "@phosphor-icons/react";
import { useState } from "react";
import RoutingPreferences from "../routing-preferences";
import { useSelector } from "react-redux";
import { selectDirectionsState } from "@/features/map/directionsSlice";

enum View {
  Default,
  Preferences,
}

export default function RoutingSidebar() {
  const [view, setView] = useState<View>(View.Default);
  const directionsState = useSelector(selectDirectionsState);
  const __ = useLocalize();

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
    <Box p="sm">
      <SidebarContent hideWhenFolded>
        {view === View.Default && (
          <>
            <WayPoints />
            <Flex gap="md" mt="sm">
              <Button
                onClick={() => setView(View.Preferences)}
                size="xs"
                variant="outline"
                leftSection={<SlidersHorizontal size={24} />}
              >
                {__("preferences")}
              </Button>

              <Button
                disabled={!directionsState.directions}
                size="xs"
                variant="outline"
                color="gray"
                leftSection={<Export size={18} />}
                onClick={exportGPX}
              >
                {__("routing-export")}
              </Button>
            </Flex>
          </>
        )}

        {view === View.Preferences && (
          <Stack gap="lg" align="flex-start">
            <Box w="100%">
              <RoutingPreferences />
            </Box>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView(View.Default)}
              leftSection={<Icon id="arrow-left" />}
            >
              {__("back")}
            </Button>
          </Stack>
        )}
      </SidebarContent>

      {view === View.Default && <Directions />}
    </Box>
  );
}
