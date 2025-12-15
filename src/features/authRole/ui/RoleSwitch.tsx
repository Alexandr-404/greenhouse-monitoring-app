import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { Select } from "../../../shared/ui";
import type { SelectOption } from "../../../shared/ui/Select/Select";

import { setRole, type Role } from "../model/slice";

const roleOptions: readonly SelectOption<Role>[] = [
  { value: "specialist", label: "Специалист" },
  { value: "senior_specialist", label: "Старший специалист" },
] as const;

export function RoleSwitch() {
  const role = useAppSelector((s) => s.authRole.role);
  const dispatch = useAppDispatch();

  return (
    <Select<Role>
      label=""
      value={role}
      options={roleOptions}
      onChange={(nextRole: Role) => dispatch(setRole(nextRole))}
    />
  );
}
