// src/components/DynamicEnrichmentPlot.js
import React, { useMemo } from "react";
import { useEnrichmentTsvData } from "../hooks/useEnrichmentTsvData";

const Plot =
  typeof window !== "undefined" ? require("react-plotly.js").default : () => null;

const padjToNegLog10 = (p) => {
  if (!p || p <= 0) return 0;
  return -Math.log10(p);
};

const DynamicEnrichmentPlot = ({ analysis }) => {
  const { rows, loading, error } = useEnrichmentTsvData(
    analysis.s3_tsv_key,
    analysis.title || "enrichment"
  );

  const { x, y, text } = useMemo(() => {
    const x = [];
    const y = [];
    const text = [];

    rows.forEach((r) => {
      if (!r.pathway || r.padj === null || r.padj === undefined) return;

      x.push(padjToNegLog10(r.padj));
      y.push(r.pathway);

      const pieces = [];
      pieces.push(r.pathway);
      if (typeof r.nes === "number") {
        pieces.push(`NES=${r.nes.toFixed(2)}`);
      }
      if (typeof r.size === "number") {
        pieces.push(`size=${r.size}`);
      }

      text.push(pieces.join("<br>"));
    });

    return { x, y, text };
  }, [rows]);

  if (typeof window === "undefined") {
    return null;
  }

  if (loading) return <p>Loading dynamic enrichment plot…</p>;
  if (error || !rows.length) {
    return <p>Dynamic enrichment plot unavailable, showing static image instead.</p>;
  }

  return (
    <Plot
      data={[
        {
          x,
          y,
          type: "bar",
          orientation: "h",
          hovertemplate: "%{text}<br>-log₁₀(padj)=%{x:.2f}<extra></extra>",
        },
      ]}
      layout={{
        margin: { l: 220, r: 10, t: 30, b: 40 },
        xaxis: { title: "-log₁₀(padj)" },
        yaxis: { automargin: true },
        showlegend: false,
        title: analysis.title || "Pathway enrichment",
      }}
      config={{
        displayModeBar: true,
        responsive: true,
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
    />
  );
};

export default DynamicEnrichmentPlot;
