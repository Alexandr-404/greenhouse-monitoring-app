import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Greenhouse,
  Measurement,
  MeasurementType,
  Region,
  State,
  UUID,
} from "./types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Regions", "Greenhouses", "Measurements", "States"],
  endpoints: (b) => ({
    getRegions: b.query<Region[], void>({
      query: () => "/regions",
      providesTags: ["Regions"],
    }),

    getGreenhouses: b.query<Greenhouse[], void>({
      query: () => "/greenhouses",
      providesTags: ["Greenhouses"],
    }),

    getMeasurements: b.query<
      Measurement[],
      {
        greenhouseId: UUID;
        m_type: MeasurementType;
        dt_from: string;
        dt_to: string;
      }
    >({
      query: ({ greenhouseId, ...params }) => ({
        url: `/measurement/${greenhouseId}`,
        params,
      }),
      providesTags: (_r, _e, a) => [
        { type: "Measurements", id: `${a.greenhouseId}-${a.m_type}` },
      ],
    }),

    fixMeasurement: b.mutation<
      boolean,
      {
        measurement_id: UUID;
        value: number;
        greenhouseId: UUID;
        m_type: MeasurementType;
      }
    >({
      query: ({ measurement_id, value }) => ({
        url: `/fix_measurement/${measurement_id}`,
        method: "POST",
        body: { value },
      }),
      invalidatesTags: (_r, _e, a) => [
        { type: "Measurements", id: `${a.greenhouseId}-${a.m_type}` },
      ],
    }),

    getStates: b.query<
      State[],
      { greenhouseId: UUID; dt_from: string; dt_to: string }
    >({
      query: ({ greenhouseId, ...params }) => ({
        url: `/states/${greenhouseId}`,
        params,
      }),
      providesTags: (_r, _e, a) => [{ type: "States", id: a.greenhouseId }],
    }),

    commentState: b.mutation<
      boolean,
      { state_id: UUID; comment: string; greenhouseId: UUID }
    >({
      query: ({ state_id, comment }) => ({
        url: `/comment_state/${state_id}`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (_r, _e, a) => [{ type: "States", id: a.greenhouseId }],
    }),
  }),
});

export const {
  useGetRegionsQuery,
  useGetGreenhousesQuery,
  useGetMeasurementsQuery,
  useFixMeasurementMutation,
  useGetStatesQuery,
  useCommentStateMutation,
} = api;
