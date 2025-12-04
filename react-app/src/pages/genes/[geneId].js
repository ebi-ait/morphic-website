import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GenePhenotypeEvidence from "../../components/GenePhenotypeEvidence";
import MousePhenotype from "../../components/MousePhenotype";
import DynamicVolcanoPlot from "../../components/DynamicVolcanoPlot";
import DynamicEnrichmentPlot from "../../components/DynamicEnrichmentPlot";
import GeneDePanel from "../../components/GeneDePanel";

const API_BASE = process.env.GATSBY_INGEST_API ?? "https://api.ingest.archive.morphic.bio";

// helper to make labels more user-friendly
const formatLabel = (label) => label?.replaceAll("_", " ") ?? label;

// helper: format adjusted p-values nicely
const formatPadj = (p) => {
  if (p === null || p === undefined || Number.isNaN(p)) return "NA";
  if (p === 0) return "0";
  const abs = Math.abs(p);
  if (abs < 1e-4) return p.toExponential(1);
  if (abs < 1e-3) return p.toExponential(2);
  return p.toFixed(3);
};

// helper: pick a sensible label for a DE gene row
const geneLabel = (g) =>
  g?.symbol && g.symbol !== "" ? g.symbol : g?.gene_id?.split(".")[0] || "—";

// --- helpers: collect studies from both arrays and de-dupe by id (or label) ---
const collectStudies = (arr = []) =>
  (arr || [])
    .map(a => ({
      label: formatLabel(a?.study_label?.trim()) || null,
      id: a?.study_id || null,
    }))
    .filter(s => s.label);

const uniqueStudiesFromGene = (gene) => {
  const seen = new Set();
  const unique = [];
  const all = [
    ...collectStudies(gene?.Analysis_Results),
    ...collectStudies(gene?.Enrichment_Analysis),
  ];
  for (const s of all) {
    const key = s.id || s.label; // prefer id, fallback to label
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(s);
  }
  return unique;
};

// --- build chips describing experiment context ---
const buildExperimentChips = (analysis, geneName, labelToStudyMeta) => {
  const chips = [];
  const title = analysis?.title || "";
  const lowerTitle = title.toLowerCase();

  const studyLabel = analysis?.study_label?.trim();
  const meta = studyLabel ? labelToStudyMeta[studyLabel] : undefined;

  // 1. assay type (from study metadata)
  if (meta?.assay) {
    chips.push({ label: meta.assay, kind: "assay" });
  }

  // 2. DPC / profiling centre
  if (meta?.dpc) {
    chips.push({ label: meta.dpc, kind: "dpc" });
  }

  // 3. timepoint(s) from title: “day 9”, “day 7”, etc.
  const dayMatch = title.match(/day\s+\d+/i);
  if (dayMatch) {
    chips.push({ label: dayMatch[0], kind: "time" });
  }

  // 4. timepoint-like codes (D3, D18, D-1) if they appear in title
  const tpMatches = title.match(/\bD-?\d+\b/g);
  if (tpMatches) {
    tpMatches.forEach(tp => chips.push({ label: tp, kind: "time" }));
  }

  // 5. perturbation type from title
  if (lowerTitle.includes("revert")) {
    chips.push({ label: "KO reverted", kind: "perturbation" });
  } else if (lowerTitle.includes("ko")) {
    chips.push({ label: "KO", kind: "perturbation" });
  }

  if (lowerTitle.includes("ptc")) {
    chips.push({ label: "PTC", kind: "perturbation" });
  }
  if (lowerTitle.includes("crispri")) {
    chips.push({ label: "CRISPRi", kind: "perturbation" });
  }

  // 6. model / system hints from title
  const modelTokens = [
    "cbo",
    "neuroectoderm",
    "reversion",
    "pooled scrna-seq",
    "trophoblast",
    "extraembryonic",
    "extra-embryonic"
  ];
  modelTokens.forEach(tok => {
    if (lowerTitle.includes(tok)) {
      const idx = lowerTitle.indexOf(tok);
      if (idx >= 0) {
        const frag = title.substr(idx, tok.length);
        chips.push({ label: frag, kind: "model" });
      }
    }
  });

  // 7. Generic “perturbed gene” chip
  if (geneName) {
    chips.push({ label: `${geneName} perturbed`, kind: "gene" });
  }

  // De-duplicate by label
  const seen = new Set();
  const deduped = [];
  for (const c of chips) {
    if (seen.has(c.label)) continue;
    seen.add(c.label);
    deduped.push(c);
  }

  return deduped;
};

