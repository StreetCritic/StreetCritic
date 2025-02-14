import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Way } from "@/api-bindings/Way";
import { Rating } from "@/api-bindings/Rating";

import config from "@/config";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.apiURL}` }),
  tagTypes: ["Way", "Rating"],
  endpoints: (builder) => ({
    getWay: builder.query<Way, number>({
      query: (wayId) => `ways/${wayId}`,
      providesTags: (result, _error, _arg) =>
        result ? [{ type: "Way" as const, id: result.id }, "Way"] : ["Way"],
    }),
    getRatingsByWayId: builder.query<Rating[], number>({
      query: (wayId) => `ratings?way_id=${wayId}`,
      providesTags: ["Rating"],
    }),
  }),
});

export const { useGetRatingsByWayIdQuery, useGetWayQuery } = api;
