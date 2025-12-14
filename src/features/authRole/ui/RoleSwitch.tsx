import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { Select, type SelectOption } from "../../../shared/ui";
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
