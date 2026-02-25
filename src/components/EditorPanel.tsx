import React from "react";
import { ChartData, Category, Period, createId, DEFAULT_COLORS, MONTHS } from "@/types/chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  data: ChartData;
  update: (fn: (prev: ChartData) => ChartData) => void;
}

const EditorPanel: React.FC<Props> = ({ data, update }) => {
  const setTitle = (title: string) => update((d) => ({ ...d, title }));

  const addCategory = () =>
    update((d) => ({
      ...d,
      categories: [
        ...d.categories,
        {
          id: createId(),
          name: "Nova Categoria",
          color: DEFAULT_COLORS[d.categories.length % DEFAULT_COLORS.length],
          periods: [],
        },
      ],
    }));

  const removeCategory = (id: string) =>
    update((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== id) }));

  const updateCategory = (id: string, patch: Partial<Category>) =>
    update((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

  const addPeriod = (catId: string) =>
    update((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              periods: [
                ...c.periods,
                { id: createId(), startMonth: 1, endMonth: 3, type: "critical" as const },
              ],
            }
          : c
      ),
    }));

  const removePeriod = (catId: string, periodId: string) =>
    update((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId ? { ...c, periods: c.periods.filter((p) => p.id !== periodId) } : c
      ),
    }));

  const updatePeriod = (catId: string, periodId: string, patch: Partial<Period>) =>
    update((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? { ...c, periods: c.periods.map((p) => (p.id === periodId ? { ...p, ...patch } : p)) }
          : c
      ),
    }));

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Título do Gráfico</Label>
          <Input value={data.title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Categorias</Label>
            <Button size="sm" variant="outline" onClick={addCategory}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>

          <div className="space-y-4 mt-3">
            {data.categories.map((cat) => (
              <div key={cat.id} className="rounded-lg border p-3 space-y-3 bg-card">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={cat.name}
                    onChange={(e) => updateCategory(cat.id, { name: e.target.value })}
                    className="flex-1 h-8 text-sm"
                  />
                  <input
                    type="color"
                    value={cat.color}
                    onChange={(e) => updateCategory(cat.id, { color: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer shrink-0"
                  />
                  <Button size="icon" variant="ghost" onClick={() => removeCategory(cat.id)} className="shrink-0 h-8 w-8">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                {/* Periods */}
                <div className="space-y-2 pl-6">
                  {cat.periods.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 flex-wrap">
                      <Select
                        value={p.type}
                        onValueChange={(v) => updatePeriod(cat.id, p.id, { type: v as Period["type"] })}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Período Crítico</SelectItem>
                          <SelectItem value="revision">Revisão</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={String(p.startMonth)}
                        onValueChange={(v) => updatePeriod(cat.id, p.id, { startMonth: Number(v) })}
                      >
                        <SelectTrigger className="w-[72px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((m, i) => (
                            <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-xs text-muted-foreground">a</span>

                      <Select
                        value={String(p.endMonth)}
                        onValueChange={(v) => updatePeriod(cat.id, p.id, { endMonth: Number(v) })}
                      >
                        <SelectTrigger className="w-[72px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((m, i) => (
                            <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button size="icon" variant="ghost" onClick={() => removePeriod(cat.id, p.id)} className="h-7 w-7">
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}

                  <Button size="sm" variant="ghost" onClick={() => addPeriod(cat.id)} className="text-xs h-7">
                    <Plus className="h-3 w-3 mr-1" /> Período
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default EditorPanel;
