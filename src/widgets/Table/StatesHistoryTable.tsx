import { useMemo, useState } from "react";

import { Input } from "../../shared/ui";
import type { GreenhouseState, UUID } from "../../shared/api/types";
import { useGetStatesQuery } from "../../shared/api/api";

function labelState(status: GreenhouseState) {
  return status === 0 ? "Норма" : status === 1 ? "Предупреждение" : "Авария";
}

import styles from "./StatesHistoryTable.module.scss";

export function StatesHistoryTable({
  greenhouseId,
  dt_from,
  dt_to,
}: {
  greenhouseId: UUID;
  dt_from: string;
  dt_to: string;
}) {
  const statesData = useGetStatesQuery({ greenhouseId, dt_from, dt_to });

  const [draft, setDraft] = useState<Record<string, string>>({});

  const rows = useMemo(() => statesData.data ?? [], [statesData.data]);

  if (statesData.isLoading) return <div>Loading...</div>;
  if (statesData.error) return <div>Error</div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h3>История состояний</h3>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Дата/время</th>
            <th>Состояние</th>
            <th>Комментарий</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const value = draft[row.state_id] ?? row.comment ?? "";
            return (
              <tr key={row.state_id}>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td className={styles.stateCell} data-state={row.state}>
                  {labelState(row.state)}
                </td>
                <td>
                  <Input
                    value={value}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        [row.state_id]: e.target.value,
                      }))
                    }
                    placeholder="Комментарий..."
                  />
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.btn}
                    disabled={false}
                    onClick={() => console.log("edit")}
                  >
                    Сохранить
                  </button>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.empty}>
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
