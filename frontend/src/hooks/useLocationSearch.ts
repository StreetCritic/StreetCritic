import { useState, useEffect, useRef } from "react";
import config from "@/config";
import { Feature, FeatureCollection, Point } from "geojson";
import { useSelector } from "react-redux";
import { selectMapState } from "@/features/map/mapSlice";
import useLocalize from "./useLocalize";
import { showNotification } from "@/notifications";

/**
 * Properties of the locations returned by Photon.
 */
type LocationPropertiesJSON = {
  osm_id: number;
  country: string;
  city: string;
  countrycode: string;
  housenumber: string;
  postcode: string;
  locality: string;
  type: string;
  osm_type: string;
  osm_key: string;
  street: string;
  district: string;
  osm_value: string;
  name: string;
};

/**
 * Complete set of properties of the locations.
 */
type LocationProperties = LocationPropertiesJSON & {
  label: string;
};

/** Location collection returned by Photon. */
type LocationFeatureCollection = FeatureCollection<
  Point,
  LocationPropertiesJSON
>;

/** Location feature returned by Photon. */
type LocationFeatureJSON = Feature<Point, LocationPropertiesJSON>;
type LocationFeature = Feature<Point, LocationProperties>;

/** Generate location label. */
function getLocationLabel(item: LocationFeatureJSON) {
  return `${item.properties.name || ""}${item.properties.name ? ", " : ""}${item.properties.locality || ""}${item.properties.locality ? ", " : ""}${item.properties.district || ""}${item.properties.district ? ", " : ""}${item.properties.street || ""}${item.properties.housenumber ? ` ${item.properties.housenumber}` : ""}${item.properties.street ? ", " : ""}${item.properties.city || ""}${item.properties.city ? " " : ""} (${item.properties.country})`;
}

type Props = {
  /** The search query */
  query: string;
  /** Should the search execute? */
  update: boolean;
};

/**
 * Hook to fetch locations via query.
 */
export default function useLocationSearch({
  query,
  update,
}: Props): [LocationFeature[] | null, boolean] {
  const mapState = useSelector(selectMapState);
  const __ = useLocalize();
  const [data, setData] = useState<LocationFeature[] | null>(null);
  const [loading, setLoading] = useState(false);
  const abortController = useRef<AbortController>();

  useEffect(() => {
    abortController.current?.abort();
    if (query === "") {
      setData(null);
      setLoading(false);
      return;
    }
    (async () => {
      if (!update) {
        return;
      }
      abortController.current = new AbortController();
      setLoading(true);
      try {
        const response = await fetch(
          `${config.locationSearchURL}/api?q=${encodeURIComponent(query)}&limit=5&lat=${mapState.center.lat}&lon=${mapState.center.lng}`,
          { signal: abortController.current.signal },
        );
        if (!response.ok) {
          throw new Error("Response not ok: " + response.status);
        }
        const collection: LocationFeatureCollection = await response.json();
        const locations = collection.features.map((item) => ({
          ...item,
          properties: {
            label: getLocationLabel(item),
            ...item.properties,
          },
        }));
        setData(locations);
        setLoading(false);
        abortController.current = undefined;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }
        console.log("Search error:", e);
        showNotification({
          title: __("search-fetch-error-title"),
          message: __("search-fetch-error-body"),
          type: "error",
        });
        setData(null);
        setLoading(false);
        abortController.current = undefined;
      }
    })();
  }, [query, mapState.center.lng, mapState.center.lat, __, update]);

  return [data, loading];
}
