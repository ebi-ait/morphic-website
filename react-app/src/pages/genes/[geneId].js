import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GenePhenotypeEvidence from "../../components/GenePhenotypeEvidence";
import MousePhenotype from "../../components/MousePhenotype";
import DynamicVolcanoPlot from "../../components/DynamicVolcanoPlot";
import DynamicEnrichmentPlot from "../../components/DynamicEnrichmentPlot";
import DynamicUmapPlot from "../../components/DynamicUmapPlot";

const API_BASE = process.env.GATSBY_INGEST_API ?? "https://api.ingest.archive.morphic.bio";
const GENE_API_BASE =
  process.env.GATSBY_GENE_API ??
  "https://46ucfedadd.execute-api.us-east-1.amazonaws.com";

const formatLabel = (label) => label?.replaceAll("_", " ") ?? label;

const formatPadj = (p) => {
  if (p === null || p === undefined || Number.isNaN(p)) return "NA";
  if (p === 0) return "0";
  const abs = Math.abs(p);
  if (abs < 1e-4) return p.toExponential(1);
  if (abs < 1e-3) return p.toExponential(2);
  return p.toFixed(3);
};

const geneLabel = (g) =>
    g?.symbol && g.symbol !== "" ? g.symbol : g?.gene_id?.split(".")[0] || "—";

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
    const key = s.id || s.label;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(s);
  }
  return unique;
};

const pushJoinedChip = (chips, arr, kind) => {
  if (Array.isArray(arr) && arr.length > 0) {
    chips.push({
      label: arr.join(" • "),
      kind,
    });
  }
};

