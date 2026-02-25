import { useState, useEffect, useCallback } from "react";
import { ChartData, DEFAULT_DATA } from "@/types/chart";

const STORAGE_KEY = "placon-chart-data";

function load(): ChartData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_DATA;
}

export function useChartData() {
  const [data, setData] = useState<ChartData>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = useCallback((updater: (prev: ChartData) => ChartData) => {
    setData(updater);
  }, []);

  return { data, update };
}
