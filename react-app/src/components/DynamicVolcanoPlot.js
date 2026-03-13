import React, { useMemo, useState, useRef, useEffect } from "react";
import useDeTsvData from "../hooks/useDeTsvData";
import useDeSummary from "../hooks/useDeSummary";
import { Search } from "lucide-react";

function findColumn(columns, regex) {
    if (!Array.isArray(columns)) return null;
    const lowerRegex = regex;
    return columns.find((c) => lowerRegex.test(c.toLowerCase())) || null;
}

function negLog10(p) {
    if (p === null || p === undefined || p <= 0) return null;
    return -Math.log10(p);
}

const DynamicVolcanoPlot = ({
                                tsvKey,
                                title,
                                geneName = null,
                                height = 320,
                                preferDegSummaryBar = false,
                                dotplotDataFromApi = null,
                                deSummaryFromApi = null,
                                deConditions = [],
                                defaultConditionId = null,
                            }) => {
    // 1) Dynamic import for react-plotly.js
    const [PlotComponent, setPlotComponent] = useState(null);
    const plotRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        if (typeof window !== "undefined") {
            import("react-plotly.js")
                .then((mod) => {
                    if (!cancelled) {
                        setPlotComponent(() => mod.default);
                    }
                })
                .catch((err) => {
                    console.error("[DynamicVolcanoPlot] Failed to load react-plotly.js", err);
                });
        }

        return () => {
            cancelled = true;
        };
    }, []);

    // 2) Your dotplot points – using useMemo instead of IIFE is a small improvement
    const rawDotplotPoints = useMemo(() => {
        if (!dotplotDataFromApi) return [];

        if (Array.isArray(dotplotDataFromApi.points)) {
            return dotplotDataFromApi.points;
        }

        if (Array.isArray(dotplotDataFromApi)) {
            return dotplotDataFromApi;
        }

        if (Array.isArray(dotplotDataFromApi.data)) {
            return dotplotDataFromApi.data;
        }

        return [];
    }, [dotplotDataFromApi]);

    const hasDotplotBlob = rawDotplotPoints.length > 0;

    const isNumberDegsTitle = useMemo(() => {
        const t = (title || "").toLowerCase();
        const key = (tsvKey || "").toLowerCase();
        const pattern = /(number[-_ ]?degs?)|(#\s*degs)/;
        return pattern.test(t) || pattern.test(key);
    }, [title, tsvKey]);

    const isDegSummaryBarplot = isNumberDegsTitle || preferDegSummaryBar;

    const isTopDegDotplot = useMemo(() => {
        const t = (title || "").toLowerCase();
        const key = (tsvKey || "").toLowerCase();
        return /topdeg[-_ ]?dotplot/.test(t) || /topdeg[-_ ]?dotplot/.test(key);
    }, [title, tsvKey]);

    const shouldLoadTsv = !(isTopDegDotplot && hasDotplotBlob);

    const [selectedConditionId, setSelectedConditionId] = useState(() => {
        if (defaultConditionId) return defaultConditionId;
        if (deConditions && deConditions.length > 0) {
            return deConditions[0].condition_id;
        }
        return null;
    });

    useEffect(() => {
        if (!deConditions || deConditions.length === 0) return;

        if (
            defaultConditionId &&
            deConditions.some((c) => c.condition_id === defaultConditionId)
        ) {
            setSelectedConditionId(defaultConditionId);
        } else if (
            selectedConditionId &&
            deConditions.some((c) => c.condition_id === selectedConditionId)
        ) {
            return;
        } else {
            setSelectedConditionId(deConditions[0].condition_id);
        }
    }, [deConditions, defaultConditionId]);

    const currentCondition = useMemo(() => {
        if (!deConditions || deConditions.length === 0) return null;
        const found = deConditions.find(
            (c) => c.condition_id === selectedConditionId
        );
        return found || deConditions[0];
    }, [deConditions, selectedConditionId]);

    const { rows, loading, error } = useDeTsvData(
        shouldLoadTsv ? tsvKey || null : null,
        {
            enabled: true,
            title,
            condition: currentCondition
        }
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

    const [tableSide, setTableSide] = useState("up");

    useEffect(() => {
        if (isTopDegDotplot) {
            setViewMode("dotplot");
        } else if (isNumberDegsTitle || preferDegSummaryBar) {
            setViewMode("bar");
        } else {
            setViewMode("volcano");
        }
    }, [isTopDegDotplot, isNumberDegsTitle, preferDegSummaryBar, tsvKey]);

    const prettyConditionLabel = (conditionId) => {
        if (!conditionId) return "";
        let label = conditionId;
        label = label.replace(/^PAX6_/, "PAX6 ");
        label = label.replace(/_/g, " ");
        return label;
    };

    const [pCutoff, setPCutoff] = useState(0.05);
    const [pCutoffInput, setPCutoffInput] = useState(0.05);

    const [log2fcCutoffInput, setLog2fcCutoffInput] = useState("0.5");
    const [log2fcCutoff, setLog2fcCutoff] = useState(0.5);

    const [conditionFilter, setConditionFilter] = useState("");
    const [pathwayFilter, setPathwayFilter] = useState("");

    const [xRange, setXRange] = useState(null);
    const [yRange, setYRange] = useState(null);

    const [tableSearch, setTableSearch] = useState("");

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

    useEffect(() => {
        if (currentCondition?.thresholds?.abs_log2fc) {
            setLog2fcCutoff(currentCondition.thresholds.abs_log2fc);
            setLog2fcCutoffInput(currentCondition.thresholds.abs_log2fc);
        }

        if (currentCondition?.thresholds?.padj) {
            setPCutoff(currentCondition.thresholds.padj);
            setPCutoffInput(currentCondition.thresholds.padj);
        }
    }, [currentCondition]);

    const { log2fcCol, pvalCol } = useMemo(() => {
        // parseTsv already resolved the correct condition columns
        // and flattened them into "log2fc" and "padj"
        return { log2fcCol: "log2fc", pvalCol: "padj" };
    }, []);

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
    }, [
        supportsDegSummaryBar,
        isNumberDegsTitle,
        tsvKey,
        title,
        dotplotDataFromApi,
    ]);

    useEffect(() => {
        if (!rows || !rows.length) return;

        console.groupCollapsed(
            `[DynamicVolcanoPlot] debug for TSV`,
            tsvKey,
            "title:",
            title
        );
        console.log("columns:", cols);
        console.log("currentCondition:", currentCondition);
        console.log("log2fcCol:", log2fcCol);
        console.log("pvalCol:", pvalCol);
        console.log("diffexpressedCol:", diffexpressedCol);
        console.log("cellTypeCol:", cellTypeCol);
        console.log("conditionCol (group filter):", conditionCol);
        console.log("pathwayCol:", pathwayCol);
        console.log("supportsDegSummaryBar:", supportsDegSummaryBar);
        console.log("isNumberDegsTitle:", isNumberDegsTitle);
        console.log("current viewMode:", viewMode);
        console.log("dotplotDataFromApi:", dotplotDataFromApi);
        console.groupEnd();
    }, [
        rows,
        cols,
        currentCondition,
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

    const handleRelayout = (evt) => {
        const xr0 = evt["xaxis.range[0]"];
        const xr1 = evt["xaxis.range[1]"];
        const yr0 = evt["yaxis.range[0]"];
        const yr1 = evt["yaxis.range[1]"];

        if (xr0 != null && xr1 != null) setXRange([xr0, xr1]);
        if (yr0 != null && yr1 != null) setYRange([yr0, yr1]);
    };

    const VolcanoIcon = () => (
        <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="de-view-icon"
        >

            <circle cx="6" cy="16" r="1.4" />
            <circle cx="10" cy="10" r="1.4" />
            <circle cx="14" cy="14" r="1.4" />
            <circle cx="18" cy="7" r="1.4" />
            <path d="M4 20h16" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4 4v16" stroke="currentColor" strokeWidth="1.3" />
        </svg>
    );

    const TableIcon = () => (
        <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="de-view-icon"
        >
            <rect x="3" y="4" width="18" height="16" rx="1.5" ry="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M3 9h18M3 14h18" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10 4v16M16 4v16" stroke="currentColor" strokeWidth="1.3" />
        </svg>
    );

    const renderLeftHeader = () => (
        <div className="de-left-header">
            {["volcano", "table"].includes(viewMode) && (
                <div className="de-view-toggle">
                    <button
                        type="button"
                        className={`de-view-btn ${viewMode === "volcano" ? "is-active" : ""}`}
                        onClick={() => setViewMode("volcano")}
                    >
                        <span className="de-view-label">Volcano Plot</span>
                    </button>
                    <button
                        type="button"
                        className={`de-view-btn ${viewMode === "table" ? "is-active" : ""}`}
                        onClick={() => setViewMode("table")}
                    >
                        <span className="de-view-label">Top Genes Table</span>
                    </button>
                </div>
            )}

            {pvalCol && log2fcCol && viewMode !== "table" && !isDegSummaryBarplot && (
                <div className="de-thresholds-row">
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
                            onChange={(e) => setLog2fcCutoffInput(Number(e.target.value))}
                            className="de-threshold-input"
                        />
                    </label>
                </div>
            )}
        </div>
    );

    const renderRightControls = () => (
        <div className="de-right-controls">
            {cellTypeCol && (
                <label className="de-field">
                    <span className="de-field-label">Cell Type</span>
                    <select className="de-select" value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
                        {/* replace with your actual celltype options if needed */}
                        <option value="">All</option>
                    </select>
                </label>
            )}

            {/* Use your actual timepoint state/props if present */}
            {/* <label className="de-field"> ... Timepoint ... </label> */}

            {deConditions && deConditions.length > 0 && (
                <label className="de-field">
                    <span className="de-field-label">KO Strategy</span>
                    <select
                        className="de-select"
                        value={currentCondition?.condition_id || ""}
                        onChange={(e) => setSelectedConditionId(e.target.value)}
                    >
                        {deConditions.map((cond) => (
                            <option key={cond.condition_id} value={cond.condition_id}>
                                {prettyConditionLabel(cond.condition_id)}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {conditionCol && conditions.length > 0 && (
                <label className="de-field">
                    <span className="de-field-label">Group</span>
                    <select
                        className="de-select"
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
            )}

            {pathwayCol && pathways.length > 0 && (
                <label className="de-field">
                    <span className="de-field-label">Pathway</span>
                    <select
                        className="de-select"
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
            )}
        </div>
    );


    const renderTable = () => {
        const formatPadj = (v) => {
            if (v == null || v === "" || Number.isNaN(Number(v))) return "–";
            const num = Number(v);
            if (num < 1e-4) return num.toExponential(2);
            return num.toFixed(4);
        };

        const renderRow = (r, idx) => (
            <tr key={`${r.gene_id || r.symbol || idx}-${idx}`}>
                <td className="de-cell-index">{idx + 1}</td>
                <td className="de-cell-symbol">{r.symbol || "–"}</td>
                <td className="de-cell-id">{r.gene_id || "–"}</td>
                <td className="de-cell-lfc">
                    {Number.isFinite(Number(r.log2fc))
                        ? Number(r.log2fc).toFixed(2)
                        : "–"}
                </td>
                <td className="de-cell-padj">{formatPadj(r.padj)}</td>
            </tr>
        );

        const nSig =
            currentCondition?.summary?.n_significant ??
            currentCondition?.summary?.n_sig ??
            null;

        const topSource = currentCondition?.top_source || null;
        const isEffectFallback = topSource === "effect_fallback";

        const precomputedUp =
            currentCondition?.top_up_50 ||
            currentCondition?.top_up ||
            currentCondition?.top_up_genes_50 ||
            [];

        const precomputedDown =
            currentCondition?.top_down_50 ||
            currentCondition?.top_down ||
            currentCondition?.top_down_genes_50 ||
            [];

        if (precomputedUp.length || precomputedDown.length) {
            const activeIsUp = tableSide === "up";

            const rawActiveData = activeIsUp ? precomputedUp : precomputedDown;
            const totalActive = rawActiveData.length;

            const activeData = rawActiveData.filter((r) => {
                const q = tableSearch.trim().toLowerCase();
                if (!q) return true;

                return [
                    r.symbol,
                    r.gene_id,
                    r.celltype,
                    r.condition,
                ]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(q));
            });

            const labelPrefix = isEffectFallback
                ? "Top by effect size (no significant genes) • "
                : "";
            const label = activeIsUp ? `${labelPrefix}Up-regulated` : `${labelPrefix}Down-regulated`;
            const pillClass = activeIsUp ? "de-pill-up" : "de-pill-down";

            return (
                <div className="de-topgenes-single is-table-mode">
                    <div className="de-table-toolbar">
                        <div className="de-table-toolbar-left">
                            <div className="de-table-toggle">
                                <button
                                    type="button"
                                    className={`de-table-toggle-btn ${tableSide === "up" ? "is-up-active" : ""}`}
                                    onClick={() => setTableSide("up")}
                                >
                                    Up-regulated
                                </button>

                                <button
                                    type="button"
                                    className={`de-table-toggle-btn ${tableSide === "down" ? "is-down-active" : ""}`}
                                    onClick={() => setTableSide("down")}
                                >
                                    Down-regulated
                                </button>
                            </div>

                            <span className="de-topgenes-count">
  {isEffectFallback
      ? `showing ${Math.min(50, activeData.length)} fallback genes`
      : activeData.length
          ? `showing ${Math.min(50, activeData.length)} of ${totalActive}`
          : `showing 0 of ${totalActive}`}
</span>
                        </div>

                        <div className="de-table-search">
                            <input
                                type="text"
                                value={tableSearch}
                                onChange={(e) => setTableSearch(e.target.value)}
                                placeholder="Search gene symbol or ID..."
                                className="de-table-search-input"
                            />
                            <Search className="de-table-search-icon" size={18} strokeWidth={2.2} />
                        </div>
                    </div>

                    {isEffectFallback && (
                        <div className="de-fallback-note">
                            No genes passed the current significance criteria. Showing top genes ranked by effect size instead.
                        </div>
                    )}

                    {activeData.length ? (
                        <div className="de-table-scroll">
                            <table className="de-table de-table-compact">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Symbol</th>
                                    <th>Gene ID</th>
                                    <th>log₂FC</th>
                                    <th>padj</th>
                                </tr>
                                </thead>
                                <tbody>{activeData.slice(0, 50).map(renderRow)}</tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="de-empty">
                            No {activeIsUp ? "up-" : "down-"}regulated genes for this contrast.
                        </div>
                    )}
                </div>
            );
        }

        // -------- 2) Fallback: compute from TSV + thresholds ------------
        if (!rows || !rows.length || !log2fcCol || !pvalCol) {
            return (
                <div className="de-empty">
                    No DE genes table available for this TSV.
                </div>
            );
        }

        const parsed = [];
        filteredRows.forEach((r) => {
            if (!r) return;
            const lfc = Number(r[log2fcCol]);
            const p = Number(r[pvalCol]);
            if (!Number.isFinite(lfc) || !Number.isFinite(p) || p <= 0) return;

            const isSig = p <= pCutoff && Math.abs(lfc) >= log2fcCutoff;
            if (!isSig) return;

            const sym = symbolCol ? r[symbolCol] : null;
            const gid =
                r.gene_ID || r.gene_id || r.EnsemblID || r.ensembl_id || null;

            parsed.push({
                gene_id: gid || sym || null,
                symbol: sym || gid || null,
                log2fc: lfc,
                padj: p,
            });
        });

        if (!parsed.length) {
            return (
                <div className="de-empty">
                    No genes pass the current thresholds for this contrast.
                </div>
            );
        }

        const ups = parsed
            .filter((r) => r.log2fc > 0)
            .sort((a, b) => b.log2fc - a.log2fc)
            .slice(0, 50);

        const downs = parsed
            .filter((r) => r.log2fc < 0)
            .sort((a, b) => a.log2fc - b.log2fc)
            .slice(0, 50);

        const activeIsUp = tableSide === "up";
        const rawActiveData = activeIsUp ? ups : downs;
        const totalActive = rawActiveData.length;

        const activeData = rawActiveData.filter((r) => {
            const q = tableSearch.trim().toLowerCase();
            if (!q) return true;

            return [r.symbol, r.gene_id]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });

        const label = activeIsUp ? "Up-regulated" : "Down-regulated";
        const pillClass = activeIsUp ? "de-pill-up" : "de-pill-down";

        return (
            <div className="de-topgenes-single is-table-mode">
                <div className="de-table-toolbar">
                    <div className="de-table-toolbar-left">
                        <div className="de-table-toggle">
                            <button
                                type="button"
                                className={`de-table-toggle-btn ${tableSide === "up" ? "is-up-active" : ""}`}
                                onClick={() => setTableSide("up")}
                            >
                                Up-regulated
                            </button>

                            <button
                                type="button"
                                className={`de-table-toggle-btn ${tableSide === "down" ? "is-down-active" : ""}`}
                                onClick={() => setTableSide("down")}
                            >
                                Down-regulated
                            </button>
                        </div>

                        <span className="de-topgenes-count">
  {isEffectFallback
      ? `showing ${Math.min(50, activeData.length)} fallback genes`
      : activeData.length
          ? `showing ${Math.min(50, activeData.length)} of ${totalActive}`
          : `showing 0 of ${totalActive}`}
</span>
                    </div>

                    <div className="de-table-search">
                        <input
                            type="text"
                            value={tableSearch}
                            onChange={(e) => setTableSearch(e.target.value)}
                            placeholder="Search gene symbol or ID..."
                            className="de-table-search-input"
                        />
                        <Search className="de-table-search-icon" size={18} strokeWidth={2.2} />
                    </div>
                </div>

                {activeData.length ? (
                    <div className="de-table-scroll">
                        <table className="de-table de-table-compact">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>SYMBOL</th>
                                <th>CELL TYPE</th>
                                <th>LOG₂FC</th>
                                <th>PADJ</th>
                            </tr>
                            </thead>
                            <tbody>{activeData.map(renderRow)}</tbody>
                        </table>
                    </div>
                ) : (
                    <div className="de-empty">
                        No {activeIsUp ? "up-" : "down-"}regulated genes for this contrast.
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
            <PlotComponent
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
                            size: 8,
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
                            size: 8,
                            opacity: 0.9,
                            color: "#E8524A",
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
                            size: 8,
                            opacity: 0.9,
                            color: "#5B8FF9",
                        },
                        hovertemplate: "%{text}<extra></extra>",
                    },
                ]}
                layout={{
                    title: "",
                    margin: { l: 40, r: 10, t: 10, b: 40 },

                    paper_bgcolor: "rgba(0,0,0,0)",  // transparent
                    plot_bgcolor: "#fafafa",

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

    function parseDegContrastTitle(title = "", fallback = "KO") {
        const t = String(title || "").trim();
        const afterColon = t.includes(":")
            ? t.split(":").slice(1).join(":").trim()
            : t;

        if (!afterColon) {
            return {
                label: fallback,
                isComplex: false,
            };
        }

        const cleaned = afterColon
            .replace(/_number[-_ ]?degs?$/i, "")
            .replace(/number[-_ ]?degs?$/i, "")
            .replace(/_umap$/i, "")
            .trim();

        const normalised = cleaned.replace(/\s+/g, "_");

        const isComplex =
            /double[_ ]knockout/i.test(cleaned) ||
            /triple[_ ]knockout/i.test(cleaned) ||
            /\|/.test(cleaned) ||
            /^[A-Z0-9]+_[A-Z0-9]+/.test(normalised);

        if (isComplex) {
            const shortLabel = cleaned
                .replace(/_double[_ ]knockout/i, "")
                .replace(/_triple[_ ]knockout/i, "")
                .replace(/_heterozygous/i, "")
                .trim();

            return {
                label: shortLabel,
                isComplex: true,
            };
        }

        const first = cleaned.split("_")[0]?.trim();

        return {
            label: first || fallback,
            isComplex: false,
        };
    }

    const degContrast = useMemo(() => {
        return parseDegContrastTitle(title, geneName || "KO");
    }, [title, geneName]);

    const degPlotTitle = useMemo(() => {
        if (!degContrast?.label) return "";

        if (degContrast.isComplex) {
            return `${degContrast.label} vs WT`;
        }

        return `${degContrast.label} vs WT`;
    }, [degContrast]);

    const renderDegSummaryBarplot = () => {
        const UP_COLOR = "#E8524A";
        const DOWN_COLOR = "#5B8FF9";

        let categories = [];
        let upCounts = [];
        let downCounts = [];

        if (isNumberDegsTitle) {
            const summaryToUse =
                Array.isArray(deSummaryFromApi) && deSummaryFromApi.length
                    ? deSummaryFromApi
                    : summary;

            if (!deSummaryFromApi) {
                if (summaryError) {
                    console.warn("[DynamicVolcanoPlot] summary error:", summaryError);
                }
                if (summaryLoading) {
                    return <div className="de-empty">Loading DEG summary…</div>;
                }
            }

            if (!summaryToUse || summaryToUse.length === 0) {
                return (
                    <div className="de-empty">
                        No differentially expressed genes to summarise.
                    </div>
                );
            }

            categories = summaryToUse.map((s) => s.celltype);
            upCounts = summaryToUse.map((s) => s.up);
            downCounts = summaryToUse.map((s) => s.down);

            console.log("[DynamicVolcanoPlot] barplot (summary) categories:", categories);
            console.log("[DynamicVolcanoPlot] barplot (summary) upCounts:", upCounts);
            console.log("[DynamicVolcanoPlot] barplot (summary) downCounts:", downCounts);
        } else {
            if (!supportsDegSummaryBar || !rows || !rows.length) {
                return <div className="de-empty">Barplot unavailable for this TSV.</div>;
            }

            const countsByCellType = new Map();

            rows.forEach((r) => {
                if (!r) return;

                const ct = r[cellTypeCol];
                if (!ct) return;

                const lfc = Number(r[log2fcCol]);
                if (!Number.isFinite(lfc) || lfc === 0) return;

                let isDE = false;

                if (diffexpressedCol) {
                    const rawFlag = r[diffexpressedCol];
                    const flag = String(rawFlag ?? "").toLowerCase();

                    isDE =
                        !!flag &&
                        flag !== "no" &&
                        flag !== "0" &&
                        flag !== "false" &&
                        flag !== "na";
                } else if (pvalCol) {
                    const p = Number(r[pvalCol]);
                    isDE =
                        Number.isFinite(p) &&
                        p > 0 &&
                        p <= pCutoff &&
                        Math.abs(lfc) >= log2fcCutoff;
                } else {
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

            categories = Array.from(countsByCellType.keys());
            upCounts = categories.map((k) => countsByCellType.get(k).up);
            downCounts = categories.map((k) => countsByCellType.get(k).down);

            console.log("[DynamicVolcanoPlot] barplot (rows) categories:", categories);
            console.log("[DynamicVolcanoPlot] barplot (rows) upCounts:", upCounts);
            console.log("[DynamicVolcanoPlot] barplot (rows) downCounts:", downCounts);
        }

        return (
            <div className="de-barplot-wrap">
                <PlotComponent
                    ref={plotRef}
                    data={[
                        {
                            x: categories,
                            y: upCounts,
                            name: "Up",
                            type: "bar",
                            marker: { color: UP_COLOR },
                            hovertemplate:
                                "Cell type: %{x}<br>Up-regulated in KO vs WT: %{y}<extra></extra>",
                        },
                        {
                            x: categories,
                            y: downCounts,
                            name: "Down",
                            type: "bar",
                            marker: { color: DOWN_COLOR },
                            hovertemplate:
                                "Cell type: %{x}<br>Down-regulated in KO vs WT: %{y}<extra></extra>",
                        },
                    ]}
                    layout={{
                        title: {
                            text: degPlotTitle,
                            x: 0.5,
                            xanchor: "center",
                            font: { size: 20 },
                        },
                        barmode: "group",

                        /* tighter margins -> more vertical plotting area */
                        margin: { l: 70, r: 20, t: 45, b: 80 },

                        xaxis: {
                            title: "",
                            tickangle: -30,
                            tickfont: { size: 12 },
                        },
                        yaxis: {
                            title: {
                                text: "Number of DEGs",
                                font: { size: 14 },
                            },
                            rangemode: "tozero",
                            gridcolor: "rgba(0,0,0,0.08)",
                        },
                        showlegend: true,
                        legend: {
                            title: { text: "Regulation" },
                            x: 1.02,
                            xanchor: "left",
                            y: 0.98,
                            yanchor: "top",
                            bgcolor: "rgba(255,255,255,0.7)",
                            bordercolor: "rgba(0,0,0,0.1)",
                            borderwidth: 1,
                            font: { size: 12 },
                        },

                        paper_bgcolor: "rgba(0,0,0,0)",
                        plot_bgcolor: "#fafafa",

                        height: undefined,   // IMPORTANT → let container control height
                        hovermode: "closest",
                    }}
                    config={{
                        responsive: true,
                        displayModeBar: "hover",
                        scrollZoom: false,
                    }}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
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

        const heatmapHeight = 240;

        return (
            <PlotComponent
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
                    height: heatmapHeight,
                    hovermode: "closest",
                    uirevision: "volcano-axes",
                    transition: { duration: 0 },
                }}
                config={{
                    responsive: true,
                    displayModeBar: "hover",
                    scrollZoom: true,
                }}
                style={{ width: "100%", height: heatmapHeight }}
                onRelayout={handleRelayout}
            />
        );
    };

    const RDBU_JSON_SCALE = [
        [0.0, "#4575B4"],
        [0.1667, "#6D8EC3"],
        [0.3333, "#9FB1D6"],
        [0.5, "#E0E5F2"],
        [0.6667, "#F4A28E"],
        [0.8333, "#D8564A"],
        [1.0, "#D73027"],
    ];

    const renderTopDegDotplot = () => {
        if (!isTopDegDotplot) return null;

        const points = rawDotplotPoints || [];

        if (!points.length) {
            return <div className="de-empty">No dotplot data available.</div>;
        }

        const xCats = Array.from(new Set(points.map((p) => p.celltype)));
        const yCats = Array.from(new Set(points.map((p) => p.gene)));

        const x = points.map((p) => xCats.indexOf(p.celltype) + 1);
        const y = points.map((p) => yCats.indexOf(p.gene) + 1);

        const log2fc = points.map((p) => Number(p.log2fc));
        const padj = points.map((p) => Number(p.padj));

        const neglog = padj.map((v) => -Math.log10(v));
        const MIN_S = 7,
            MAX_S = 30;

        const minN = Math.min(...neglog);
        const maxN = Math.max(...neglog);
        const denom = maxN - minN || 1;

        const sizes = neglog.map(
            (v) => MIN_S + ((v - minN) / denom) * (MAX_S - MIN_S)
        );

        const maxAbsLFC = Math.max(...log2fc.map((v) => Math.abs(v))) || 1;

        const text = points.map(
            (p, i) =>
                `celltype: ${p.celltype}` +
                `<br>gene: ${p.gene}` +
                `<br>-log10(padj): ${neglog[i].toFixed(2)}` +
                `<br>log2FC: ${p.log2fc.toFixed(2)}`
        );

        const dotplotHeight = Math.max(200, yCats.length * 18);

        return (
            <PlotComponent
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
                                len: 0.5,
                            },
                            line: { width: 0.5, color: "rgba(0,0,0,0.3)" },
                        },
                    },
                ]}
                layout={{
                    height: dotplotHeight,
                    margin: { t: 0, r: 20, b: 40, l: 70 },
                    hovermode: "closest",
                    xaxis: {
                        tickmode: "array",
                        tickvals: xCats.map((_, i) => i + 1),
                        ticktext: xCats,
                        tickangle: -45,
                    },
                    yaxis: {
                        tickmode: "array",
                        tickvals: yCats.map((_, i) => i + 1),
                        ticktext: yCats,
                    },
                }}
                config={{
                    responsive: true,
                    displaylogo: false,
                    scrollZoom: false,
                }}
                style={{ width: "100%", height: dotplotHeight }}
            />
        );
    };

    if (!tsvKey) return null;

    if (!PlotComponent) {
        return (
            <div className="de-panel">
                <div className="de-loading">Loading interactive plot…</div>
            </div>
        );
    }

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
            <div
                className={`de-two-col ${
                    viewMode === "table" || isDegSummaryBarplot ? "is-table-mode" : ""
                }`}
            >
                <div
                    className={`de-left ${
                        viewMode === "table" || isDegSummaryBarplot ? "is-table-mode" : ""
                    }`}
                >
                    {renderLeftHeader()}

                    <div
                        className={`de-visualisation ${
                            viewMode === "table" || isDegSummaryBarplot ? "is-table-mode" : ""
                        }`}
                    >
                        {viewMode === "volcano" && renderVolcano()}
                        {viewMode === "bar" && renderDegSummaryBarplot()}
                        {viewMode === "table" && renderTable()}
                        {viewMode === "heatmap" && renderHeatmap()}
                        {viewMode === "dotplot" && renderTopDegDotplot()}
                    </div>
                </div>

                {!isDegSummaryBarplot && viewMode !== "table" && renderRightControls()}
            </div>
        </div>
    );
};

export default DynamicVolcanoPlot;