const buildExperimentChips = (analysis, geneName, labelToStudyMeta) => {
  const chips = [];

  const studyLabel = analysis?.study_label?.trim();
  if (!studyLabel) return chips;

  const meta = labelToStudyMeta[studyLabel];
  if (!meta) return chips;

  if (meta.assay) {
    chips.push({ label: meta.assay, kind: "assay" });
  }

  if (meta.dpc) {
    chips.push({ label: meta.dpc, kind: "dpc" });
  }

  pushJoinedChip(chips, meta.modelSystems, "model");
  pushJoinedChip(chips, meta.cellLines, "model");
  pushJoinedChip(chips, meta.sampleTypes, "sample");
  pushJoinedChip(chips, meta.perturbationTypes, "perturbation");

  if (
      geneName &&
      Array.isArray(meta.targetGenes) &&
      meta.targetGenes.includes(geneName)
  ) {
    chips.push({
      label: `${geneName} target`,
      kind: "gene",
    });
  }

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

  const [labelToStudyId, setLabelToStudyId] = useState({});
  const [labelToStudyMeta, setLabelToStudyMeta] = useState({});

  useEffect(() => {
    if (!geneId) return;

    (async () => {
      try {
        const response = await fetch(
            `${GENE_API_BASE}/api/gene/${encodeURIComponent(geneId)}`
        );
        if (!response.ok) throw new Error('Failed to fetch gene data');
        const data = await response.json();
        setGeneData(data);

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

                dpc: s?.content?.institute ?? null,
                assay: s?.content?.readout_assay ?? null,

                modelSystems: Array.isArray(s?.content?.model_organ_systems)
                    ? s.content.model_organ_systems
                    : [],

                cellLines: Array.isArray(s?.content?.cell_line_names)
                    ? s.content.cell_line_names
                    : [],

                sampleTypes: Array.isArray(s?.content?.biological_sample_types)
                    ? s.content.biological_sample_types
                    : [],

                perturbationTypes: Array.isArray(s?.content?.perturbation_type)
                    ? s.content.perturbation_type
                    : [],

                targetGenes: Array.isArray(s?.content?.target_genes)
                    ? s.content.target_genes
                    : [],

                studyTitle: s?.content?.study_title ?? null,
                studyDescription: s?.content?.study_description ?? null,

                accessions: Array.isArray(s?.accessions) ? s.accessions : [],
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

  const isPrototypeGene = geneData?.HGNC_ID === "HGNC:8620";
  const uniqueStudies = uniqueStudiesFromGene(geneData);
  const analysisResults = geneData.Analysis_Results || [];

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

  const representativeGenes = (() => {
    const geneMap = new Map();

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

                          const studyLabels = analysisResults
                              .map(r => r.study_label?.trim())
                              .filter(Boolean);

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

                          const davSet = new Set();
                          analysisResults.forEach(ar => {
                            if (ar.analysis_center) davSet.add(ar.analysis_center);
                          });
                          const analysisText = davSet.size
                              ? Array.from(davSet).join(", ")
                              : "Not annotated";

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
                                  analysis.result_type === "DE" &&
                                  analysis.role === "canonical_de" &&
                                  !!analysis.s3_tsv_key;

                              const prefersDegSummaryBar =
                                  /number[-_ ]?degs?/i.test(analysis.title || "") ||
                                  /#\s*degs?/i.test(analysis.title || "");

                              const isTopDegDotplotAnalysis =
                                  !!analysis.s3_tsv_key &&
                                  (/topdeg[-_ ]?dotplot/i.test(analysis.title || "") ||
                                      /topdeg[-_ ]?dotplot/i.test(analysis.s3_tsv_key || ""));

                              const showDynamicDe =
                                isPrototypeGene &&               // <-- only for HGNC:8620
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
                              const studyMeta = studyLabel
                                  ? labelToStudyMeta[studyLabel]
                                  : undefined;

                              const isUmap =
                                /umap/i.test(analysis.title) ||
                                /_umap/i.test(analysis.s3_png_key || "");

                              return (
                                  <div className="gene-card-img-placeholder" key={index}>
                                    <div className="de-analysis-header">
                                      {(studyLabel || chips.length > 0) && (
                                          <div className="experiment-chips">
                                            {studyLabel && (() => {
                                              const displayLabel = formatLabel(studyLabel);
                                              return (
                                                  <a
                                                      className="experiment-chip experiment-chip-study"
                                                      href={`/data?label=${encodeURIComponent(displayLabel)}`}
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
                                                    {displayLabel}
                                                  </a>
                                              );
                                            })()}

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

                                    </div>

                                    {analysis.de_summary?.n_significant > 0 && (
                                        <div className="de-wrapper">
                                          <div
                                              className="de-badge"
                                              onClick={() =>
                                                  setGeneData((prev) => ({
                                                    ...prev,
                                                    Analysis_Results: prev.Analysis_Results.map((a, i2) =>
                                                        i2 === index ? { ...a, _expanded: !a._expanded } : a
                                                    ),
                                                  }))
                                              }
                                          >
                                            <div className="de-badge-line">
                                              Affects{" "}
                                              <strong>{analysis.de_summary.n_significant}</strong>{" "}
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
                                                    <div className="de-metric-label">Significant</div>
                                                    <div className="de-metric-value">
                                                      {analysis.de_summary.n_significant.toLocaleString()}
                                                    </div>
                                                  </div>

                                                  <div className="de-metric">
                                                    <div className="de-metric-label">
                                                      Median |LFC|
                                                    </div>
                                                    <div className="de-metric-value">
                                                      {analysis.de_summary.median_abs_log2fc.toFixed(2)}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="de-summary-separator" />

                                                <div className="de-summary-top-lists">
                                                  <div className="de-summary-column">
                                                    <div className="de-summary-title up">Top ↑</div>
                                                    <ul className="de-summary-list">
                                                      {analysis.de_summary.top_up?.map((g, i) => (
                                                          <li key={i} className="de-summary-item">
                          <span className="de-summary-main">
                            <span className="gene-symbol">
                              {geneLabel(g)}
                            </span>
                            <span className="de-summary-arrow up">↑</span>
                            <span className="de-summary-lfc">
                              {g.log2fc.toFixed(2)}
                            </span>
                          </span>
                                                            <span className="de-summary-meta">
                            (padj {formatPadj(g.padj)})
                          </span>
                                                          </li>
                                                      ))}
                                                    </ul>
                                                  </div>

                                                  <div className="de-summary-column">
                                                    <div className="de-summary-title down">Top ↓</div>
                                                    <ul className="de-summary-list">
                                                      {analysis.de_summary.top_down?.map((g, i) => (
                                                          <li key={i} className="de-summary-item">
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
                                                      ))}
                                                    </ul>
                                                  </div>
                                                </div>
                                              </div>
                                          )}
                                        </div>
                                    )}

                                    <div className="plot-frame">
                                      {isUmap ? (
                                        <DynamicUmapPlot
                                          analysis={analysis}
                                          geneName={geneData.Name}
                                          height={420}
                                        />
                                      ) : showDynamicDe ? (
                                          <DynamicVolcanoPlot
                                              tsvKey={analysis.s3_tsv_key}
                                              title={analysis.title}
                                              height={320}
                                              preferDegSummaryBar={false}
                                              dotplotDataFromApi={dotplotDataFromApi}
                                              deSummaryFromApi={analysis.de_summary_for_numberdegs || null}
                                              deConditions={analysis.de_conditions || []}
                                              defaultConditionId={analysis.default_condition_id || null}
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
                                              src={`${GENE_API_BASE}/download/png?file_id=${encodeURIComponent(
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
                                                href={`${GENE_API_BASE}/download?tsv_file_id=${encodeURIComponent(
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
                                            src={`${GENE_API_BASE}/download/png?file_id=${encodeURIComponent(
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
