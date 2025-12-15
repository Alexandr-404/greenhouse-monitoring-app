import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useGetGreenhousesQuery,
  useGetRegionsQuery,
} from "../../../shared/api/api";

export function useDashboardPageModel() {
  const navigate = useNavigate();
  const { id: selectedGreenhouseId } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get("q") ?? "";

  const setQueryParams = useCallback(
    (value: string) => {
      const normalized = value.trim();

      const currentQ = searchParams.get("q") ?? "";
      if (normalized === currentQ) return;

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (normalized) next.set("q", normalized);
          else next.delete("q");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams, searchParams]
  );

  const regions = useGetRegionsQuery();
  const greenhouses = useGetGreenhousesQuery();

  const isLoading = regions.isLoading || greenhouses.isLoading;
  const isError = Boolean(regions.error || greenhouses.error);

  const greenhouse = useMemo(() => greenhouses.data ?? [], [greenhouses.data]);

  const selected = useMemo(() => {
    if (!selectedGreenhouseId) return undefined;
    return greenhouse.find((x) => x.id === selectedGreenhouseId);
  }, [greenhouse, selectedGreenhouseId]);

  const onSelectGreenhouse = useCallback(
    (id: string) => {
      const q = queryFromUrl.trim();
      const next = new URLSearchParams();
      if (q) next.set("q", q);

      navigate({
        pathname: `/greenhouses/${id}`,
        search: next.toString() ? `?${next.toString()}` : "",
      });
    },
    [navigate, queryFromUrl]
  );

  const counts = greenhouse.reduce(
    (acc, g) => {
      if (g.last_state === 0) acc.normal++;
      else if (g.last_state === 1) acc.warning++;
      else if (g.last_state === 2) acc.alarm++;
      return acc;
    },
    { normal: 0, warning: 0, alarm: 0 }
  );

  return {
    queryFromUrl,
    setQueryParams,
    regions: regions.data ?? [],
    greenhouses: greenhouse,
    counts,
    selectedGreenhouseId,
    selected,
    onSelectGreenhouse,
    isLoading,
    isError,
  };
}
