import { http, HttpResponse, delay } from "msw";
import { getGreenhouses, regions } from "./data";

export const handlers = [
  http.get("/api/regions", async () => {
    await delay(150);
    return HttpResponse.json(regions);
  }),

  http.get("/api/greenhouses", async () => {
    await delay(150);
    return HttpResponse.json(getGreenhouses());
  }),

  http.get("/api/measurement/:greenhouseId", async () => {
    await delay(200);

    return HttpResponse.json([]);
  }),
];
