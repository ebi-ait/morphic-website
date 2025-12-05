// src/components/DynamicVolcanoPlot.js
import React, { useMemo, useState, useRef, useEffect } from "react";
import Plot from "react-plotly.js";
import useDeTsvData from "../hooks/useDeTsvData";
import useDeSummary from "../hooks/useDeSummary";

function findColumn(columns, regex) {
  if (!Array.isArray(columns)) return null;
  const lowerRegex = regex;
  return columns.find((c) => lowerRegex.test(c.toLowerCase())) || null;
}

function classifyDeColumns(cols, analysisTitle) {
  if (!Array.isArray(cols) || !cols.length) {
    return { log2fcCol: null, pvalCol: null };
  }

  const lower = cols.map((c) => c.toLowerCase());
  const titleL = (analysisTitle || "").toLowerCase();

  const findExact = (candidates) => {
    for (const cand of candidates) {
      const idx = lower.indexOf(cand.toLowerCase());
      if (idx !== -1) return cols[idx];
    }
    return null;
  };

  // 1) Generic case (MSK-style tables, etc.) – match Python script
  const genericLog2fc = findExact([
    "log2foldchange",
    "log2fc",
    "logfc",
  ]);
  const genericPadj = findExact([
    "padj",
    "padjust",
    "p_adj",
    "p_adj_bh",
    "fdr",
    "qvalue",
  ]);

  if (genericLog2fc && genericPadj) {
    return { log2fcCol: genericLog2fc, pvalCol: genericPadj };
  }

  // 2) Condition-specific case: *_log2FoldChange
  const suffix = "_log2foldchange";
  const condCols = cols.filter((c) => c.toLowerCase().endsWith(suffix));
  if (!condCols.length) {
    return { log2fcCol: null, pvalCol: null };
  }

  const prefixToLog2 = {};
  condCols.forEach((col) => {
    const prefix = col.slice(0, -suffix.length); // e.g. 'PAX6_KO'
    prefixToLog2[prefix] = col;
  });

  const hasAnyPadj = cols.some((c) => c.toLowerCase().endsWith("_padj"));

  const findPadjForPrefixStrict = (prefix) => {
    // Strict: only *_padj – this mirrors the Python script
    const cand = (prefix + "_padj").toLowerCase();
    const idx = lower.indexOf(cand);
    return idx !== -1 ? cols[idx] : null;
  };

  const findPadjOrPvalForPrefixLoose = (prefix) => {
    // Loose: used only if there is no *_padj anywhere in the table
    const candidates = [
      prefix + "_padj",
      prefix + "_fdr",
      prefix + "_qvalue",
      prefix + "_p_adj",
      prefix + "_pvalue",
    ];
    for (const cand of candidates) {
      const idx = lower.indexOf(cand.toLowerCase());
      if (idx !== -1) return cols[idx];
    }
    return null;
  };

  const pickByKeyword = (keywords, strict = true) => {
    for (const kw of keywords) {
      for (const [prefix, log2col] of Object.entries(prefixToLog2)) {
        if (prefix.toLowerCase().includes(kw) && titleL.includes(kw)) {
          const padjCol = strict
            ? findPadjForPrefixStrict(prefix)
            : findPadjOrPvalForPrefixLoose(prefix);
          if (padjCol) return { log2fcCol: log2col, pvalCol: padjCol };
        }
      }
    }
    return null;
  };

  // ---- Primary: mirror Python (strict *_padj) ----
  let choice =
    pickByKeyword(["revert"], true) ||
    pickByKeyword(["ko"], true) ||
    pickByKeyword(["ptc"], true) ||
    pickByKeyword(["ce"], true);

  // Fallback: first prefix that has *_padj
  if (!choice) {
    for (const [prefix, log2col] of Object.entries(prefixToLog2)) {
      const padjCol = findPadjForPrefixStrict(prefix);
      if (padjCol) {
        choice = { log2fcCol: log2col, pvalCol: padjCol };
        break;
      }
    }
  }

  // Final fallback: only if there is NO *_padj anywhere, allow pvalue/fdr/qvalue
  if (!choice && !hasAnyPadj) {
    choice =
      pickByKeyword(["revert"], false) ||
      pickByKeyword(["ko"], false) ||
      pickByKeyword(["ptc"], false) ||
      pickByKeyword(["ce"], false);

    if (!choice) {
      // very last resort: first prefix with any p-like column
      for (const [prefix, log2col] of Object.entries(prefixToLog2)) {
        const padjCol = findPadjOrPvalForPrefixLoose(prefix);
        if (padjCol) {
          choice = { log2fcCol: log2col, pvalCol: padjCol };
          break;
        }
      }
    }
  }

  return choice || { log2fcCol: null, pvalCol: null };
}