const GenePage = ({ params }) => {
  const { geneId } = params;

  const [geneData, setGeneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map study_label -> study id / meta
  const [labelToStudyId, setLabelToStudyId] = useState({});
  const [labelToStudyMeta, setLabelToStudyMeta] = useState({});

  useEffect(() => {
    if (!geneId) return;

    (async () => {
      try {
        // Fetch gene details from local API
        const response = await fetch(
          `http://localhost:3000/api/gene/${encodeURIComponent(geneId)}`
        );
        if (!response.ok) throw new Error('Failed to fetch gene data');
        const data = await response.json();
        setGeneData(data);

        // Build label -> id/meta map from PUBLIC studies (from ingest API)
        try {
          const studiesRes = await fetch(
            `${API_BASE}/studies/search/findByReleaseStatus?releaseStatus=PUBLIC&page=0&size=500`
          );
          if (studiesRes.ok) {
            const studiesJson = await studiesRes.json();
            const list = studiesJson?._embedded?.studies ?? [];

            const idMap = {};
            const metaMap = {};

            for (const s of list) {
              const label = s?.content?.label?.trim();
              const id = s?.id;
              if (!label || !id) continue;

              idMap[label] = id;
              metaMap[label] = {
                id,
                dpc: s?.content?.institute ?? null,       // DPC / profiling centre
                assay: s?.content?.readout_assay ?? null, // assay type (e.g. RNA-seq)
              };
            }

            setLabelToStudyId(idMap);
            setLabelToStudyMeta(metaMap);
          } else {
            console.warn("Could not fetch studies to build label→meta map");
          }
        } catch (e) {
          console.warn("Failed to build study label → meta map", e);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [geneId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!geneData) return <p>No data found for gene {geneId}</p>;

  // Unique studies (from Analysis_Results + Enrichment_Analysis)
  const uniqueStudies = uniqueStudiesFromGene(geneData);
  const analysisResults = geneData.Analysis_Results || [];

  // Experiments with de_summary
  const experimentsWithSummary = analysisResults.filter(
    (ar) => ar.de_summary && typeof ar.de_summary === "object"
  );

  const numberOfExperiments = experimentsWithSummary.length;
  const numberOfStudies = uniqueStudies.length;

  const totalSignificant = experimentsWithSummary.reduce(
    (sum, ar) => sum + (ar.de_summary?.n_significant || 0),
    0
  );

  const totalUp = experimentsWithSummary.reduce(
    (sum, ar) => sum + (ar.de_summary?.n_up || 0),
    0
  );

  const totalDown = experimentsWithSummary.reduce(
    (sum, ar) => sum + (ar.de_summary?.n_down || 0),
    0
  );

  // Representative affected genes: Top 5 strongest by |log2FC|
  const representativeGenes = (() => {
    const geneMap = new Map(); // symbol -> { symbol, absLfc }

    experimentsWithSummary.forEach((ar) => {
      const s = ar.de_summary || {};
      const candidates = [
        ...(s.top_up || []),
        ...(s.top_down || []),
      ];

      candidates.forEach((g) => {
        const sym = g.symbol || g.gene_id;
        if (!sym || typeof g.log2fc !== "number") return;

        const absLfc = Math.abs(g.log2fc);
        const existing = geneMap.get(sym);

        if (!existing || absLfc > existing.absLfc) {
          geneMap.set(sym, { symbol: sym, absLfc });
        }
      });
    });

    return Array.from(geneMap.values())
      .sort((a, b) => b.absLfc - a.absLfc)
      .slice(0, 5)
      .map((g) => g.symbol);
  })();

  const affectedGenesText = representativeGenes.length
    ? representativeGenes.join(", ")
    : null;

  const datasetHrefForStudy = (study) => {
    // Send users to the Data page, preselecting/highlighting by label
    return study?.label ? `/data?label=${encodeURIComponent(study.label)}` : "/data";
  };

  return (
    <div className="about gene-page">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>

      <div className="gene-container">
        <div className="gene-menu">
          <div className="gene-menu-card">
            <h1 className="gene-menu-title">gene: {geneData.Name}</h1>
            <ul>
              <li>
                <a href="#" className="gene-menu-link gene-active">Overview</a>
              </li>
              {geneData.tags &&
                Array.isArray(geneData.tags) &&
                geneData.tags.includes('release-1') &&
                geneData.Analysis_Results?.[0] && (
                  <li>
                    <a href="#results" className="gene-menu-link">Analysis Results</a>
                  </li>
                )}
            </ul>
          </div>
        </div>

        <div className="gene-content">
          {/* --- Overview + MorPhiC summary --- */}
          <section>
            <div className="gene-card">
              <div className="gene-card-header gene-card-border-bottom">
                <div className="gene-card-header-row">
                  <span className="icon-radio-open"></span>
                  <h1>Gene: {geneData.Name}</h1>
                </div>
              </div>
              <div className="gene-card-row gene-card-border-bottom">
                <div className="gene-card-body">
                  <div className="gene-card-body-row">
                    <p className="gene-card-body-bold-text">
                      HGNC ID:{geneData.HGNC_ID.split(':')[1]}
                    </p>
                    <p className="gene-card-body-bold-text">
                      {geneData.Ensembl_Gene_ID}
                    </p>
                  </div>
                  <dl className="gene-card-body-dl-grid">
                    <dt>{geneData.Name}</dt>
                    <dd>{geneData.Full_Name}</dd>
                    <dt>Protein class</dt>
                    <dd>{geneData.Protein_Class}</dd>
                  </dl>
                </div>

                {/* MorPhiC summary */}
                <div className="gene-card-body gene-card-summary">
                  <h2 className="gene-card-summary-title">MorPhiC summary</h2>

                  {geneData.Analysis_Results &&
                  geneData.Analysis_Results.length > 0 ? (
                    (() => {
                      const analysisResults = geneData.Analysis_Results || [];

                      // Collect all study labels used for this gene
                      const studyLabels = analysisResults
                        .map(r => r.study_label?.trim())
                        .filter(Boolean);

                      // Derive DPCs & Assay types from study metadata
                      const dpcSet = new Set();
                      const assaySet = new Set();

                      studyLabels.forEach(label => {
                        const meta = labelToStudyMeta[label];
                        if (meta?.dpc) dpcSet.add(meta.dpc);
                        if (meta?.assay) assaySet.add(meta.assay);
                      });

                      const profiledByText = dpcSet.size
                        ? Array.from(dpcSet).join(", ")
                        : "Unknown";

                      const assayTypesText = assaySet.size
                        ? Array.from(assaySet).join(", ")
                        : "Unknown";

                      // DAVs / analysis centres – placeholder until you have explicit metadata
                      const davSet = new Set();
                      analysisResults.forEach(ar => {
                        if (ar.analysis_center) davSet.add(ar.analysis_center);
                      });
                      const analysisText = davSet.size
                        ? Array.from(davSet).join(", ")
                        : "Not annotated";

                      // Status: ASSAYED vs ASSAYED, ANALYSED
                      const hasAnySummary = analysisResults.some(ar => ar.de_summary);
                      const statusText = hasAnySummary ? "ASSAYED, ANALYSED" : "ASSAYED";

                      return (
                        <dl className="gene-card-body-dl-grid">
                          <dt>Studied by MorPhiC</dt>
                          <dd>YES</dd>

                          <dt>Profiled by</dt>
                          <dd>{profiledByText}</dd>

                          <dt>Assay types</dt>
                          <dd>{assayTypesText}</dd>

                          <dt>Analysis</dt>
                          <dd>{analysisText}</dd>

                          <dt>Status</dt>
                          <dd>{statusText}</dd>

                          {numberOfExperiments > 0 && (
                            <>
                              <dt>Studies</dt>
                              <dd>{numberOfStudies}</dd>

                              <dt>Significant affected genes</dt>
                              <dd>
                                {totalSignificant.toLocaleString()} total (
                                {totalUp.toLocaleString()} ↑ /{" "}
                                {totalDown.toLocaleString()} ↓)
                              </dd>

                              {affectedGenesText && (
                                <>
                                  <dt>Representative affected genes |log₂FC|</dt>
                                  <dd>{affectedGenesText}</dd>
                                </>
                              )}
                            </>
                          )}
                        </dl>
                      );
                    })()
                  ) : (
                    <dl className="gene-card-body-dl-grid no-data">
                      <dt className="no-data">
                        Currently no MorPhiC results are available for this Gene
                      </dt>
                    </dl>
                  )}
                </div>
              </div>

              {/* Phenotype evidence */}
              <div className="gene-card-body">
                <div>
                  <h2 className="gene-card-body-title">Phenotype evidence</h2>
                  <div className="gene-card-row-gap">
                    <div className="gene-card-phenotype-data">
                      <h3 className="gene-card-body-subtitle">Human</h3>
                      <p className="bold">OMIM Phenotypes:</p>
                      <GenePhenotypeEvidence geneData={geneData} />
                    </div>
                    <div className="gene-card-phenotype-data">
                      <h3>Mouse</h3>
                      <div className="gene-card-body-row">
                        <p>
                          Ortholog relation:{" "}
                          {geneData?.Phenotype_Evidence?.Mouse?.MGI_ID || "N/A"}
                        </p>
                      </div>
                      <MousePhenotype mouseData={geneData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- Analysis Results --- */}
          {geneData.tags &&
            Array.isArray(geneData.tags) &&
            geneData.tags.includes('release-1') &&
            geneData.Analysis_Results?.[0] && (
              <section id="results">
                <div className="gene-section-header">
                  <h1 className="gene-section-title">Analysis Results</h1>
                  <a href="#" className="gene-section-link">
                    ↑&nbsp;Back to top
                  </a>
                </div>

                <div className="gene-card">
                  <div className="gene-card-header">
                    <h2>Gene expression analysis</h2>
                  </div>

                  <div className="gene-card-body">
                    <div className="gene-grid">
                      {geneData.Analysis_Results.map((analysis, index) => {
                        const isCanonicalDe =
                          analysis.result_type === 'DE' &&
                          analysis.role === 'canonical_de' &&
                          !!analysis.s3_tsv_key;

                        const prefersDegSummaryBar =
                          /number[-_ ]?degs?/i.test(analysis.title || "") ||
                          /#\s*degs?/i.test(analysis.title || "");

                        const isTopDegDotplotAnalysis =
                          !!analysis.s3_tsv_key &&
                          (
                            /topdeg[-_ ]?dotplot/i.test(analysis.title || "") ||
                            /topdeg[-_ ]?dotplot/i.test(analysis.s3_tsv_key || "")
                          );

                        const showDynamicDe =
                          !!analysis.s3_tsv_key &&
                          (isCanonicalDe || prefersDegSummaryBar || isTopDegDotplotAnalysis);

                        const dotplotDataFromApi =
                          isTopDegDotplotAnalysis && analysis.dotplot_data
                            ? analysis.dotplot_data
                            : null;

                        const chips = buildExperimentChips(
                          analysis,
                          geneData.Name,
                          labelToStudyMeta
                        );

                        const studyLabel = analysis.study_label?.trim();
                        const studyMeta  = studyLabel ? labelToStudyMeta[studyLabel] : undefined;

                        return (
                          <div className="gene-card-img-placeholder" key={index}>
                            {/* context chips row */}
                            {(studyLabel || chips.length > 0) && (
                              <div className="experiment-chips">
                                {/* Study chip first, clickable */}
                                {studyLabel && (
                                  <a
                                    className="experiment-chip experiment-chip-study"
                                    href="/data"
                                    title={studyMeta?.assay || "View study dataset"}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      style={{ marginRight: "4px" }}
                                    >
                                      <path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                                      <path d="M3 7l9-4 9 4" />
                                      <path d="M12 3v18" />
                                    </svg>
                                    {studyLabel}
                                  </a>
                                )}

                                {/* remaining context chips */}
                                {chips.map((chip, i) => (
                                  <span
                                    key={`${chip.label}-${i}`}
                                    className={`experiment-chip experiment-chip-${chip.kind}`}
                                  >
        {chip.label}
      </span>
                                ))}
                              </div>
                            )}

                            {/* DE summary badge + expandable details */}
                            {analysis.de_summary?.n_significant > 0 && (
                              <div className="de-wrapper">
                                {/* Badge (collapsed preview) */}
                                <div
                                  className="de-badge"
                                  onClick={() =>
                                    setGeneData((prev) => ({
                                      ...prev,
                                      Analysis_Results: prev.Analysis_Results.map((a, i2) =>
                                        i2 === index
                                          ? { ...a, _expanded: !a._expanded }
                                          : a
                                      ),
                                    }))
                                  }
                                >
                                  <div className="de-badge-line">
                                    Affects{" "}
                                    <strong>
                                      {analysis.de_summary.n_significant}
                                    </strong>{" "}
                                    genes
                                  </div>

                                  <div className="de-badge-counts">
                                    <span className="mini-up">
                                      ↑ {analysis.de_summary.n_up}
                                    </span>
                                    <span className="mini-down">
                                      ↓ {analysis.de_summary.n_down}
                                    </span>
                                  </div>

                                  <div className="de-badge-arrow">
                                    {analysis._expanded ? "▾" : "▸"}
                                  </div>
                                </div>

                                {/* Expanded block (full details) */}
                                {analysis._expanded && (
                                  <div className="de-summary-panel">
                                    <div className="de-summary-metrics">
                                      <div className="de-metric">
                                        <div className="de-metric-label">
                                          Significant
                                        </div>
                                        <div className="de-metric-value">
                                          {analysis.de_summary.n_significant.toLocaleString()}
                                        </div>
                                      </div>

                                      <div className="de-metric">
                                        <div className="de-metric-label">
                                          Median |LFC|
                                        </div>
                                        <div className="de-metric-value">
                                          {analysis.de_summary.median_abs_log2fc.toFixed(
                                            2
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="de-summary-separator" />

                                    <div className="de-summary-top-lists">
                                      <div className="de-summary-column">
                                        <div className="de-summary-title up">
                                          Top ↑
                                        </div>
                                        <ul className="de-summary-list">
                                          {analysis.de_summary.top_up?.map(
                                            (g, i) => (
                                              <li
                                                key={i}
                                                className="de-summary-item"
                                              >
                                                <span className="de-summary-main">
                                                  <span className="gene-symbol">
                                                    {geneLabel(g)}
                                                  </span>
                                                  <span className="de-summary-arrow up">
                                                    ↑
                                                  </span>
                                                  <span className="de-summary-lfc">
                                                    {g.log2fc.toFixed(2)}
                                                  </span>
                                                </span>
                                                <span className="de-summary-meta">
                                                  (padj {formatPadj(g.padj)})
                                                </span>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>

                                      <div className="de-summary-column">
                                        <div className="de-summary-title down">
                                          Top ↓
                                        </div>
                                        <ul className="de-summary-list">
                                          {analysis.de_summary.top_down?.map(
                                            (g, i) => (
                                              <li
                                                key={i}
                                                className="de-summary-item"
                                              >
                                                <span className="de-summary-main">
                                                  <span className="gene-symbol">
                                                    {geneLabel(g)}
                                                  </span>
                                                  <span className="de-summary-arrow down">
                                                    ↓
                                                  </span>
                                                  <span className="de-summary-lfc">
                                                    {g.log2fc.toFixed(2)}
                                                  </span>
                                                </span>
                                                <span className="de-summary-meta">
                                                  (padj {formatPadj(g.padj)})
                                                </span>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="plot-frame">
                              {showDynamicDe ? (
                                // 🔹 Canonical DE → interactive volcano only
                                <DynamicVolcanoPlot
                                  tsvKey={analysis.s3_tsv_key}
                                  title={analysis.title}
                                  preferDegSummaryBar={prefersDegSummaryBar}
                                  dotplotDataFromApi={dotplotDataFromApi}
                                />
                              ) : analysis.svg ? (
                                <img
                                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                                    analysis.svg
                                  )}`}
                                  className="img-plot"
                                  alt={analysis.title}
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : analysis.s3_png_key ? (
                                <img
                                  src={`http://localhost:3000/download/png?file_id=${encodeURIComponent(
                                    analysis.s3_png_key
                                  )}`}
                                  className="img-plot"
                                  alt={analysis.title}
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <p>No image available</p>
                              )}
                            </div>

                            <div className="title-button-container">
                              <div className="svg-title">{analysis.title}</div>

                              {analysis?.s3_tsv_key && (
                                <div className="gene-card-header-link download-tsv">
                                  <a
                                    href={`http://localhost:3000/download?tsv_file_id=${encodeURIComponent(
                                      analysis.s3_tsv_key
                                    )}&file_name=${encodeURIComponent(
                                      analysis.title ||
                                      geneData.Name ||
                                      'download'
                                    )}`}
                                  >
                                    Download TSV
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Data resources: show study labels; link via study_id or fallback label map */}
                  <div className="gene-card-body">
                    <h3>Data resources</h3>
                    <div className="gene-card-row">
                      <div className="gene-card-group">
                        {uniqueStudies.map((study, index) => (
                          <div key={index} className="title-group">
                            <div className="gene-card-icon"></div>
                            <div className="column-layout">
                              <h4>{study.label}</h4>
                              <div className="gene-card-group-link">
                                <a href={datasetHrefForStudy(study)}>View dataset</a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            )}

          {/* --- Enrichment Analysis --- */}
          {geneData.tags &&
            Array.isArray(geneData.tags) &&
            geneData.tags.includes('release-1') &&
            geneData.Enrichment_Analysis?.[0] && (
              <section id="enrichment">
                <div className="gene-card">
                  <div className="gene-card-header">
                    <h2>Enrichment Analysis</h2>
                  </div>

                  <div className="gene-card-body">
                    <div className="gene-grid">
                      {geneData.Enrichment_Analysis.map((analysis, index) => (
                        <div className="gene-card-img-placeholder" key={index}>
                          <div className="svg-title">{analysis.title}</div>

                          <div className="plot-frame">
                            {analysis.s3_tsv_key ? (
                              <DynamicEnrichmentPlot analysis={analysis} />
                            ) : analysis.svg ? (
                              <img
                                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                                  analysis.svg
                                )}`}
                                className="img-plot"
                                alt={analysis.title}
                              />
                            ) : analysis.s3_png_key ? (
                              <img
                                src={`http://localhost:3000/download/png?file_id=${encodeURIComponent(
                                  analysis.s3_png_key
                                )}`}
                                className="img-plot"
                                alt={analysis.title}
                              />
                            ) : (
                              <p>No image available</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data resources: same uniqueStudies list */}
                  <div className="gene-card-body">
                    <h3>Data resources</h3>
                    <div className="gene-card-row">
                      <div className="gene-card-group">
                        {uniqueStudies.map((study, index) => (
                          <div key={index} className="title-group">
                            <div className="gene-card-icon"></div>
                            <div className="column-layout">
                              <h4>{study.label}</h4>
                              <div className="gene-card-group-link">
                                <a href={datasetHrefForStudy(study)}>View dataset</a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            )}

          <Footer />
        </div>
      </div>
    </div>
  );
};

export function Head() {
  return (
    <>
      <title>MorPhiC program: Molecular Phenotypes of Null Alleles in Cells</title>
      <link id="icon" rel="icon" href="/favicon.svg" />
    </>
  );
}

export default GenePage;
