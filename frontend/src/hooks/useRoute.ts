import { useEffect, useState, useMemo } from "react";
import type { Feature, Position } from "geojson";
import { MVTRouter, Point as WASMPoint, Route } from "ibre";

export type Point = {
  x: number;
  y: number;
};

// export class Route = {
//   private stops: Point[];
//   private segments: Segments[];
//   constructor(stops: Point[], segments: Segment[]) {
//   }
//   get_stops() : Point[] {
//     return this.stops;
//   }
// }

/**
 * React hook to calculate the route.
 *
 * @param stops - Stops of the route; First is the start, last is the finish.
 */
export function useRoute(stops: Point[]): Route | null {
  const router = useMemo(
    () =>
      new MVTRouter(
        "http://transport-tiles.streetcritic.org/function_zxy_query",
        // "https://raw.githubusercontent.com/chrneumann/ibre-example-data/main/network.pmtiles",
      ),
    [],
  );
  const [route, setRoute] = useState<null | Route>(null);
  useEffect(() => {
    if (!router) {
      return;
    }
    // const nearest = segments.find_nearest(stops[0]);
    // console.log('find nearest', stops, nearest);
    // (async () => {
    //   const directions = null;
    //     // stops.length > 1
    //     //   ? await v.directions(
    //     //       stops.map((stop) => [stop[0], stop[1]]),
    //     //       "bicycle",
    //     //     )
    //     //   : null;
    //   setRoute({
    //     stops,
    //     feature: directions
    //       ? (directions.directions[0].feature as Feature)
    //       : null,
    //   });
    // })();
    // if (nearest) {
    //   setRoute(new Route(stops, [nearest.get_segment()]));
    // }
    // console.log('stop[0] before route', stops[0].x(), stops[0].y());
    // const route = new Route(stops, [])
    // setRoute(new Route(stops.map((stop) => new WASMPoint(stop.x, stop.y)), []));
    console.log("set route", stops);

    (async () => {
      const toPoint = (stop: Point) => {
        return new WASMPoint(stop.x, stop.y);
        // return new WASMPoint(1.0, 2.0);
      };
      const wasm_stops = stops.map(toPoint);
      // const wasm_stops : WASMPoint[] = [];
      // for (const stop of stops) {
      //   const point = new WASMPoint(stop.x, stop.y);
      //   wasm_stops.push(point);
      // }

      const route = await router.findRoute(
        wasm_stops,
        // [
        // toPoint(stops[0]),
        // toPoint(stops[1]),

        //   wasm_stops[0],
        //   wasm_stops[1],
        // ]
      );

      setRoute(route);
    })();
  }, [router, stops]);
  return route;
}
