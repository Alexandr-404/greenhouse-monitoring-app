import { Outlet } from "react-router-dom";
import { Card } from "../../../shared/ui/Card";
import { RegionTree } from "../../../widgets";
import styles from "./DashboardPage.module.scss";
import { useDashboardPageModel } from "../model/useDashboardPageModel";
import { DashboardFilterInput } from "./DashboardPageInput";

export function DashboardPage() {
  const {
    queryFromUrl,
    setQueryParams,
    regions,
    greenhouses,
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
        </Card>

        {selected && (
          <Card className={styles.block}>
            <Outlet />
          </Card>
        )}
      </div>
    </div>
  );
}
