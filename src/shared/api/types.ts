export type UUID = string;

export type Region = {
  id: UUID;
  name: string;
};

export type GreenhouseState = 0 | 1 | 2;

export type Greenhouse = {
  id: UUID;
  name: string;
  region_id: UUID;

  last_state?: GreenhouseState;
  last_state_at?: string;
  last_measurements_updated_at?: string;
};

export type MeasurementType = "T" | "phi" | "pH";

export type Measurement = {
  measurement_id: UUID;
  greenhouse_id: UUID;
  created_at: string;
  value: number;
};

export type State = {
  state_id: UUID;
  greenhouse_id: UUID;
  created_at: string;
  state: GreenhouseState;
  comment: string;
};
