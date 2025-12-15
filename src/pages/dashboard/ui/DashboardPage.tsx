import { Outlet } from "react-router-dom";
import { Card } from "../../../shared/ui/Card";
import { RegionTree, TrafficLight } from "../../../widgets";
import { useDashboardPageModel } from "../model/useDashboardPageModel";
import { DashboardFilterInput } from "./DashboardPageInput";
import { getStateText } from "../../../entities/greenhouse";

import styles from "./DashboardPage.module.scss";

export function DashboardPage() {
  const {
    queryFromUrl,
    setQueryParams,
    regions,
    greenhouses,
    counts,
    selectedGreenhouseId,
    selected,
    onSelectGreenhouse,
    isLoading,
    isError,
  } = useDashboardPageModel();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className={styles.grid}>
      <Card className={styles.left}>
        <h2>Регионы / Теплицы</h2>

        <div className={styles.filter}>
          <DashboardFilterInput
            key={queryFromUrl}
            initialValue={queryFromUrl}
            onDebouncedChange={setQueryParams}
          />
        </div>

        <RegionTree
          regions={regions}
          greenhouses={greenhouses}
          filter={queryFromUrl}
          selectedGreenhouseId={selectedGreenhouseId ?? ""}
          onSelectGreenhouse={onSelectGreenhouse}
        />
      </Card>

      <div className={styles.right}>
        <Card className={styles.block}>
          <h2>Сводка</h2>
          <TrafficLight
            normal={counts.normal}
            warning={counts.warning}
            alarm={counts.alarm}
          />
        </Card>
        {selected && (
          <Card className={styles.block}>
            <div className={styles.note}>
              {selected.last_measurements_updated_at
                ? `Измерения обновлены: ${new Date(
                    selected.last_measurements_updated_at
                  ).toLocaleString()}`
                : "Измерения ещё не обновлялись"}
            </div>
            <div className={styles.note}>
              {selected.last_state_at && selected.last_state !== undefined
                ? `Состояние: ${getStateText(selected.last_state)} • ${new Date(
                    selected.last_state_at
                  ).toLocaleString()}`
                : "Состояние ещё не рассчитывалось"}
            </div>
            <Outlet />
          </Card>
        )}
      </div>
    </div>
  );
}
