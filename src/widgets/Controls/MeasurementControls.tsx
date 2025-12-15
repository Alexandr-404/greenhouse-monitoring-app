import type { MeasurementType } from "../../shared/api/types";
import { Select, type SelectOption } from "../../shared/ui/Select/Select";

import styles from "./MeasurementControls.module.scss";

export type RangePreset = "24h" | "7d" | "30d" | "1y";

const metricOptions: readonly SelectOption<MeasurementType>[] = [
  { value: "T", label: "Температура" },
  { value: "phi", label: "Влажность" },
  { value: "pH", label: "Кислотность" },
];

const rangeOptions: readonly SelectOption<RangePreset>[] = [
  { value: "24h", label: "Сутки" },
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "1y", label: "Год" },
];

export function MeasurementControls({
  metric,
  range,
  onChangeMetric,
  onChangeRange,
}: {
  metric: MeasurementType;
  range: RangePreset;
  onChangeMetric: (m: MeasurementType) => void;
  onChangeRange: (r: RangePreset) => void;
}) {
  return (
    <div className={styles.controls}>
      <Select
        label="Показатель"
        value={metric}
        options={metricOptions}
        onChange={onChangeMetric}
      />
      <Select
        label="Период"
        value={range}
        options={rangeOptions}
        onChange={onChangeRange}
      />
    </div>
  );
}
