import clsx from "clsx";

import styles from "./RegionTree.module.scss";

import { useRegionTreeModel } from "../model/useRegionTreeModel";
import type { Greenhouse, Region, UUID } from "../../../shared/api/types";

type Props = {
  regions: Region[];
  greenhouses: Greenhouse[];
  filter: string;
  selectedGreenhouseId: UUID | null;
  onSelectGreenhouse: (id: UUID) => void;
};

export function RegionTree({
  regions,
  greenhouses,
  filter,
  selectedGreenhouseId,
  onSelectGreenhouse,
}: Props) {
  const { filteredNodes, expanded, toggle } = useRegionTreeModel({
    regions,
    greenhouses,
    filter,
  });

  return (
    <div className={styles.tree}>
      {filteredNodes.length === 0 && (
        <div className={styles.empty}>Ничего не найдено</div>
      )}

      {filteredNodes.map((n) => {
        const isOpen = expanded[n.region.id] ?? false;

        return (
          <div key={n.region.id} className={styles.regionBlock}>
            <button
              type="button"
              className={styles.regionRow}
              onClick={() => toggle(n.region.id)}
              aria-expanded={isOpen}
            >
              <span className={clsx(styles.chev, isOpen && styles.chevOpen)}>
                ▶
              </span>
              <span className={styles.regionName}>{n.region.name}</span>
              <span className={styles.count}>{n.greenhouses.length}</span>
            </button>

            {isOpen && (
              <ul className={styles.ghList}>
                {n.greenhouses.map((g) => {
                  const active = g.id === selectedGreenhouseId;
                  return (
                    <li key={g.id}>
                      <button
                        type="button"
                        className={clsx(
                          styles.ghRow,
                          active && styles.ghRowActive
                        )}
                        onClick={() => onSelectGreenhouse(g.id)}
                      >
                        {g.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
