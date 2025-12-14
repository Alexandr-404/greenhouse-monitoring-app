import { useEffect, useMemo, useState } from "react";
import type {
  RegionTree,
  RegionTreeModelInput,
  RegionTreeModelOutput,
} from "./types";
import type { UUID } from "../../../shared/api/types";

export function useRegionTreeModel({
  regions,
  greenhouses,
  filter,
}: RegionTreeModelInput): RegionTreeModelOutput {
  const normalizedFilter = filter.trim().toLowerCase();

  const nodes: RegionTree[] = useMemo(() => {
    const map = new Map<UUID, RegionTree>();

    for (const r of regions) {
      map.set(r.id, { region: r, greenhouses: [] });
    }

    for (const g of greenhouses) {
      map.get(g.region_id)?.greenhouses.push(g);
    }

    const list = Array.from(map.values()).map((n) => ({
      ...n,
      greenhouses: [...n.greenhouses].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    }));

    list.sort((a, b) => a.region.name.localeCompare(b.region.name));
    return list;
  }, [regions, greenhouses]);

  const filteredNodes: RegionTree[] = useMemo(() => {
    if (!normalizedFilter) return nodes;

    return nodes
      .map((n) => {
        const regionMatch = n.region.name
          .toLowerCase()
          .includes(normalizedFilter);

        const gh = n.greenhouses.filter((g) =>
          g.name.toLowerCase().includes(normalizedFilter)
        );

        if (regionMatch) return n;
        if (gh.length > 0) return { ...n, greenhouses: gh };
        return null;
      })
      .filter((x): x is RegionTree => x !== null);
  }, [nodes, normalizedFilter]);

  const [expanded, setExpanded] = useState<Record<UUID, boolean>>({});

  useEffect(() => {
    if (!normalizedFilter) return;
    if (filteredNodes.length === 0) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded((prev) => {
      const next = { ...prev };
      for (const n of filteredNodes) next[n.region.id] = true;
      return next;
    });
  }, [normalizedFilter, filteredNodes]);

  const toggle = (regionId: UUID) => {
    setExpanded((prev) => {
      const current = prev[regionId];
      const isOpen = current ?? true; // default open
      return { ...prev, [regionId]: !isOpen };
    });
  };

  return {
    normalizedFilter,
    nodes,
    filteredNodes,
    expanded,
    toggle,
  };
}
