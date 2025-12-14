import { useEffect, useState } from "react";
import { Input } from "../../../shared/ui";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";

type Props = {
  initialValue: string;
  onDebouncedChange: (value: string) => void;
};

export function DashboardFilterInput({
  initialValue,
  onDebouncedChange,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebouncedValue(value, 200);

  useEffect(() => {
    onDebouncedChange(debounced);
  }, [debounced, onDebouncedChange]);

  return (
    <Input
      placeholder="Поиск..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
