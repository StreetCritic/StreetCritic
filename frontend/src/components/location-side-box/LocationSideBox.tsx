import { useLocalize, useLoginGate } from "@/hooks";
import { Coordinates, Indicator, Title } from "@/components";
import { Box, Button, Group, Stack } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { selectLocationState } from "@/features/map/locationSlice";
import { MapPinPlus, TrafficSign } from "@phosphor-icons/react";
import {
  switchedToRouting,
  switchedToWayAdding,
} from "@/features/map/appSlice";
import { Geometry } from "geojson";
import type { LngLat } from "@/features/map";
import { LngLat as LibreLngLat } from "maplibre-gl";

/**
 * If this is a linestring, generate stops from it. Take the first and last
 * stop, and every in between that has a minimum distance of 100m.
 */
const stopsFromGeo = (geo: Geometry) => {
  const stops: LngLat[] = [];
  if (geo.type === "LineString") {
    let last: LibreLngLat | null = null;
    let i = 0;
    for (const coord of geo.coordinates) {
      const libreLngLat = new LibreLngLat(coord[0], coord[1]);
      if (
        i == 0 ||
        i == geo.coordinates.length - 1 ||
        (last && last.distanceTo(libreLngLat) > 100)
      ) {
        stops.push({ lng: coord[0], lat: coord[1] });
        last = libreLngLat;
      }
      i++;
    }
  }
  return stops;
};

export default function LocationSidebar() {
  const __ = useLocalize();
  const locationState = useSelector(selectLocationState);
  const dispatch = useDispatch();
  const [loginModal, requireAuthentication] = useLoginGate();
  return (
    <Box p="sm">
      {loginModal}
      <Coordinates
        mb="sm"
        lat={locationState.location?.center.lat || 0}
        lng={locationState.location?.center.lng || 0}
      />
      {/* <SidebarContent hideWhenFolded> */}
      {locationState.location?.label && (
        <Title order={2} size="sm">
          {locationState.location?.label}
        </Title>
      )}
      {locationState.selectedWay?.indicators && (
        <Stack my="sm" gap={0}>
          <Indicator
            label="Comfort"
            value={locationState.selectedWay.indicators.bikeComfort}
          />
          <Indicator
            label="Safety"
            value={locationState.selectedWay.indicators.bikeSafety}
          />
          <Indicator
            label="Beauty"
            value={locationState.selectedWay.indicators.beauty}
          />
        </Stack>
      )}
      {locationState.location && (
        <Group>
          {locationState.selectedWay !== null &&
            locationState.selectedWay.indicators && (
              <Button
                color="blue"
                leftSection={<MapPinPlus size={24} weight="fill" />}
                onClick={() =>
                  requireAuthentication(() =>
                    dispatch(
                      switchedToWayAdding(
                        (locationState.selectedWay && {
                          stops: stopsFromGeo(
                            locationState.selectedWay.geometry,
                          ),
                        }) ||
                          undefined,
                      ),
                    ),
                  )
                }
              >
                Add rating
              </Button>
            )}
          <Button
            leftSection={<TrafficSign size={24} weight="fill" />}
            color="gray.7"
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
        </Group>
      )}
      {/* </SidebarContent> */}
    </Box>
  );
}
