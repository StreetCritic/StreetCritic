// pub mod way;

// import type {
//   IndicatorCalculationInterface,
//   IndicatorCalculationArguments,
//   IndicatorCalculationResults,
// } from "./indicator-calculation-interface.js";
// import { getProcessorDataPath } from "~/utils/paths.js";
// import geojsonLength from "geojson-length";
// import type Osmium from "~/osm/osmium.js";
// import type { FeatureCollection } from "geojson";
// import type { Area } from "~/geo/areas.js";

// // TODO cycleway opposite beachten! https://www.openstreetmap.org/way/24281756
// // TODO wege außerhalb stadtgrenzen nicht mitzählen
// // TODO müsste nicht weg mit geteiltem radweg auch zu autos gezählt werden?
// // TODO https://www.openstreetmap.org/way/111565212#map=15/51.9512/7.7172 motorcar=destination, motorcycle=destination wird noch nicht beachtet

// const cycleLaneFilter = [
//   {
//     tag: "highway",
//     value: "cycleway",
//   },
//   {
//     tagRegexp: "^cycleway:?",
//     valueRegexp: "^(lane:exclusive|track)$",
//   },
// ];

// const oppositeCycleWayFilter = [
//   {
//     tagRegexp: "^cycleway:?",
//     valueRegexp: "^(opposite_track)$",
//   },
// ];

// const pathFilter = [
//   {
//     tag: "highway",
//     value: "path",
//   },
// ];

// const designatedBicycleFilter = [
//   {
//     tag: "bicycle",
//     valueRegexp: "^(yes|designated)$",
//   },
// ];

// const designatedCycleWayOnPathFilter = [
//   {
//     and: [pathFilter, designatedBicycleFilter],
//   },
// ];

// const miscCycleWaysFilter = [
//   {
//     tagRegexp: "^cycleway:?",
//     valueRegexp: "^(lane|opposite_lane|share_busway)$",
//   },
// ];

// const filterConfigs = {
//   bicycleRoad: [
//     {
//       tag: "bicycle_road",
//       value: "yes",
//     },
//   ],
//   cycleWay: [].concat(
//     cycleLaneFilter,
//     oppositeCycleWayFilter,
//     designatedCycleWayOnPathFilter,
//     miscCycleWaysFilter,
//     [
//       {
//         tag: "highway",
//         value: "path",
//       },
//     ]
//   ),
// };

// export { filterConfigs };

// /**
//  * Analysis of the bike infrastructure.
//  */
// export default class BikeInfrastructure
//   implements IndicatorCalculationInterface {
//   private osmium: Osmium;

//   constructor(osmium: Osmium) {
//     this.osmium = osmium;
//   }

//   /**
//    * Calculates and writes scores.
//    *
//    * @param area - The area slug.
//    * @param date - Date of the analysis.
//    */
//   async calculate({
//     area,
//     date,
//   }: IndicatorCalculationArguments): Promise<IndicatorCalculationResults> {
//     const features = await this.osmium.query(
//       area.getSlug(),
//       "w/highway=unclassified,cycleway,path,tertiary,secondary,primary,trunk,motorway,living_street,residential",
//       {
//         date,
//       }
//     );
//     const processed = this.process(area, features);
//     return {
//       score: processed.results.score,
//       details: {
//         good: processed.results.good,
//         bad: processed.results.bad,
//         acceptable: processed.results.acceptable,
//       },
//       data: {
//         features: processed.features,
//       },
//     };
//   }
