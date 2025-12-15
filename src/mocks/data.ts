import type {
  Greenhouse,
  GreenhouseState,
  Measurement,
  MeasurementType,
  Region,
  State,
} from "../shared/api/types";

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

// ----------------- helpers (детерминированный шум) -----------------
function hash01(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // 0..1
  return ((h >>> 0) % 10_000) / 10_000;
}

function baseValue(m: MeasurementType, i: number) {
  const wave = Math.sin(i / 3) * 1.8;
  if (m === "T") return 22 + wave;
  if (m === "phi") return 65 + wave * 8;
  return 6.5 + wave * 0.25;
}

// чтобы “для года” не было много точек
function chooseStepHours(dtFrom: Date, dtTo: Date) {
  const hours = (dtTo.getTime() - dtFrom.getTime()) / 3600000;
  if (hours <= 24 * 2) return 1; // до 2 дней — почасово
  if (hours <= 24 * 14) return 3; // до 2 недель — раз в 3 часа
  if (hours <= 24 * 60) return 6; // до 2 месяцев — раз в 6 часов
  return 24; // иначе — раз в сутки
}

// ----------------- in-memory stores -----------------
const measurementOverrides = new Map<string, number>(); // measurement_id -> value
const measurementRevisions = new Map<string, number>(); // key: greenhouse|m_type -> rev

export function getGreenhouses() {
  return greenhouses;
}

export function genSeries(
  greenhouseId: string,
  m_type: MeasurementType,
  dtFrom: Date,
  dtTo: Date
): Measurement[] {
  const stepH = chooseStepHours(dtFrom, dtTo);
  const rev = measurementRevisions.get(`${greenhouseId}|${m_type}`) ?? 0;

  const out: Measurement[] = [];
  const cur = new Date(dtFrom);
  let i = 0;

  while (cur <= dtTo) {
    const ts = cur.toISOString();
    const id = `${greenhouseId}-${m_type}-${ts}`;
    const noise =
      (hash01(`${id}|rev=${rev}`) - 0.5) * (m_type === "phi" ? 2 : 0.4);
    const raw = baseValue(m_type, i) + noise;
    const fixed = measurementOverrides.has(id)
      ? measurementOverrides.get(id)!
      : raw;

    out.push({
      measurement_id: id,
      greenhouse_id: greenhouseId,
      created_at: ts,
      value: Math.round(fixed * 10) / 10,
    });

    cur.setHours(cur.getHours() + stepH);
    i++;
  }

  return out;
}

export function fixMeasurement(measurementId: string, value: number) {
  measurementOverrides.set(measurementId, value);
  return true;
}

const stateHistory = new Map<string, State[]>(); // greenhouseId -> rows

function seedStates(greenhouseId: string) {
  if (stateHistory.has(greenhouseId)) return;
  const rows: State[] = [];
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 30);

  const cur = new Date(from);
  let i = 0;
  while (cur <= to) {
    const r = hash01(`${greenhouseId}-${cur.toISOString()}-state`);
    const st: GreenhouseState = r < 0.7 ? 0 : r < 0.9 ? 1 : 2;
    rows.push({
      state_id: `${greenhouseId}-s-${cur.toISOString()}`,
      greenhouse_id: greenhouseId,
      created_at: cur.toISOString(),
      state: st,
      comment: "",
    });
    cur.setDate(cur.getDate() + 1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    i++;
  }
  stateHistory.set(greenhouseId, rows);
}

export function getStates(
  greenhouseId: string,
  dtFrom: Date,
  dtTo: Date
): State[] {
  seedStates(greenhouseId);
  const rows = stateHistory.get(greenhouseId) ?? [];
  const fromMs = dtFrom.getTime();
  const toMs = dtTo.getTime();
  return rows.filter((r) => {
    const ms = new Date(r.created_at).getTime();
    return ms >= fromMs && ms <= toMs;
  });
}

export function commentState(stateId: string, comment: string) {
  for (const [, rows] of stateHistory) {
    const it = rows.find((r) => r.state_id === stateId);
    if (it) {
      it.comment = comment;
      return true;
    }
  }
  return false;
}
