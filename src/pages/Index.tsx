import React, { useRef, useState } from "react";
import { useChartData } from "@/hooks/useChartData";
import ChartSVG from "@/components/ChartSVG";
import EditorPanel from "@/components/EditorPanel";
import { exportSVG, exportRaster } from "@/lib/exportChart";
import { Button } from "@/components/ui/button";
import { Download, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const Index = () => {
  const { data, update } = useChartData();
  const svgRef = useRef<SVGSVGElement>(null!);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleExport = (format: "svg" | "png" | "jpeg") => {
    if (!svgRef.current) return;
    const name = "mapa-cronologico";
    if (format === "svg") exportSVG(svgRef.current, name);
    else exportRaster(svgRef.current, name, format);
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#E8F5E9" }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-[360px] shrink-0 border-r bg-card shadow-lg flex flex-col max-h-screen">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-semibold text-sm" style={{ color: "#1B5E20" }}>Editor</h2>
            <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <EditorPanel data={data} update={update} />
          </div>
        </aside>
      )}

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <header className="flex items-center gap-2 px-4 py-3 border-b bg-card/80 backdrop-blur">
          {!sidebarOpen && (
            <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(true)}>
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          )}
          <span className="text-sm font-medium flex-1" style={{ color: "#1B5E20" }}>
            Mapa Cronológico
          </span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => handleExport("svg")}>
              <Download className="h-3.5 w-3.5 mr-1" /> SVG
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport("png")}>
              <Download className="h-3.5 w-3.5 mr-1" /> PNG
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport("jpeg")}>
              <Download className="h-3.5 w-3.5 mr-1" /> JPEG
            </Button>
          </div>
        </header>

        {/* Chart preview */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <div className="w-full max-w-[1400px] bg-white rounded-xl shadow-md p-6">
            <ChartSVG data={data} svgRef={svgRef} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
