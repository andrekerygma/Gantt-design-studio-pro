export type PeriodType = "critical" | "revision";

export interface Period {
  id: string;
  startMonth: number; // 1-12
  endMonth: number;   // 1-12
  type: PeriodType;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  periods: Period[];
}

export interface ChartData {
  title: string;
  categories: Category[];
}

export const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const DEFAULT_COLORS = [
  "#2196F3", "#FFEB3B", "#4CAF50", "#FF5722", "#9C27B0", "#00BCD4", "#FF9800", "#E91E63"
];

export function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const DEFAULT_DATA: ChartData = {
  title: "Mapa Cronológico dos Períodos Críticos e Revisões dos PlaCon",
  categories: [
    {
      id: createId(),
      name: "Hidrológico",
      color: "#2196F3",
      periods: [
        { id: createId(), startMonth: 1, endMonth: 6, type: "critical" },
        { id: createId(), startMonth: 11, endMonth: 12, type: "revision" },
      ],
    },
    {
      id: createId(),
      name: "Climatológico",
      color: "#FFEB3B",
      periods: [
        { id: createId(), startMonth: 5, endMonth: 10, type: "critical" },
        { id: createId(), startMonth: 9, endMonth: 12, type: "revision" },
      ],
    },
    {
      id: createId(),
      name: "Arboviroses",
      color: "#4CAF50",
      periods: [
        { id: createId(), startMonth: 1, endMonth: 8, type: "critical" },
        { id: createId(), startMonth: 6, endMonth: 8, type: "revision" },
      ],
    },
  ],
};
