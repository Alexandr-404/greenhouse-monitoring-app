import type { Greenhouse, Region, UUID } from "../../../shared/api/types";

export type RegionTree = {
  region: Region;
  greenhouses: Greenhouse[];
};

export type RegionTreeModelInput = {
  regions: Region[];
  greenhouses: Greenhouse[];
  filter: string;
};

export type RegionTreeModelOutput = {
  normalizedFilter: string;
  nodes: RegionTree[];
  filteredNodes: RegionTree[];
  expanded: Record<UUID, boolean>;
  toggle: (regionId: UUID) => void;
};
