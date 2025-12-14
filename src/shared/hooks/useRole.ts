import { useAppSelector } from "../../app/store/hooks";

export function useRole() {
  return useAppSelector((s) => s.authRole.role);
}
