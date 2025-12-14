import type { Greenhouse, Region } from "../shared/api/types";

export const regions: Region[] = [
  { id: "r-1", name: "Северо-Запад" },
  { id: "r-2", name: "Юг" },
];

const nowIso = () => new Date().toISOString();

export const greenhouses: Greenhouse[] = [
  {
    id: "g-1",
    name: "Теплица #1",
    region_id: "r-1",
    last_state: 0,
    last_state_at: nowIso(),
  },
  {
    id: "g-2",
    name: "Теплица #2",
    region_id: "r-1",
    last_state: 1,
    last_state_at: nowIso(),
  },
  {
    id: "g-3",
    name: "Теплица #3",
    region_id: "r-2",
    last_state: 2,
    last_state_at: nowIso(),
  },
];

export function getGreenhouses() {
  return greenhouses;
}
