import type { GreenhouseState } from "../../../shared/api/types";

export function getStateText(state: GreenhouseState): string {
  switch (state) {
    case 0:
      return "Норма";
    case 1:
      return "Предупреждение";
    case 2:
      return "Авария";
    default:
      return "Неизвестно";
  }
}
