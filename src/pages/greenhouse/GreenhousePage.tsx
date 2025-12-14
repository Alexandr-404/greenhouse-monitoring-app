import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { subDays, subHours, subYears } from "date-fns";

import { Card } from "../../shared/ui/Card";
import { MeasurementChart } from "../../widgets/Chart";
import { useRole } from "../../shared/hooks/useRole";
import {
  useGetGreenhousesQuery,
  useGetMeasurementsQuery,
} from "../../shared/api/api";
import type { MeasurementType } from "../../shared/api/types";
import { MeasurementControls } from "../../widgets/Controls/MeasurementControls";

import styles from "./GreenhousePage.module.scss";

type RangePreset = "24h" | "7d" | "30d" | "1y";

function calcRange(preset: RangePreset) {
  const to = new Date();
  const from =
    preset === "24h"
      ? subHours(to, 24)
      : preset === "7d"
      ? subDays(to, 7)
      : preset === "30d"
      ? subDays(to, 30)
      : subYears(to, 1);

  return { dt_from: from.toISOString(), dt_to: to.toISOString() };
}

export function GreenhousePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const metric = (searchParams.get("m") as MeasurementType) || "T";
  const range = (searchParams.get("range") as RangePreset) || "24h";

  const { dt_from, dt_to } = useMemo(() => calcRange(range), [range]);

  const greenhousesQuery = useGetGreenhousesQuery();
  const greenhouseData = greenhousesQuery.data?.find((item) => item.id === id);

  const setMetric = (next: MeasurementType) => {
    const n = new URLSearchParams(searchParams);
    n.set("m", next);
    setSearchParams(n, { replace: true });
  };

  const setRange = (next: RangePreset) => {
    const n = new URLSearchParams(searchParams);
    n.set("range", next);
    setSearchParams(n, { replace: true });
  };

  const measurementsQuery = useGetMeasurementsQuery({
    greenhouseId: id!,
    m_type: metric,
    dt_from,
    dt_to,
  });

  const role = useRole();

  return (
    <div className={styles.wrap}>
      <div className={styles.titleBlock}>
        <h2>{greenhouseData?.name ?? id}</h2>
      </div>
      <Card className={styles.controls}>
        <MeasurementControls
          metric={metric}
          range={range}
          onChangeMetric={setMetric}
          onChangeRange={setRange}
        />
      </Card>
      <Card className={styles.card}>
        {measurementsQuery.isLoading && <div>Loading...</div>}
        {measurementsQuery.error && <div>Error</div>}

        {measurementsQuery.data && (
          <MeasurementChart
            data={measurementsQuery.data}
            range={range}
            isEdit={role === "senior_specialist"}
            onClick={() => console.log("edit")}
          />
        )}
      </Card>
    </div>
  );
}
