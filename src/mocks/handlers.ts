import { http, HttpResponse, delay } from "msw";
import {
  commentState,
  fixMeasurement,
  genSeries,
  getGreenhouses,
  getStates,
  regions,
} from "./data";
import type { MeasurementType } from "../shared/api/types";
export const handlers = [
  http.get("/api/regions", async () => {
    await delay(150);
    return HttpResponse.json(regions);
  }),

  http.get("/api/greenhouses", async () => {
    await delay(150);
    return HttpResponse.json(getGreenhouses());
  }),

  http.get("/api/measurement/:greenhouseId", async ({ params, request }) => {
    await delay(200);

    const url = new URL(request.url);
    const dt_from = url.searchParams.get("dt_from");
    const dt_to = url.searchParams.get("dt_to");
    const m_type = (url.searchParams.get("m_type") as MeasurementType) || "T";

    if (!dt_from || !dt_to) return HttpResponse.json([]);

    return HttpResponse.json(
      genSeries(
        String(params.greenhouseId),
        m_type,
        new Date(dt_from),
        new Date(dt_to)
      )
    );
  }),

  http.post(
    "/api/fix_measurement/:measurementId",
    async ({ params, request }) => {
      await delay(200);
      const body = (await request.json()) as { value: number };
      return HttpResponse.json(
        fixMeasurement(String(params.measurementId), Number(body.value))
      );
    }
  ),

  http.get("/api/states/:greenhouseId", async ({ params, request }) => {
    await delay(150);
    const url = new URL(request.url);
    const dt_from = url.searchParams.get("dt_from");
    const dt_to = url.searchParams.get("dt_to");
    if (!dt_from || !dt_to) return HttpResponse.json([]);

    return HttpResponse.json(
      getStates(String(params.greenhouseId), new Date(dt_from), new Date(dt_to))
    );
  }),

  http.post("/api/comment_state/:stateId", async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as { comment: string };
    return HttpResponse.json(
      commentState(String(params.stateId), String(body.comment ?? ""))
    );
  }),
];
