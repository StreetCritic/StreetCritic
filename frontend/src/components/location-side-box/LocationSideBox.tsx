import { useLocalize, useLoginGate } from "@/hooks";
import { Coordinates, Indicator, Title } from "@/components";
import { Box, Button, Group } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { selectLocationState } from "@/features/map/locationSlice";
import {
  Armchair,
  Eye,
  Shield,
  Sparkle,
  TrafficSign,
} from "@phosphor-icons/react";
import { switchedToQuickWayRating } from "@/features/map/appSlice";
import { Geometry } from "geojson";
import type { LngLat } from "@/features/map";
import MapLibre from "maplibre-gl";
const LibreLngLat = MapLibre.LngLat;
type LibreLngLat = InstanceType<typeof LibreLngLat>;
import NavigationMenu from "./NavigationMenu";

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
        <Group my="sm" gap="md">
          <Indicator
            icon={<Shield size={24} />}
            label="Safety"
            value={locationState.selectedWay.indicators.bikeSafety}
          />
          <Indicator
            icon={<Eye size={24} />}
            label="Beauty"
            value={locationState.selectedWay.indicators.beauty}
          />
          <Indicator
            label="Comfort"
            icon={<Armchair size={24} />}
            value={locationState.selectedWay.indicators.bikeComfort}
          />
        </Group>
      )}
      {locationState.location && (
        <Group>
          {locationState.selectedWay !== null &&
            locationState.selectedWay.indicators && (
              <Button
                color="blue"
                leftSection={<Sparkle size={24} />}
                onClick={() =>
                  requireAuthentication(() =>
                    dispatch(
                      switchedToQuickWayRating(
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
                {__("location-side-box-add-opinion")}
              </Button>
            )}
          <NavigationMenu>
            <Button
              leftSection={<TrafficSign size={24} weight="fill" />}
              color="gray.7"
            >
              {__("location-side-box-navigation")}
            </Button>
          </NavigationMenu>
        </Group>
      )}
      {/* </SidebarContent> */}
    </Box>
  );
}