function negLog10(p) {
  if (p === null || p === undefined || p <= 0) return null;
  return -Math.log10(p);
}

const DynamicVolcanoPlot = ({
                              tsvKey,
                              title,
                              height = 320,
                              preferDegSummaryBar = false,
                              // 🔹 NEW: precomputed blobs from API
                              dotplotDataFromApi = null,
                              deSummaryFromApi = null,
                            }) => {
  // Normalise possible shapes: { points: [...] } or [...] or { data: [...] }
  const rawDotplotPoints = (() => {
    if (!dotplotDataFromApi) return [];

    if (Array.isArray(dotplotDataFromApi.points)) {
      return dotplotDataFromApi.points;
    }

    if (Array.isArray(dotplotDataFromApi)) {
      // In case backend sends just an array
      return dotplotDataFromApi;
    }

    if (Array.isArray(dotplotDataFromApi.data)) {
      // Alternate key name
      return dotplotDataFromApi.data;
    }

    return [];
  })();

  const hasDotplotBlob = rawDotplotPoints.length > 0;

  const isNumberDegsTitle = useMemo(() => {
    const t = (title || "").toLowerCase();
    const key = (tsvKey || "").toLowerCase();
    const pattern = /(number[-_ ]?degs?)|(#\s*degs)/;
    return pattern.test(t) || pattern.test(key);
  }, [title, tsvKey]);

  const isTopDegDotplot = useMemo(() => {
    const t = (title || "").toLowerCase();
    const key = (tsvKey || "").toLowerCase();
    return /topdeg[-_ ]?dotplot/.test(t) || /topdeg[-_ ]?dotplot/.test(key);
  }, [title, tsvKey]);

  // 🔹 Only load TSV when we actually need it
  const shouldLoadTsv = !(isTopDegDotplot && hasDotplotBlob);

  const { rows, loading, error } = useDeTsvData(
    shouldLoadTsv ? tsvKey || null : null,
    { enabled: true, title }   // 👈 pass the analysis title
  );

  console.log("[DynamicVolcanoPlot] flags", {
    title,
    isTopDegDotplot,
    hasDotplotBlob,
    shouldLoadTsv,
    hasDotplotDataFromApi: !!dotplotDataFromApi,
  });

  const [viewMode, setViewMode] = useState(
    isTopDegDotplot
      ? "dotplot"
      : isNumberDegsTitle || preferDegSummaryBar
        ? "bar"
        : "volcano"
  );

  useEffect(() => {
    if (isTopDegDotplot) {
      setViewMode("dotplot");
    } else if (isNumberDegsTitle || preferDegSummaryBar) {
      setViewMode("bar");
    } else {
      setViewMode("volcano");
    }
  }, [isTopDegDotplot, isNumberDegsTitle, preferDegSummaryBar, tsvKey]);

  // Thresholds
  const [pCutoff, setPCutoff] = useState(0.05);
  const [pCutoffInput, setPCutoffInput] = useState(0.05);

  const [log2fcCutoffInput, setLog2fcCutoffInput] = useState("1");
  const [log2fcCutoff, setLog2fcCutoff] = useState(1);

  const [conditionFilter, setConditionFilter] = useState("");
  const [pathwayFilter, setPathwayFilter] = useState("");

  const [xRange, setXRange] = useState(null);
  const [yRange, setYRange] = useState(null);
  const plotRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const num = parseFloat(pCutoffInput);

      if (!isNaN(num)) {
        setPCutoff(Math.min(1, Math.max(0, num)));
      }
    }, 300);

    return () => clearTimeout(id);
  }, [pCutoffInput]);

  useEffect(() => {
    const id = setTimeout(() => {
      const num = parseFloat(log2fcCutoffInput);
      if (!isNaN(num)) setLog2fcCutoff(Math.max(0, num));
    }, 300);
    return () => clearTimeout(id);
  }, [log2fcCutoffInput]);

  const cols = useMemo(() => {
    if (rows && rows.length > 0) {
      const keys = Object.keys(rows[0]);
      console.log("[DynamicVolcanoPlot] row keys sample:", keys);
      return keys;
    }
    return [];
  }, [rows]);

  const { log2fcCol, pvalCol } = useMemo(
    () => classifyDeColumns(cols, title),
    [cols, title]
  );
  const conditionCol = useMemo(
    () => findColumn(cols, /condition|contrast|group|comparison/i),
    [cols]
  );
  const pathwayCol = useMemo(
    () => findColumn(cols, /pathway|term|gs_name|ont|category/i),
    [cols]
  );
  const diffexpressedCol = useMemo(
    () => findColumn(cols, /diffexpressed|de_flag|is_de|de_label|delabel/i),
    [cols]
  );
  const cellTypeCol = useMemo(
    () => findColumn(cols, /celltype|cell_type|stage|condition|cluster|group/i),
    [cols]
  );

  const supportsDegSummaryBar = useMemo(
    () => !!log2fcCol && !!cellTypeCol && !!rows && rows.length > 0,
    [log2fcCol, cellTypeCol, rows]
  );

  const { summary, loading: summaryLoading, error: summaryError } =
    useDeSummary(isNumberDegsTitle ? tsvKey : null);

  useEffect(() => {
    if (supportsDegSummaryBar && isNumberDegsTitle && !dotplotDataFromApi) {
      console.log(
        '[DynamicVolcanoPlot] switching viewMode to "bar" for',
        tsvKey,
        "title:",
        title
      );
      setViewMode("bar");
    }
  }, [supportsDegSummaryBar, isNumberDegsTitle, tsvKey, title, dotplotDataFromApi]);

  // ---- DEBUG LOGGING ----
  useEffect(() => {
    if (!rows || !rows.length) return;

    console.groupCollapsed(
      `[DynamicVolcanoPlot] debug for TSV`,
      tsvKey,
      "title:",
      title
    );
    console.log("columns:", cols);
    console.log("log2fcCol:", log2fcCol);
    console.log("pvalCol:", pvalCol);
    console.log("diffexpressedCol:", diffexpressedCol);
    console.log("cellTypeCol:", cellTypeCol);
    console.log("conditionCol:", conditionCol);
    console.log("pathwayCol:", pathwayCol);
    console.log("supportsDegSummaryBar:", supportsDegSummaryBar);
    console.log("isNumberDegsTitle:", isNumberDegsTitle);
    console.log("current viewMode:", viewMode);
    console.log("dotplotDataFromApi:", dotplotDataFromApi);
    console.groupEnd();
  }, [
    rows,
    cols,
    log2fcCol,
    pvalCol,
    diffexpressedCol,
    cellTypeCol,
    conditionCol,
    pathwayCol,
    supportsDegSummaryBar,
    isNumberDegsTitle,
    viewMode,
    tsvKey,
    title,
    dotplotDataFromApi,
  ]);

  const symbolCol = useMemo(() => {
    if (!cols || !cols.length) return null;
    const lower = cols.map((c) => c.toLowerCase());
    const pick = (regex) => {
      const idx = lower.findIndex((c) => regex.test(c));
      return idx >= 0 ? cols[idx] : null;
    };
    return (
      pick(/(^|_)symbol$/i) ||
      pick(/gene_symbol/i) ||
      pick(/hgnc_symbol/i) ||
      pick(/external_gene_name/i) ||
      pick(/(^|_)gene$/i)
    );
  }, [cols]);

  // Unique values for condition & pathway filters
  const { conditions, pathways } = useMemo(() => {
    const condSet = new Set();
    const pathSet = new Set();

    (rows || []).forEach((r) => {
      if (!r) return;
      if (conditionCol && r[conditionCol]) condSet.add(String(r[conditionCol]));
      if (pathwayCol && r[pathwayCol]) pathSet.add(String(r[pathwayCol]));
    });

    return {
      conditions: Array.from(condSet).sort(),
      pathways: Array.from(pathSet).sort(),
    };
  }, [rows, conditionCol, pathwayCol]);

  // Only filter by condition and pathway — NOT by significance thresholds
  const filteredRows = useMemo(() => {
    if (!rows || !rows.length) return [];

    return rows.filter((r) => {
      if (!r) return false;

      if (
        conditionCol &&
        conditionFilter &&
        String(r[conditionCol]) !== conditionFilter
      ) {
        return false;
      }

      if (
        pathwayCol &&
        pathwayFilter &&
        String(r[pathwayCol]) !== pathwayFilter
      ) {
        return false;
      }

      return true;
    });
  }, [rows, conditionCol, conditionFilter, pathwayCol, pathwayFilter]);

  useEffect(() => {
    if (!rows || !rows.length) return;
    console.log("[DynamicVolcanoPlot] first 3 rows for", tsvKey, rows.slice(0, 3));
  }, [rows, tsvKey]);

  useEffect(() => {
    if (!rows || !rows.length) return;

    if (cellTypeCol) {
      const cellTypes = Array.from(
        new Set(rows.map((r) => r[cellTypeCol]).filter(Boolean))
      );
      console.log(
        "[DynamicVolcanoPlot] unique cell types (truncated TSV):",
        cellTypes
      );
    }
  }, [rows, cellTypeCol]);

  // Global volcano data (all rows, no filters) – for axis ranges
  const allVolcanoData = useMemo(() => {
    if (!rows || !rows.length || !log2fcCol || !pvalCol) {
      return { x: [], y: [] };
    }

    const x = [];
    const y = [];

    rows.forEach((r) => {
      const lfc = Number(r[log2fcCol]);
      const p = Number(r[pvalCol]);
      if (!Number.isFinite(lfc) || !Number.isFinite(p) || p <= 0) return;

      x.push(lfc);
      y.push(negLog10(p));
    });

    return { x, y };
  }, [rows, log2fcCol, pvalCol]);

  // Derived default ranges from *all* data
  const defaultRanges = useMemo(() => {
    const { x, y } = allVolcanoData;
    if (!x.length || !y.length) {
      return {
        x: [-2, 2],
        y: [0, 10],
      };
    }

    const xMin = Math.min(...x);
    const xMax = Math.max(...x);
    const yMin = Math.min(...y);
    const yMax = Math.max(...y);

    const padX = (xMax - xMin || 1) * 0.1;
    const padY = (yMax - yMin || 1) * 0.1;

    return {
      x: [xMin - padX, xMax + padX],
      y: [Math.max(0, yMin - padY), yMax + padY],
    };
  }, [allVolcanoData]);

  // Volcano data after condition/pathway filters (all points)
  const volcanoData = useMemo(() => {
    if (!filteredRows.length || !log2fcCol || !pvalCol) {
      return { x: [], y: [], text: [] };
    }

    const x = [];
    const y = [];
    const text = [];

    filteredRows.forEach((r) => {
      const lfc = Number(r[log2fcCol]);
      const p = Number(r[pvalCol]);
      const yVal = negLog10(p);
      if (!Number.isFinite(lfc) || yVal === null) return;

      x.push(lfc);
      y.push(yVal);

      const symbol = symbolCol ? r[symbolCol] : "";
      text.push(symbol || "");
    });

    return { x, y, text };
  }, [filteredRows, log2fcCol, pvalCol, symbolCol]);

  const groupedPoints = useMemo(() => {
    const up = { x: [], y: [], text: [] };
    const down = { x: [], y: [], text: [] };
    const grey = { x: [], y: [], text: [] };

    if (!filteredRows.length || !log2fcCol || !pvalCol) {
      return { up, down, grey };
    }

    filteredRows.forEach((r) => {
      const lfc = Number(r[log2fcCol]);
      const p = Number(r[pvalCol]);
      const yVal = negLog10(p);
      if (!Number.isFinite(lfc) || yVal === null) return;

      const symbol = symbolCol && r[symbolCol] ? String(r[symbolCol]) : "";
      const padjStr = p.toExponential(2);
      const baseLine = `log2FC: ${lfc.toFixed(2)}<br>padj: ${padjStr}`;

      const label = symbol ? `${symbol}<br>${baseLine}` : baseLine;

      const isSignificant = p <= pCutoff && Math.abs(lfc) >= log2fcCutoff;

      if (isSignificant && lfc > 0) {
        up.x.push(lfc);
        up.y.push(yVal);
        up.text.push(label);
      } else if (isSignificant && lfc < 0) {
        down.x.push(lfc);
        down.y.push(yVal);
        down.text.push(label);
      } else {
        grey.x.push(lfc);
        grey.y.push(yVal);
        grey.text.push(label);
      }
    });

    return { up, down, grey };
  }, [filteredRows, log2fcCol, pvalCol, symbolCol, pCutoff, log2fcCutoff]);

  // Heatmap data: 2D histogram of log2FC vs –log10(p) (filtered)
  const heatmapTraces = useMemo(() => {
    const { x, y } = volcanoData;
    if (!x.length || !y.length) return [];

    return [
      {
        x,
        y,
        type: "histogram2d",
        colorscale: "Viridis",
        colorbar: { title: "# genes" },
      },
    ];
  }, [volcanoData]);

  // ---- Zoom handlers ----

  const handleRelayout = (evt) => {
    const xr0 = evt["xaxis.range[0]"];
    const xr1 = evt["xaxis.range[1]"];
    const yr0 = evt["yaxis.range[0]"];
    const yr1 = evt["yaxis.range[1]"];

    if (xr0 != null && xr1 != null) setXRange([xr0, xr1]);
    if (yr0 != null && yr1 != null) setYRange([yr0, yr1]);
  };

  const handleZoomReset = () => {
    setXRange(defaultRanges.x);
    setYRange(defaultRanges.y);
  };

  const handleZoom = (factor) => {
    const currentX = xRange || defaultRanges.x;
    const currentY = yRange || defaultRanges.y;
    if (!currentX || !currentY) return;

    const [x0, x1] = currentX;
    const [y0, y1] = currentY;

    const xCenter = (x0 + x1) / 2;
    const yCenter = (y0 + y1) / 2;

    const xHalf = ((x1 - x0) / 2) * factor;
    const yHalf = ((y1 - y0) / 2) * factor;

    setXRange([xCenter - xHalf, xCenter + xHalf]);
    setYRange([yCenter - yHalf, yCenter + yHalf]);
  };

  // ---- Render helpers ----

  const renderControls = () => (
    <div className="de-controls">
      <div className="de-controls-row">
        {/* View mode buttons are hidden for now; viewMode is driven programmatically */}
      </div>

      {/* Filters row */}
      <div className="de-controls-row de-filters-row">
        {/* Condition filter */}
        {conditionCol && conditions.length > 0 && (
          <div className="de-control-group">
            <label className="de-control-label">
              Condition:
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
              >
                <option value="">All</option>
                {conditions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Pathway filter */}
        {pathwayCol && pathways.length > 0 && (
          <div className="de-control-group">
            <label className="de-control-label">
              Pathways involved in:
              <select
                value={pathwayFilter}
                onChange={(e) => setPathwayFilter(e.target.value)}
              >
                <option value="">All</option>
                {pathways.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* p-value cutoff */}
        {pvalCol && log2fcCol && (
          <div className="de-control-group de-thresholds-group">
            <div className="de-thresholds-pill">
              <label className="de-threshold-field">
                <span className="de-threshold-caption">padj ≤</span>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max="1"
                  value={pCutoffInput}
                  onChange={(e) => setPCutoffInput(Number(e.target.value))}
                  className="de-threshold-input"
                />
              </label>

              <span className="de-threshold-separator">·</span>

              <label className="de-threshold-field">
                <span className="de-threshold-caption">|log₂FC| ≥</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={log2fcCutoffInput}
                  onChange={(e) =>
                    setLog2fcCutoffInput(Number(e.target.value))
                  }
                  className="de-threshold-input"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTable = () => {
    if (!filteredRows.length) {
      return <div className="de-empty">No rows pass the current filters.</div>;
    }

    const visibleCols = cols.slice(0, 8);

    return (
      <div className="de-table-wrapper">
        <table className="de-table">
          <thead>
          <tr>
            {visibleCols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {filteredRows.slice(0, 500).map((row, i) => (
            <tr key={i}>
              {visibleCols.map((c) => (
                <td key={c}>{row[c]}</td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
        {filteredRows.length > 500 && (
          <div className="de-table-note">
            Showing first 500 of {filteredRows.length.toLocaleString()} rows.
          </div>
        )}
      </div>
    );
  };

  const renderVolcano = () => {
    if (!rows || !rows.length || !log2fcCol || !pvalCol) {
      return (
        <div className="de-empty">
          Dynamic volcano plot unavailable for this TSV. Showing static image
          below.
        </div>
      );
    }

    const { up, down, grey } = groupedPoints;
    const hasPoints = up.x.length + down.x.length + grey.x.length > 0;

    return (
      <Plot
        ref={plotRef}
        data={[
          {
            x: grey.x,
            y: grey.y,
            text: grey.text,
            mode: "markers",
            type: "scattergl",
            name: "No",
            marker: {
              size: 5,
              opacity: 0.5,
              color: "rgba(150,150,150,0.6)",
            },
            hovertemplate: "%{text}<extra></extra>",
          },
          {
            x: up.x,
            y: up.y,
            text: up.text,
            mode: "markers",
            type: "scattergl",
            name: "Up",
            marker: {
              size: 6,
              opacity: 0.9,
              color: "rgba(220, 20, 60, 0.9)",
            },
            hovertemplate: "%{text}<extra></extra>",
          },
          {
            x: down.x,
            y: down.y,
            text: down.text,
            mode: "markers",
            type: "scattergl",
            name: "Down",
            marker: {
              size: 6,
              opacity: 0.9,
              color: "rgba(30, 144, 255, 0.9)",
            },
            hovertemplate: "%{text}<extra></extra>",
          },
        ]}
        layout={{
          title: "",
          margin: { l: 40, r: 10, t: 10, b: 40 },
          xaxis: {
            title: "log2 fold change",
            zeroline: true,
            range: xRange || defaultRanges.x,
          },
          yaxis: {
            title: "-log10(padj)",
            zeroline: true,
            range: yRange || defaultRanges.y,
          },
          showlegend: true,
          legend: {
            x: 1,
            xanchor: "right",
            y: 1,
            yanchor: "top",
            bgcolor: "rgba(255,255,255,0.6)",
            bordercolor: "rgba(0,0,0,0.1)",
            borderwidth: 1,
            font: { size: 11 },
            orientation: "v",
          },
          height,
          hovermode: "closest",
          uirevision: "volcano-axes",
          annotations: !hasPoints
            ? [
              {
                text: "No points pass current filters",
                xref: "paper",
                yref: "paper",
                x: 0.5,
                y: 0.5,
                showarrow: false,
                font: { size: 14 },
              },
            ]
            : [],
          transition: { duration: 0 },
        }}
        config={{
          responsive: true,
          displayModeBar: "hover",
          scrollZoom: true,
        }}
        style={{ width: "100%", height }}
        onRelayout={handleRelayout}
      />
    );
  };

  const renderDegSummaryBarplot = () => {
    // 1) NUMBER OF DEGS CASE (uses summary / deSummaryFromApi)
    if (isNumberDegsTitle) {
      // Prefer backend JSON blob if present
      const summaryToUse = Array.isArray(deSummaryFromApi) && deSummaryFromApi.length
        ? deSummaryFromApi
        : summary;

      if (!deSummaryFromApi) {
        // Only show loading / error when we rely on dynamic summary
        if (summaryError) {
          console.warn("[DynamicVolcanoPlot] summary error:", summaryError);
        }
        if (summaryLoading) {
          return (
            <div className="de-empty">
              Loading DEG summary…
            </div>
          );
        }
      }

      if (!summaryToUse || summaryToUse.length === 0) {
        return (
          <div className="de-empty">
            No differentially expressed genes to summarise (summary).
          </div>
        );
      }

      const categories = summaryToUse.map((s) => s.celltype);
      const upCounts = summaryToUse.map((s) => s.up);
      const downCounts = summaryToUse.map((s) => s.down);

      console.log(
        "[DynamicVolcanoPlot] barplot (summary) categories:",
        categories
      );
      console.log(
        "[DynamicVolcanoPlot] barplot (summary) upCounts:",
        upCounts
      );
      console.log(
        "[DynamicVolcanoPlot] barplot (summary) downCounts:",
        downCounts
      );

      return (
        <Plot
          ref={plotRef}
          data={[
            {
              x: categories,
              y: upCounts,
              name: "Up",
              type: "bar",
              marker: {
                color: "rgba(220, 20, 60, 0.9)",
              },
              hovertemplate:
                "Cell type: %{x}<br>Up DEGs: %{y}<extra></extra>",
            },
            {
              x: categories,
              y: downCounts,
              name: "Down",
              type: "bar",
              marker: {
                color: "rgba(30, 144, 255, 0.9)",
              },
              hovertemplate:
                "Cell type: %{x}<br>Down DEGs: %{y}<extra></extra>",
            },
          ]}
          layout={{
            title: title || "",
            barmode: "group",
            margin: { l: 60, r: 10, t: 40, b: 60 },
            xaxis: {
              title: "",
              tickangle: -35,
            },
            yaxis: {
              title: "Number of DEGs",
              rangemode: "tozero",
            },
            showlegend: true,
            legend: {
              x: 1,
              xanchor: "right",
              y: 1,
              yanchor: "top",
              bgcolor: "rgba(255,255,255,0.6)",
              bordercolor: "rgba(0,0,0,0.1)",
              borderwidth: 1,
              font: { size: 11 },
            },
            height,
            hovermode: "closest",
          }}
          config={{
            responsive: true,
            displayModeBar: "hover",
            scrollZoom: false,
          }}
          style={{ width: "100%", height }}
        />
      );
    }

    // 2) NON-#DEGS CASE: derive counts directly from existing rows
    if (!supportsDegSummaryBar || !rows || !rows.length) {
      return (
        <div className="de-empty">
          Barplot unavailable for this TSV.
        </div>
      );
    }

    const countsByCellType = new Map(); // key: cell type label, value: { up, down }

    rows.forEach((r) => {
      if (!r) return;

      const ct = r[cellTypeCol];
      if (!ct) return;

      const lfc = Number(r[log2fcCol]);
      if (!Number.isFinite(lfc) || lfc === 0) return;

      let isDE = false;

      if (diffexpressedCol) {
        // Use explicit diffexpressed flag when available
        const rawFlag = r[diffexpressedCol];
        const flag = String(rawFlag ?? "").toLowerCase();

        isDE =
          !!flag &&
          flag !== "no" &&
          flag !== "0" &&
          flag !== "false" &&
          flag !== "na";
      } else if (pvalCol) {
        // Fallback: use padj + |log2FC| thresholds
        const p = Number(r[pvalCol]);
        isDE =
          Number.isFinite(p) &&
          p > 0 &&
          p <= pCutoff &&
          Math.abs(lfc) >= log2fcCutoff;
      } else {
        // Last-resort: treat all non-zero log2FC as DE
        isDE = true;
      }

      if (!isDE) return;

      const key = String(ct);
      if (!countsByCellType.has(key)) {
        countsByCellType.set(key, { up: 0, down: 0 });
      }

      const entry = countsByCellType.get(key);
      if (lfc > 0) entry.up += 1;
      else if (lfc < 0) entry.down += 1;
    });

    if (!countsByCellType.size) {
      return (
        <div className="de-empty">
          No differentially expressed genes to summarise.
        </div>
      );
    }

    const categories = Array.from(countsByCellType.keys());
    const upCounts = categories.map((k) => countsByCellType.get(k).up);
    const downCounts = categories.map((k) => countsByCellType.get(k).down);

    console.log(
      "[DynamicVolcanoPlot] barplot (rows) categories:",
      categories
    );
    console.log(
      "[DynamicVolcanoPlot] barplot (rows) upCounts:",
      upCounts
    );
    console.log(
      "[DynamicVolcanoPlot] barplot (rows) downCounts:",
      downCounts
    );

    return (
      <Plot
        ref={plotRef}
        data={[
          {
            x: categories,
            y: upCounts,
            name: "Up",
            type: "bar",
            marker: {
              color: "rgba(220, 20, 60, 0.9)",
            },
            hovertemplate:
              "Cell type: %{x}<br>Up DEGs: %{y}<extra></extra>",
          },
          {
            x: categories,
            y: downCounts,
            name: "Down",
            type: "bar",
            marker: {
              color: "rgba(30, 144, 255, 0.9)",
            },
            hovertemplate:
              "Cell type: %{x}<br>Down DEGs: %{y}<extra></extra>",
          },
        ]}
        layout={{
          title: title || "",
          barmode: "group",
          margin: { l: 60, r: 10, t: 40, b: 60 },
          xaxis: {
            title: "",
            tickangle: -35,
          },
          yaxis: {
            title: "Number of DEGs",
            rangemode: "tozero",
          },
          showlegend: true,
          legend: {
            x: 1,
            xanchor: "right",
            y: 1,
            yanchor: "top",
            bgcolor: "rgba(255,255,255,0.6)",
            bordercolor: "rgba(0,0,0,0.1)",
            borderwidth: 1,
            font: { size: 11 },
          },
          height,
          hovermode: "closest",
        }}
        config={{
          responsive: true,
          displayModeBar: "hover",
          scrollZoom: false,
        }}
        style={{ width: "100%", height }}
      />
    );
  };

  const renderHeatmap = () => {
    if (!rows || !rows.length || !log2fcCol || !pvalCol) {
      return (
        <div className="de-empty">
          Not enough data to build a heatmap. Showing static image below.
        </div>
      );
    }

    if (!heatmapTraces.length) {
      return (
        <div className="de-empty">
          No points pass current filters for heatmap.
        </div>
      );
    }

    const heatmapHeight = 240; // try 220–260 until it feels right

    return (
      <Plot
        ref={plotRef}
        data={heatmapTraces}
        layout={{
          title: "",
          margin: {
            l: 40,
            r: 10,
            t: 10,
            b: 40,
          },
          xaxis: {
            title: "log2 fold change",
            range: xRange || defaultRanges.x,
          },
          yaxis: {
            title: "-log10(padj)",
            range: yRange || defaultRanges.y,
          },
          showlegend: false,
          height: heatmapHeight,     // 👈 fixed height
          hovermode: "closest",
          uirevision: "volcano-axes",
          transition: { duration: 0 },
        }}
        config={{
          responsive: true,
          displayModeBar: "hover",
          scrollZoom: true,
        }}
        style={{ width: "100%", height: heatmapHeight }} // 👈 match style
        onRelayout={handleRelayout}
      />
    );
  };


  const RDBU_JSON_SCALE = [
    [0.0,  "#4575B4"],
    [0.1667, "#6D8EC3"],
    [0.3333, "#9FB1D6"],
    [0.5,   "#E0E5F2"],
    [0.6667, "#F4A28E"],
    [0.8333, "#D8564A"],
    [1.0,  "#D73027"]
  ];

// -------------------------------
// Dotplot Renderer
// -------------------------------
  const renderTopDegDotplot = () => {
    if (!isTopDegDotplot) return null;

    // Prefer backend blob
    const points = rawDotplotPoints || [];

    if (!points.length) {
      return <div className="de-empty">No dotplot data available.</div>;
    }

    // Extract fields
    const xCats = Array.from(new Set(points.map(p => p.celltype)));
    const yCats = Array.from(new Set(points.map(p => p.gene)));

    const x = points.map(p => xCats.indexOf(p.celltype) + 1);
    const y = points.map(p => yCats.indexOf(p.gene) + 1);

    const log2fc = points.map(p => Number(p.log2fc));
    const padj = points.map(p => Number(p.padj));

    // size = -log10(padj)
    const neglog = padj.map(v => -Math.log10(v));
    const MIN_S = 7, MAX_S = 30;

    const minN = Math.min(...neglog);
    const maxN = Math.max(...neglog);
    const denom = maxN - minN || 1;

    const sizes = neglog.map(v => MIN_S + ((v - minN) / denom) * (MAX_S - MIN_S));

    const maxAbsLFC = Math.max(...log2fc.map(v => Math.abs(v))) || 1;

    const text = points.map((p, i) =>
      `celltype: ${p.celltype}` +
      `<br>gene: ${p.gene}` +
      `<br>-log10(padj): ${neglog[i].toFixed(2)}` +
      `<br>log2FC: ${p.log2fc.toFixed(2)}`
    );

    const dotplotHeight = Math.max(200, yCats.length * 18);

    // -------------------------------
    // ADD SIZE LEGEND (manual circles)
    // -------------------------------
    const sizeLegend = [
      { label: "High significance", value: maxN },
      { label: "Medium significance", value: (maxN + minN) / 2 },
      { label: "Low significance", value: minN }
    ];

    const legendSizes = sizeLegend.map(s =>
      MIN_S + ((s.value - minN) / denom) * (MAX_S - MIN_S)
    );

    const legendTrace = {
      x: [1, 1, 1],
      y: [1.22, 1.27, 1.32], // positioned above plot
      mode: "markers+text",
      text: sizeLegend.map((s) => s.label),
      textposition: "right",
      hoverinfo: "skip",
      marker: {
        size: legendSizes,
        color: "rgba(100,100,100,0.6)",
        line: { width: 0.8, color: "black" }
      },
      showlegend: false,
      xaxis: "x2",
      yaxis: "y2"
    };

    return (
      <Plot
        data={[
          {
            type: "scattergl",
            mode: "markers",
            x,
            y,
            text,
            hovertemplate: "%{text}<extra></extra>",
            marker: {
              size: sizes,
              sizemode: "diameter",
              color: log2fc,
              colorscale: RDBU_JSON_SCALE,
              cmin: -maxAbsLFC,
              cmax: maxAbsLFC,
              reversescale: false,
              colorbar: {
                title: "log2FC",
                len: 0.5
              },
              line: { width: 0.5, color: "rgba(0,0,0,0.3)" }
            }
          },
          // legendTrace // ← adds size legend
        ]}
        layout={{
          height: dotplotHeight,
          margin: { t: 0, r: 20, b: 40, l: 70 },
          hovermode: "closest",
          xaxis: {
            tickmode: "array",
            tickvals: xCats.map((_, i) => i + 1),
            ticktext: xCats,
            tickangle: -45
          },
          yaxis: {
            tickmode: "array",
            tickvals: yCats.map((_, i) => i + 1),
            ticktext: yCats
          },

          // extra axes for size legend
          xaxis2: {
            visible: false,
            domain: [0.75, 0.95]
          },
          yaxis2: {
            visible: false,
            domain: [1.05, 1.25]
          }
        }}
        config={{
          responsive: true,
          displaylogo: false,
          scrollZoom: false
        }}
        style={{ width: "100%", height: dotplotHeight }}
      />
    );
  };



  // ---- Top-level render ----

  if (!tsvKey) return null;

  if (loading) {
    return (
      <div className="de-panel">
        <div className="de-loading">Loading dynamic data…</div>
      </div>
    );
  }

  if (error) {
    console.warn("[DynamicVolcanoPlot] error", error);
    return (
      <div className="de-panel">
        <div className="de-empty">
          Dynamic plot unavailable, showing static image instead.
        </div>
      </div>
    );
  }

  return (
    <div className="de-panel">
      {renderControls()}

      <div className="de-visualisation">
        {viewMode === "volcano" && renderVolcano()}
        {viewMode === "bar" && renderDegSummaryBarplot()}
        {viewMode === "table" && renderTable()}
        {viewMode === "heatmap" && renderHeatmap()}
        {viewMode === "dotplot" && renderTopDegDotplot()}
      </div>
    </div>
  );
};

export default DynamicVolcanoPlot;
