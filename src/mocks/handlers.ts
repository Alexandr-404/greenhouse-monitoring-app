import { http, HttpResponse, delay } from "msw";
import { genSeries, getGreenhouses, regions } from "./data";
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
];
