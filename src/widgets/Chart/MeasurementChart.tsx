import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Dot,
} from "recharts";

import type { Measurement } from "../../shared/api/types";

import styles from "./MeasurementChart.module.scss";

type RangePreset = "24h" | "7d" | "30d" | "1y";

type RechartsDotRenderProps = {
  cx?: number;
  cy?: number;
  payload: unknown;
};

type ClickableDotProps = RechartsDotRenderProps & {
  isEdit: boolean;
  onClick?: (p: Measurement) => void;
};

function EditDot({
  cx,
  cy,
  payload,
  isEdit,
  onClick,
  ...rest
}: ClickableDotProps) {
  if (cx == null || cy == null) return null;

  return (
    <Dot
      {...rest}
      cx={cx}
      cy={cy}
      r={4}
      style={{ cursor: isEdit ? "pointer" : "default" }}
      onClick={() => {
        if (!isEdit || !onClick) return;
        onClick(payload as Measurement);
      }}
    />
  );
}

export function MeasurementChart({
  data,
  range,
  isEdit = false,
  onClick,
}: {
  data: Measurement[];
  range: RangePreset;
  isEdit?: boolean;
  onClick?: (p: Measurement) => void;
}) {
  const showDots = range === "24h" || range === "7d";

  const renderDot = (p: RechartsDotRenderProps) => (
    <EditDot {...p} isEdit={isEdit} onClick={onClick} />
  );

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="created_at"
            tickFormatter={(v) => new Date(v).toLocaleDateString("ru-RU")}
            minTickGap={28}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(v) => new Date(String(v)).toLocaleString("ru-RU")}
          />

          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            dot={showDots ? renderDot : false}
            activeDot={renderDot}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
