export function exportSVG(svgEl: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  download(blob, `${filename}.svg`);
}

export function exportRaster(svgEl: SVGSVGElement, filename: string, format: "png" | "jpeg") {
  // Clone SVG and set explicit width/height from viewBox so the Image renders at full size
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  const viewBox = svgEl.viewBox.baseVal;
  const vbWidth = viewBox.width || svgEl.getBoundingClientRect().width;
  const vbHeight = viewBox.height || svgEl.getBoundingClientRect().height;
  clone.setAttribute("width", String(vbWidth));
  clone.setAttribute("height", String(vbHeight));
  clone.removeAttribute("style");

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const scale = 2; // high-res
    const canvas = document.createElement("canvas");
    canvas.width = vbWidth * scale;
    canvas.height = vbHeight * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, vbWidth, vbHeight);
    canvas.toBlob(
      (blob) => {
        if (blob) download(blob, `${filename}.${format}`);
        URL.revokeObjectURL(url);
      },
      format === "png" ? "image/png" : "image/jpeg",
      0.95
    );
  };
  img.src = url;
}

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
