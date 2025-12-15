import { useEffect, useMemo, useState } from "react";

import { Button, Input, Modal } from "../../shared/ui";
import type {
  Measurement,
  MeasurementType,
  UUID,
} from "../../shared/api/types";
import { useFixMeasurementMutation } from "../../shared/api/api";

export function EditMeasurementModal({
  open,
  onClose,
  measurement,
  greenhouseId,
  m_type,
}: {
  open: boolean;
  onClose: () => void;
  measurement: Measurement | null;
  greenhouseId: UUID;
  m_type: MeasurementType;
}) {
  const [mutate, mutationResult] = useFixMeasurementMutation();

  const initial = useMemo(
    () => (measurement ? String(measurement.value) : ""),
    [measurement]
  );

  const [value, setValue] = useState(initial);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(initial);
  }, [open, initial]);

  const parsed = Number(value);
  const canSave = !!measurement && value.trim() !== "" && !Number.isNaN(parsed);

  console.log("measurement:", { measurement });

  return (
    <Modal
      open={open}
      title="Изменить показатель"
      onClose={() => {
        onClose();
      }}
    >
      {!measurement ? (
        <div>Нет выбранной точки</div>
      ) : (
        <>
          <div>
            <div>
              <b>Дата / Время: </b>
              {new Date(measurement.created_at).toLocaleString()}
            </div>
            <div>
              <b>Текущее значение:</b> {measurement.value}
            </div>
          </div>

          <Input
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            placeholder="Новое значение (float)"
          />

          <Button
            variant="primary"
            disabled={!canSave || mutationResult.isLoading}
            onClick={async () => {
              await mutate({
                measurement_id: measurement.measurement_id,
                value: parsed,
                greenhouseId,
                m_type,
              }).unwrap();
              onClose();
            }}
          >
            Сохранить
          </Button>

          {mutationResult.isError && (
            <div style={{ color: "#b91c1c" }}>Ошибка сохранения</div>
          )}
        </>
      )}
    </Modal>
  );
}
