import React, { useEffect, useMemo, useState } from "react";
import useUmapData from "../hooks/useUmapData";

function inferKOFromAnalysisTitle(title = "") {
  // Example titles:
  // "MSK Pooled scRNA-seq: HHEXe_umap"
  // "MSK Pooled scRNA-seq: HHEX_enhancer_deletion_umap"
  // "MSK Pooled scRNA-seq: HHEXe_heterozygous_umap"
  //
  // We want the token after ":" up to the first "_" => "HHEXe" / "HHEX"

  const t = String(title);
  const afterColon = t.includes(":") ? t.split(":").slice(1).join(":").trim() : t.trim();
  if (!afterColon) return null;

  // If the string starts with the KO label, it will be the first token before underscore
  const first = afterColon.split("_")[0]?.trim();
  return first || null;
}

const DynamicUmapPlot = ({ analysis, geneName, height = 420 }) => {
  const [PlotComponent, setPlotComponent] = useState(null);

  const isUmap = useMemo(
    () =>
      /umap/i.test(analysis?.title || "") || /_umap/i.test(analysis?.s3_png_key || ""),
    [analysis]
  );

  // NEW: infer KO label from analysis.title first (so HHEXe works)
  const koLabel = useMemo(() => {
    return inferKOFromAnalysisTitle(analysis?.title) || geneName || null;
  }, [analysis?.title, geneName]);

  // NEW: keep a stable facet order: WT then KO
  const genotypes = useMemo(() => {
    const out = ["WT"];
    if (koLabel && koLabel !== "WT") out.push(koLabel);
    return out;
  }, [koLabel]);

  // dynamic import plotly
  useEffect(() => {
    let cancelled = false;
    if (typeof window !== "undefined") {
      import("react-plotly.js").then((mod) => {
        if (!cancelled) setPlotComponent(() => mod.default);
      });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const { data, loading, error } = useUmapData(genotypes, { enabled: isUmap });

  if (!isUmap) return null;

  if (!PlotComponent || loading) {
    return <div className="de-loading">Loading interactive UMAP…</div>;
  }

  if (error || !data?.points?.length) {
    if (analysis?.s3_png_key) {
      return (
        <img
          src={`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/download/png?file_id=${encodeURIComponent(
            analysis.s3_png_key
          )}`}
          alt={analysis.title}
          className="img-plot"
        />
      );
    }
    return <div className="de-empty">UMAP unavailable</div>;
  }

  // =========================
  // Build plot: facet by genotype, color by cell type
  // =========================

  const PALETTE = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173",
    "#3182bd", "#e6550d", "#31a354", "#756bb1", "#636363",
  ];

  const genotypeOrder = genotypes;

  const celltypes = Array.from(
    new Set(data.points.map((p) => p.celltype ?? "Unknown"))
  ).sort();

  const celltypeColor = Object.fromEntries(
    celltypes.map((ct, i) => [ct, PALETTE[i % PALETTE.length]])
  );

  const byGT_CT = {};
  for (const p of data.points) {
    const gt = p.genotype ?? "Unknown";
    const ct = p.celltype ?? "Unknown";
    const key = `${gt}|||${ct}`;
    if (!byGT_CT[key]) byGT_CT[key] = [];
    byGT_CT[key].push(p);
  }

  const traces = [];
  genotypeOrder.forEach((gt, colIdx) => {
    const xaxis = colIdx === 0 ? "x" : `x${colIdx + 1}`;
    const yaxis = colIdx === 0 ? "y" : `y${colIdx + 1}`;

    celltypes.forEach((ct) => {
      const key = `${gt}|||${ct}`;
      const pts = byGT_CT[key];
      if (!pts?.length) return;

      traces.push({
        x: pts.map((p) => p.x),
        y: pts.map((p) => p.y),
        mode: "markers",
        type: "scattergl",
        name: ct,
        legendgroup: ct,
        showlegend: colIdx === 0,
        xaxis,
        yaxis,
        marker: { size: 3, opacity: 0.8, color: celltypeColor[ct] },
        hovertemplate:
          `Cell type: ${ct}<br>` +
          `Genotype: ${gt}<br>` +
          `UMAP1: %{x:.3f}<br>` +
          `UMAP2: %{y:.3f}<extra></extra>`,
      });
    });
  });

  const annotations = genotypeOrder.map((gt, colIdx) => ({
    text: `<b>${gt}</b>`,
    xref: "paper",
    yref: "paper",
    x: (colIdx + 0.5) / genotypeOrder.length,
    y: 1.06,
    showarrow: false,
    font: { size: 14 },
  }));

  const axisPack = {};
  for (let i = 1; i <= Math.max(2, genotypeOrder.length); i++) {
    const suffix = i === 1 ? "" : String(i);
    axisPack[`xaxis${suffix}`] = { visible: false, scaleanchor: `yaxis${suffix}` };
    axisPack[`yaxis${suffix}`] = { visible: false };
  }

  const shapes = [];

  if (genotypeOrder.length > 1) {
    const xDiv = 1 / genotypeOrder.length;
    shapes.push({
      type: "line",
      xref: "paper",
      yref: "paper",
      x0: xDiv,
      x1: xDiv,
      y0: 0,
      y1: 1,
      line: { color: "rgba(0,0,0,0.25)", width: 1 },
    });
  }

  genotypeOrder.forEach((_, i) => {
    const x0 = i / genotypeOrder.length;
    const x1 = (i + 1) / genotypeOrder.length;
    shapes.push({
      type: "rect",
      xref: "paper",
      yref: "paper",
      x0,
      x1,
      y0: 0,
      y1: 1,
      line: { color: "rgba(0,0,0,0.30)", width: 1 },
      fillcolor: "rgba(0,0,0,0)",
    });
  });

  const layout = {
    height,
    margin: { l: 10, r: 10, t: 30, b: 90 },
    hovermode: "closest",
    showlegend: true,
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: -0.25,
      xanchor: "center",
      x: 0.5,
    },
    grid: { rows: 1, columns: genotypeOrder.length, pattern: "independent" },
    annotations,
    shapes,
    ...axisPack,
    paper_bgcolor: "rgba(255,255,255,1)",
    plot_bgcolor: "rgba(255,255,255,1)",
  };

  return (
    <PlotComponent
      data={traces}
      layout={layout}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height }}
    />
  );
};

export default DynamicUmapPlot;
