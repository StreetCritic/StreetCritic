import config from "@/config";
import { LngLat } from "maplibre-gl";
import { Directions } from "../map/directionsSlice";

type RoutingOptions = {
  // Use shortest way.
  shortest: boolean;
};

export function downloadGPX(directions: Directions) : boolean {
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx
 xmlns="http://www.topografix.com/GPX/1/1"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
 version="1.1" creator="StreetCritic.org">
 <trk>
  <trkseg>
${directions.feature.geometry.coordinates.map((c) => `    <trkpt lat="${c[1]}" lon="${c[0]}"></trkpt>`).join("\n")}
  </trkseg>
 </trk>
</gpx>
`;
  try {
    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    const link = document.createElement("a");
    link.download = "track.gpx";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
    return true;
  } catch (error: unknown) {
    console.error("Error:", error);
  }
  return false;
}

/**
 * Requests the route for the given location and options and creates a GPX download for the result.
 */
export async function fetchGPX(
  locations: LngLat[],
  options: RoutingOptions,
): Promise<boolean> {
  const body = JSON.stringify({
    locations: locations.map((v) => ({ lon: v.lng, lat: v.lat })),
    costing: "bicycle",
    costing_options: {
      bicycle: {
        shortest: options.shortest,
      },
    },
    directions_type: "none",
    format: "gpx",
  });
  const response = await fetch(`${config.valhallaURL}/route`, {
    body,
    method: "POST",
  });
  if (response.ok) {
    try {
      const xmlText = await response.text();
      const blob = new Blob([xmlText], { type: "application/gpx+xml" });
      const link = document.createElement("a");
      link.download = "track.gpx";
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
      return true;
    } catch (error: unknown) {
      console.error("Error:", error);
    }
  }
  return false;
}
