import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Way } from "@/api-bindings/Way";
import { Rating } from "@/api-bindings/Rating";
import { Account } from "@/api-bindings/Account";

import config from "@/config";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.apiURL}` }),
  tagTypes: ["Way", "Rating"],
  endpoints: (builder) => ({
    getWay: builder.query<Way, { id: number; includeUser?: boolean }>({
      // TODO if include user is false but there is the same query with true,
      // the cached data should be used. Currently, two requests will be made.
      query: ({ id, includeUser }) =>
        `ways/${id}` + (includeUser ? "?include=user" : ""),
      providesTags: (result, _error, _arg) =>
        result ? [{ type: "Way" as const, id: result.id }, "Way"] : ["Way"],
    }),
    getRatingsByAccountId: builder.query<Rating[], { account_id: string }>({
      query: ({ account_id }) => `ratings?account_id=${account_id}`,
    }),
    getRatingsByWayId: builder.query<
      Rating[],
      { id: number; includeUsers?: boolean }
    >({
      // TODO if include users is false but there is the same query with true,
      // the cached data should be used. Currently, two requests will be made.
      query: ({ id, includeUsers }) =>
        `ratings?way_id=${id}` + (includeUsers ? "&include=user" : ""),
      providesTags: ["Rating"],
    }),
    getUser: builder.query<Account, { username: string }>({
      query: ({ username }) => `accounts/${username}`,
    }),
  }),
});

export const {
  useGetRatingsByAccountIdQuery,
  useGetRatingsByWayIdQuery,
  useGetUserQuery,
  useGetWayQuery,
} = api;
