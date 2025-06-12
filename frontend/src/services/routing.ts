import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type LngLat } from "@/features/map";

import config from "@/config";
import { receivedHeights } from "@/features/map/directionsSlice";

/**
 * Convert list of positions to request parameter for Valhallas height API.
 */
export function positionsToRequest(positions: LngLat[]) {
  return JSON.stringify({
    range: true,
    resample_distance: 500,
    shape: positions.map((pos) => ({ lat: pos.lat, lon: pos.lng })),
    // height_precision: 0,
  });
}

type GetHeightsResponse = {
  range_height: [[number, number]];
  warnings: string[];
};

export const routingApi = createApi({
  reducerPath: "routing",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.valhallaURL}` }),
  tagTypes: ["Way", "Rating"],
  endpoints: (builder) => ({
    getHeights: builder.query<GetHeightsResponse, LngLat[]>({
      query: (positions) => ({
        url: `height`,
        body: positionsToRequest(positions),
        method: "POST",
      }),
      onQueryStarted: async (_arg, api) => {
        const { dispatch, queryFulfilled } = api;
        const { data } = await queryFulfilled;
        dispatch(receivedHeights(data.range_height));
      },
      // providesTags: ["Heights"],
    }),
  }),
});

export const { useGetHeightsQuery } = routingApi;
