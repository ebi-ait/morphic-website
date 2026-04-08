import React, { useEffect, useState, useMemo } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GenePhenotypeEvidence from "../../components/GenePhenotypeEvidence";
import MousePhenotype from "../../components/MousePhenotype";
import DynamicVolcanoPlot from "../../components/DynamicVolcanoPlot";
import DynamicEnrichmentPlot from "../../components/DynamicEnrichmentPlot";
import DynamicUmapPlot from "../../components/DynamicUmapPlot";
import GeneSearch from "../../components/GeneSearch";
import { ShoppingCart } from "lucide-react";
import { ExternalLink } from "lucide-react";

const API_BASE = process.env.GATSBY_INGEST_API ?? "https://api.ingest.archive.morphic.bio";
const GENE_API_BASE =
  process.env.GATSBY_GENE_API ??
  "https://46ucfedadd.execute-api.us-east-1.amazonaws.com";

const formatLabel = (label) => label?.replaceAll("_", " ") ?? label;

const safeArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const titleCase = (value) => {
  if (!value) return value;
  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatPerturbationState = (value) => {
  if (!value) return null;
  if (value === "default") return "Default";
  return titleCase(value);
};

const formatPerturbationType = (value) => {
  if (!value) return null;

  const map = {
    single_gene_knockout: "Single-gene knockout",
    multi_gene_knockout: "Multi-gene knockout",
    enhancer_deletion: "Enhancer deletion",
    regulatory_perturbation: "Regulatory perturbation",
  };

  return map[value] || titleCase(value);
};

const getPlotKind = (analysis) => {
  const title = String(analysis?.title || "").toLowerCase();
  const pngKey = String(analysis?.s3_png_key || "").toLowerCase();
  const tsvKey = String(analysis?.s3_tsv_key || "").toLowerCase();

  if (/umap/i.test(title) || /_umap/i.test(pngKey)) return "umap";
  if (/celltype[-_ ]?proportion/i.test(title) || /celltype[-_ ]?proportion/i.test(pngKey)) {
    return "celltype_proportion";
  }
  if (/number[-_ ]?degs?/i.test(title) || /#\s*degs?/i.test(title) || /number[-_ ]?degs?/i.test(tsvKey)) {
    return "deg_count";
  }
  if (/topdeg[-_ ]?dotplot/i.test(title) || /topdeg[-_ ]?dotplot/i.test(tsvKey)) {
    return "topdeg_dotplot";
  }
  if (analysis?.result_type === "DE" && analysis?.role === "canonical_de" && analysis?.s3_tsv_key) {
    return "volcano";
  }
  return "static";
};

const getAnalysisContext = (analysis = {}) => analysis?.analysis_context || {};

const resolveAnalysisDisplayMeta = ({ analysis, study, studyMeta, geneName }) => {
  const ctx = getAnalysisContext(analysis);

  const modelSystems = safeArray(ctx.study_model_systems).length
    ? safeArray(ctx.study_model_systems)
    : safeArray(study?.modelSystems).length
      ? safeArray(study?.modelSystems)
      : safeArray(studyMeta?.modelSystems);

  const cellLines = safeArray(ctx.study_cell_lines).length
    ? safeArray(ctx.study_cell_lines)
    : safeArray(study?.cellLines).length
      ? safeArray(study?.cellLines)
      : safeArray(studyMeta?.cellLines);

  return {
    studyLabel: study?.label ? formatLabel(study.label) : formatLabel(analysis?.study_label),
    studyTitle: study?.studyTitle || studyMeta?.studyTitle || null,
    studyDescription: study?.studyDescription || studyMeta?.studyDescription || null,
    assay: ctx.study_assay || study?.assay || studyMeta?.assay || null,
    modelSystems,
    cellLines,
    lineageLabel: ctx.lineage_label || modelSystems[0] || null,
    timepointLabel: ctx.timepoint_label || null,
    timepointValue: ctx.timepoint_value ?? null,
    comparisonLabel: ctx.comparison_label || analysis?.title || null,
    perturbationType: formatPerturbationType(ctx.perturbation_type),
    perturbationState: formatPerturbationState(ctx.perturbation_state),
    analysisSubset: ctx.analysis_subset || null,
    targetGeneSymbols: safeArray(ctx.target_gene_symbols).length
      ? safeArray(ctx.target_gene_symbols)
      : geneName
        ? [geneName]
        : [],
    metadataConflict: !!ctx.metadata_conflict,
    parseConfidence: ctx.parse_confidence || null,
    plotKind: getPlotKind(analysis),
  };
};

const getDatasetGroupKey = (analysis) => {
  return analysis?.study_id || analysis?.study_label || "unknown-study";
};

const groupAnalysisResults = (analyses, studyById, labelToStudyMeta, geneName) => {
  const groups = new Map();

  analyses.forEach((analysis) => {
    const studyId = analysis?.study_id;
    const study = studyId ? studyById[studyId] : null;

    const studyLabel = analysis?.study_label?.trim();
    const studyMeta = studyLabel ? labelToStudyMeta[studyLabel] : null;

    const displayMeta = resolveAnalysisDisplayMeta({
      analysis,
      study,
      studyMeta,
      geneName,
    });

    const key = getDatasetGroupKey(analysis);

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        study,
        studyMeta,
        displayMeta,
        items: [],
      });
    }

    groups.get(key).items.push({
      analysis,
      study,
      studyMeta,
      displayMeta,
    });
  });

  return Array.from(groups.values());
};

const buildUniqueOptions = (items, getter) => {
  const seen = new Set();
  const out = [];

  items.forEach((item) => {
    const value = getter(item);
    if (!value || seen.has(value)) return;
    seen.add(value);
    out.push(value);
  });

  return out;
};

const getSelectedAnalysisForPanel = ({
                                       items,
                                       selectedLineage,
                                       selectedTimepoint,
                                       selectedComparison,
                                       selectedPlotKind,
                                     }) => {
  const exact = items.find((item) => {
    const m = item.displayMeta;
    return (
      (selectedLineage ? m.lineageLabel === selectedLineage : true) &&
      (selectedTimepoint ? m.timepointLabel === selectedTimepoint : true) &&
      (selectedComparison ? m.comparisonLabel === selectedComparison : true) &&
      (selectedPlotKind ? m.plotKind === selectedPlotKind : true)
    );
  });

  if (exact) return exact;

  const partial = items.find((item) => {
    const m = item.displayMeta;
    return (
      (selectedLineage ? m.lineageLabel === selectedLineage : true) &&
      (selectedTimepoint ? m.timepointLabel === selectedTimepoint : true) &&
      (selectedComparison ? m.comparisonLabel === selectedComparison : true)
    );
  });

  return partial || items[0];
};

const isGroupableVolcanoAnalysis = (analysis) => {
  const title = String(analysis?.title || "").toLowerCase();
  const tsvKey = String(analysis?.s3_tsv_key || "").toLowerCase();
  const pngKey = String(analysis?.s3_png_key || "").toLowerCase();

  const isNumberDegs =
    /number[-_ ]?degs?/i.test(title) ||
    /#\s*degs?/i.test(title) ||
    /number[-_ ]?degs?/i.test(tsvKey);

  const isUmap =
    /umap/i.test(title) ||
    /_umap/i.test(pngKey);

  return (
    analysis?.result_type === "DE" &&
    analysis?.role === "canonical_de" &&
    !!analysis?.s3_tsv_key &&
    !isNumberDegs &&
    !isUmap
  );
};

const GroupedDatasetPanel = ({
                               group,
                               geneName,
                               resolvableSymbols = [],
                               previousSymbols = [],
                               GENE_API_BASE,
                               getGeoAccession,
                             }) => {
  const { items, displayMeta, studyMeta } = group;

  const lineageOptions = buildUniqueOptions(items, (x) => x.displayMeta.lineageLabel);
  const timepointOptions = buildUniqueOptions(items, (x) => x.displayMeta.timepointLabel);
  const comparisonOptions = buildUniqueOptions(items, (x) => x.displayMeta.comparisonLabel);
  const plotKindOptions = buildUniqueOptions(items, (x) => x.displayMeta.plotKind);

  const [selectedLineage, setSelectedLineage] = useState(lineageOptions[0] || "");
  const [selectedTimepoint, setSelectedTimepoint] = useState(timepointOptions[0] || "");
  const [selectedComparison, setSelectedComparison] = useState(comparisonOptions[0] || "");
  const [selectedPlotKind, setSelectedPlotKind] = useState(
    plotKindOptions.includes("volcano") ? "volcano" : plotKindOptions[0] || ""
  );

  const [selectedConditionId, setSelectedConditionId] = useState(
    items?.[0]?.analysis?.default_condition_id ||
    items?.[0]?.analysis?.de_conditions?.[0]?.condition_id ||
    null
  );

  useEffect(() => {
    if (!lineageOptions.includes(selectedLineage)) {
      setSelectedLineage(lineageOptions[0] || "");
    }
  }, [lineageOptions, selectedLineage]);

  useEffect(() => {
    if (!timepointOptions.includes(selectedTimepoint)) {
      setSelectedTimepoint(timepointOptions[0] || "");
    }
  }, [timepointOptions, selectedTimepoint]);

  useEffect(() => {
    if (!comparisonOptions.includes(selectedComparison)) {
      setSelectedComparison(comparisonOptions[0] || "");
    }
  }, [comparisonOptions, selectedComparison]);

  useEffect(() => {
    if (!plotKindOptions.includes(selectedPlotKind)) {
      setSelectedPlotKind(
        plotKindOptions.includes("volcano") ? "volcano" : plotKindOptions[0] || ""
      );
    }
  }, [plotKindOptions, selectedPlotKind]);

  const selectedItem = useMemo(
    () =>
      getSelectedAnalysisForPanel({
        items,
        selectedLineage,
        selectedTimepoint,
        selectedComparison,
        selectedPlotKind,
      }),
    [items, selectedLineage, selectedTimepoint, selectedComparison, selectedPlotKind]
  );

  if (!selectedItem) return null;

  const { analysis, study, studyMeta: selectedStudyMeta, displayMeta: selectedMeta } = selectedItem;

  // const defaultCond = pickDefaultCondition(analysis);
  const selectedCond = analysis.de_conditions?.find(
    c => c.condition_id === selectedConditionId
  );
  const deHead =
    normalizeCondSummary(selectedCond) ||
    normalizeDeSummary(analysis.de_summary);

  const isNumberDegsAnalysis =
    /number[-_ ]?degs?/i.test(analysis.title || "") ||
    /#\s*degs?/i.test(analysis.title || "") ||
    /number[-_ ]?degs?/i.test(analysis.s3_tsv_key || "");

  const showMetrics = !!deHead && !isNumberDegsAnalysis;

  const geoAccession = getGeoAccession(selectedStudyMeta);
  const rawDataHref = geoAccession
    ? `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${encodeURIComponent(geoAccession)}`
    : null;

  const plotKindLabelMap = {
    volcano: "Volcano Plot",
    umap: "UMAP",
    celltype_proportion: "Cell Type Proportion",
    deg_count: "DEG Summary",
    topdeg_dotplot: "Top DEG Dotplot",
    static: "Plot",
  };

  return (
    <div className="dataset-card">
      <div className="dataset-card-header">
        <div className="dataset-head">
          <div className="dataset-head-title">
            {selectedMeta.studyLabel || analysis.title}
          </div>

          {!!selectedMeta.studyTitle && (
            <div className="dataset-head-desc">
              {selectedMeta.studyTitle}
            </div>
          )}

          <div className="dataset-head-meta">
            <span className="dataset-meta-item">
              <span className="dataset-meta-label">Model System:</span>{" "}
              <span className="dataset-meta-value">
                {selectedMeta.lineageLabel || "—"}
              </span>
            </span>

            {/*<span className="dataset-meta-item">*/}
            {/*  <span className="dataset-meta-label">Timepoint:</span>{" "}*/}
            {/*  <span className="dataset-meta-value">*/}
            {/*    {selectedMeta.timepointLabel || "—"}*/}
            {/*  </span>*/}
            {/*</span>*/}

            {/*<span className="dataset-meta-item">*/}
            {/*  <span className="dataset-meta-label">Perturbation Strategy:</span>{" "}*/}
            {/*  <span className="dataset-meta-value">*/}
            {/*    {selectedMeta.comparisonLabel || "—"}*/}
            {/*  </span>*/}
            {/*</span>*/}

            <span className="dataset-meta-item">
              <span className="dataset-meta-label">Cell Line:</span>{" "}
              <span className="dataset-meta-value">
                {selectedMeta.cellLines.join(" • ") || "—"}
              </span>
            </span>

            <span className="dataset-meta-item">
              <span className="dataset-meta-label">Assay Type:</span>{" "}
              <span className="dataset-meta-value">
                {selectedMeta.assay || "—"}
              </span>
            </span>
          </div>
        </div>

        {showMetrics && (
          <div className="de-affects-bar">
            <div className="de-affects-left">
              <span className="de-affects-label">Affects</span>
              <span className="de-affects-value">
                {(deHead.n_significant ?? 0).toLocaleString()}
              </span>
              <span className="de-affects-label">genes</span>
            </div>

            <div className="de-affects-right">
              <span className="de-affects-up">↑ {(deHead.n_up ?? 0).toLocaleString()}</span>
              <span className="de-affects-down">↓ {(deHead.n_down ?? 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/*<div className="dataset-panel-controls">*/}
      {/*  {lineageOptions.length > 1 && (*/}
      {/*    <label className="de-field">*/}
      {/*      <span className="de-field-label">Model System</span>*/}
      {/*      <select*/}
      {/*        className="de-select"*/}
      {/*        value={selectedLineage}*/}
      {/*        onChange={(e) => setSelectedLineage(e.target.value)}*/}
      {/*      >*/}
      {/*        {lineageOptions.map((option) => (*/}
      {/*          <option key={option} value={option}>*/}
      {/*            {option}*/}
      {/*          </option>*/}
      {/*        ))}*/}
      {/*      </select>*/}
      {/*    </label>*/}
      {/*  )}*/}

      {/*  {timepointOptions.length > 1 && (*/}
      {/*    <label className="de-field">*/}
      {/*      <span className="de-field-label">Timepoint</span>*/}
      {/*      <select*/}
      {/*        className="de-select"*/}
      {/*        value={selectedTimepoint}*/}
      {/*        onChange={(e) => setSelectedTimepoint(e.target.value)}*/}
      {/*      >*/}
      {/*        {timepointOptions.map((option) => (*/}
      {/*          <option key={option} value={option}>*/}
      {/*            {option}*/}
      {/*          </option>*/}
      {/*        ))}*/}
      {/*      </select>*/}
      {/*    </label>*/}
      {/*  )}*/}

      {/*  {comparisonOptions.length > 1 && (*/}
      {/*    <label className="de-field">*/}
      {/*      <span className="de-field-label">Perturbation Strategy</span>*/}
      {/*      <select*/}
      {/*        className="de-select"*/}
      {/*        value={selectedComparison}*/}
      {/*        onChange={(e) => setSelectedComparison(e.target.value)}*/}
      {/*      >*/}
      {/*        {comparisonOptions.map((option) => (*/}
      {/*          <option key={option} value={option}>*/}
      {/*            {option}*/}
      {/*          </option>*/}
      {/*        ))}*/}
      {/*      </select>*/}
      {/*    </label>*/}
      {/*  )}*/}

      {/*  {plotKindOptions.length > 1 && (*/}
      {/*    <label className="de-field">*/}
      {/*      <span className="de-field-label">Plot Type</span>*/}
      {/*      <select*/}
      {/*        className="de-select"*/}
      {/*        value={selectedPlotKind}*/}
      {/*        onChange={(e) => setSelectedPlotKind(e.target.value)}*/}
      {/*      >*/}
      {/*        {plotKindOptions.map((option) => (*/}
      {/*          <option key={option} value={option}>*/}
      {/*            {plotKindLabelMap[option] || option}*/}
      {/*          </option>*/}
      {/*        ))}*/}
      {/*      </select>*/}
      {/*    </label>*/}
      {/*  )}*/}
      {/*</div>*/}

      <div className="dataset-card-body">
        {selectedMeta.plotKind === "umap" ? (
          <div className="dataset-plot-frame dataset-plot-frame--umap">
            <DynamicUmapPlot
              analysis={analysis}
              geneName={geneName}
              resolvableSymbols={resolvableSymbols}
              previousSymbols={previousSymbols}
              height={420}
            />
          </div>
        ) : analysis?.s3_tsv_key ? (
          <DynamicVolcanoPlot
            tsvKey={analysis.s3_tsv_key}
            title={analysis.title}
            geneName={geneName}
            height={360}
            preferDegSummaryBar={false}
            deConditions={items.map((item) => ({
              condition_id: item.analysis.default_condition_id || item.analysis.title,
              label: item.displayMeta.comparisonLabel || item.analysis.title,
              analysisRef: item.analysis,
            }))}
            defaultConditionId={analysis.default_condition_id || analysis.title}
            analysisContext={analysis.analysis_context || {}}
            externalFilters={{
              modelSystem: selectedMeta.lineageLabel || "",
              timepoint: selectedMeta.timepointLabel || "",
              experimentCondition: selectedMeta.comparisonLabel || "",
            }}
            filterLabels={{
              strategy: "Perturbation Strategy",
              condition: "Model System",
              pathway: "Timepoint",
            }}
            lockConditionToDefault={false}
            onExperimentConditionChange={(value) => {
              setSelectedConditionId(value);
              const matched = items.find(
                (item) => (item.analysis.default_condition_id || item.analysis.title) === value
              );
              if (matched) {
                setSelectedComparison(matched.displayMeta.comparisonLabel || "");
              }
            }}
          />
        ) : analysis?.svg ? (
          <div className="dataset-static-plot">
            <img
              src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}
              className="dataset-static-img"
              alt={analysis.title}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : analysis?.s3_png_key ? (
          <div className="dataset-static-plot">
            <img
              src={`${GENE_API_BASE}/download/png?file_id=${encodeURIComponent(analysis.s3_png_key)}`}
              className="dataset-static-img"
              alt={analysis.title}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <p>No image available</p>
        )}
      </div>

      <div className="dataset-card-footer">
        {analysis?.s3_tsv_key && (
          <a
            className="btn-primary"
            href={`${GENE_API_BASE}/download?tsv_file_id=${encodeURIComponent(
              analysis.s3_tsv_key
            )}&file_name=${encodeURIComponent(analysis.title || geneName || "download")}`}
            title="Download differential expression results table (processed data)"
          >
            Download Data (.tsv)
          </a>
        )}

        {rawDataHref && (
          <a
            className="btn-outline"
            href={rawDataHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Open raw sequencing dataset in external archive"
          >
            Download Raw Counts
          </a>
        )}

        <a
          className="btn-link-subtle"
          href={`/data?label=${encodeURIComponent(formatLabel(analysis.study_label || ""))}`}
          title="Open this study in the Data Catalogue"
        >
          Go to Full Dataset →
        </a>
      </div>
    </div>
  );
};

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

const normalizeDeSummary = (ds) => {
  if (!ds) return null;

  // New structure
  if (ds.summary) {
    return {
      ...ds,
      n_total: ds.summary.n_total ?? 0,
      n_significant: ds.summary.n_significant ?? 0,
      n_up: ds.summary.n_up ?? 0,
      n_down: ds.summary.n_down ?? 0,
      median_abs_log2fc: ds.summary.median_abs_log2fc ?? 0,
      thresholds: ds.thresholds ?? null,
      top_source: ds.top_source ?? "significant",
      top_up: ds.top_up ?? [],
      top_down: ds.top_down ?? [],
    };
  }

  // Old structure
  return {
    ...ds,
    thresholds: ds.thresholds ?? null,
    top_source: ds.top_source ?? "significant",
    top_up: ds.top_up ?? [],
    top_down: ds.top_down ?? [],
  };
};

const AnalysisResultCard = ({
                              analysis,
                              geneName,
                              resolvableSymbols = [],
                              previousSymbols = [],
                              studyById,
                              labelToStudyMeta,
                              getGeoAccession,
                              GENE_API_BASE,
                            }) => {
  const studyId = analysis?.study_id;
  const study = studyId ? studyById[studyId] : null;

  const studyLabel = analysis?.study_label?.trim();
  const studyMeta = studyLabel ? labelToStudyMeta[studyLabel] : undefined;

  const displayMeta = resolveAnalysisDisplayMeta({
    analysis,
    study,
    studyMeta,
    geneName,
  });

  const geoAccession = getGeoAccession(studyMeta);
  const rawDataHref = geoAccession
    ? `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${encodeURIComponent(geoAccession)}`
    : null;

  const isCanonicalDe =
    analysis?.result_type === "DE" &&
    analysis?.role === "canonical_de" &&
    !!analysis?.s3_tsv_key;

  const showDynamicDe = !!analysis?.s3_tsv_key && isCanonicalDe;

  const isUmap =
    /umap/i.test(analysis?.title || "") ||
    /_umap/i.test(analysis?.s3_png_key || "");

  const isNumberDegsAnalysis =
    /number[-_ ]?degs?/i.test(analysis?.title || "") ||
    /#\s*degs?/i.test(analysis?.title || "") ||
    /number[-_ ]?degs?/i.test(analysis?.s3_tsv_key || "");

  const formatConditionIdLabel = (conditionId) => {
    if (!conditionId) return "Default";

    return String(conditionId)
      .replaceAll("_", " ")
      .replace(/\bKO\b/g, "KO")
      .replace(/\bPTC\b/g, "PTC")
      .replace(/\bCE\b/g, "CE")
      .trim();
  };

  const volcanoConditionOptions =
    Array.isArray(analysis?.de_conditions) && analysis.de_conditions.length > 0
      ? analysis.de_conditions.map((cond) => {
        const isDefault = cond.condition_id === analysis.default_condition_id;

        return {
          ...cond,
          label: isDefault
            ? (displayMeta.comparisonLabel || cond.condition_id || analysis.title)
            : (cond.condition_label || formatConditionIdLabel(cond.condition_id)),
        };
      })
      : [
        {
          condition_id: analysis?.default_condition_id || analysis?.title || "default",
          label: displayMeta.comparisonLabel || analysis?.title || "Default",
        },
      ];

  const [selectedConditionId, setSelectedConditionId] = useState(
    analysis?.default_condition_id ||
    volcanoConditionOptions[0]?.condition_id ||
    null
  );

  useEffect(() => {
    setSelectedConditionId(
      analysis?.default_condition_id ||
      volcanoConditionOptions[0]?.condition_id ||
      null
    );
  }, [analysis?.default_condition_id, analysis?.title]);

  const selectedCond =
    (Array.isArray(analysis?.de_conditions)
      ? analysis.de_conditions.find((c) => c.condition_id === selectedConditionId)
      : null) || pickDefaultCondition(analysis);

  const deHead =
    normalizeCondSummary(selectedCond) ||
    normalizeDeSummary(analysis?.de_summary);

  const showMetrics = !!deHead && !isNumberDegsAnalysis;

  return (
    <div className="dataset-card">
      <div className="dataset-card-header">
        <div className="dataset-head">
          <div className="dataset-head-title">
            {displayMeta.studyLabel || analysis?.title}
          </div>

          {!!displayMeta.studyTitle && (
            <div className="dataset-head-desc">
              {displayMeta.studyTitle}
            </div>
          )}

          <div className="dataset-head-meta">
            <span className="dataset-meta-item">
              <span className="dataset-meta-label">Model System:</span>{" "}
              <span className="dataset-meta-value">
                {displayMeta.lineageLabel || displayMeta.modelSystems.join(" • ") || "—"}
              </span>
            </span>

            <span className="dataset-meta-item">
              <span className="dataset-meta-label">Cell Line:</span>{" "}
              <span className="dataset-meta-value">
                {displayMeta.cellLines.join(" • ") || "—"}
              </span>
            </span>

            <span className="dataset-meta-item">
              <span className="dataset-meta-label">Assay Type:</span>{" "}
              <span className="dataset-meta-value">
                {displayMeta.assay || "—"}
              </span>
            </span>
          </div>
        </div>

        {showMetrics && (
          <div className="de-affects-bar">
            <div className="de-affects-left">
              <span className="de-affects-label">Affects</span>
              <span className="de-affects-value">
                {(deHead.n_significant ?? 0).toLocaleString()}
              </span>
              <span className="de-affects-label">genes</span>
            </div>

            <div className="de-affects-right">
              <span className="de-affects-up">
                ↑ {(deHead.n_up ?? 0).toLocaleString()}
              </span>
              <span className="de-affects-down">
                ↓ {(deHead.n_down ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="dataset-card-body">
        {isUmap ? (
          <div className="dataset-plot-frame dataset-plot-frame--umap">
            <DynamicUmapPlot
              analysis={analysis}
              geneName={geneName}
              resolvableSymbols={resolvableSymbols}
              previousSymbols={previousSymbols}
              height={420}
            />
          </div>
        ) : showDynamicDe ? (
          <DynamicVolcanoPlot
            tsvKey={analysis?.s3_tsv_key}
            title={analysis?.title}
            geneName={geneName}
            height={360}
            preferDegSummaryBar={false}
            deConditions={volcanoConditionOptions}
            defaultConditionId={selectedConditionId}
            analysisContext={analysis?.analysis_context || {}}
            externalFilters={{
              modelSystem: displayMeta.lineageLabel || "",
              timepoint: displayMeta.timepointLabel || "",
              experimentCondition: displayMeta.comparisonLabel || "",
            }}
            filterLabels={{
              strategy: "Perturbation Strategy",
              condition: "Model System",
              pathway: "Timepoint",
            }}
            lockConditionToDefault={volcanoConditionOptions.length <= 1}
            onExperimentConditionChange={(value) => {
              setSelectedConditionId(value);
            }}
          />
        ) : analysis?.svg ? (
          <div className="dataset-static-plot">
            <img
              src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}
              className="dataset-static-img"
              alt={analysis?.title}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : analysis?.s3_png_key ? (
          <div className="dataset-static-plot">
            <img
              src={`${GENE_API_BASE}/download/png?file_id=${encodeURIComponent(
                analysis.s3_png_key
              )}`}
              className="dataset-static-img"
              alt={analysis?.title}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <p>No image available</p>
        )}
      </div>

      <div className="dataset-card-footer">
        {analysis?.s3_tsv_key && (
          <a
            className="btn-primary"
            href={`${GENE_API_BASE}/download?tsv_file_id=${encodeURIComponent(
              analysis.s3_tsv_key
            )}&file_name=${encodeURIComponent(
              analysis?.title || geneName || "download"
            )}`}
            title="Download differential expression results table (processed data)"
          >
            Download Data (.tsv)
          </a>
        )}

        {rawDataHref && (
          <a
            className="btn-outline"
            href={rawDataHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Open raw sequencing dataset in external archive"
          >
            Download Raw Counts
          </a>
        )}

        <a
          className="btn-link-subtle"
          href={`/data?label=${encodeURIComponent(formatLabel(studyLabel || ""))}`}
          title="Open this study in the Data Catalogue"
        >
          Go to Full Dataset →
        </a>
      </div>
    </div>
  );
};

const pickDefaultCondition = (analysis) => {
  const conds = Array.isArray(analysis?.de_conditions) ? analysis.de_conditions : [];
  if (!conds.length) return null;
  const preferred = analysis?.default_condition_id
    ? conds.find(c => c.condition_id === analysis.default_condition_id)
    : null;
  return preferred || conds[0];
};

const normalizeCondSummary = (cond) => {
  if (!cond) return null;
  const s = cond.summary || {};
  return {
    n_total: s.n_total ?? 0,
    n_significant: s.n_significant ?? 0,
    n_up: s.n_up ?? 0,
    n_down: s.n_down ?? 0,
    median_abs_log2fc: s.median_abs_log2fc ?? 0,
    top_source: s.top_source ?? "significant",
    thresholds: cond.thresholds ?? null,
  };
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
  const [studyById, setStudyById] = useState({});
  const [isPhenotypeOpen, setIsPhenotypeOpen] = useState(false);

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
              `${API_BASE}/studies/search/findByReleaseStatus?releaseStatus=PUBLIC&page=0&size=2000`
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

            const byId = {};

            for (const s of list) {
              const id = s?.id;
              if (!id) continue;

              byId[id] = {
                id,
                label: s?.content?.label?.trim() ?? null,
                studyTitle: s?.content?.study_title ?? null,
                studyDescription: s?.content?.study_description ?? null,
                assay: s?.content?.readout_assay ?? null,
                institute: s?.content?.institute ?? null,
                modelSystems: Array.isArray(s?.content?.model_organ_systems) ? s.content.model_organ_systems : [],
                cellLines: Array.isArray(s?.content?.cell_line_names) ? s.content.cell_line_names : [],
              };
            }
            setStudyById(byId);

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
    (ar) => normalizeDeSummary(ar.de_summary)?.n_significant !== null
  );

  const numberOfExperiments = experimentsWithSummary.length;
  const numberOfStudies = uniqueStudies.length;

  const totalSignificant = experimentsWithSummary.reduce(
    (sum, ar) => sum + (normalizeDeSummary(ar.de_summary)?.n_significant || 0),
    0
  );

  const totalUp = experimentsWithSummary.reduce(
    (sum, ar) => sum + (normalizeDeSummary(ar.de_summary)?.n_up || 0),
    0
  );

  const totalDown = experimentsWithSummary.reduce(
    (sum, ar) => sum + (normalizeDeSummary(ar.de_summary)?.n_down || 0),
    0
  );

  const representativeGenes = (() => {
    const geneMap = new Map();

    experimentsWithSummary.forEach((ar) => {
      const s = normalizeDeSummary(ar.de_summary);
      const candidates = [
        ...(s?.top_up || []),
        ...(s?.top_down || []),
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

  const uniqueAnalysisStudies = uniqueStudiesFromGene({
    Analysis_Results: geneData.Analysis_Results || [],
    Enrichment_Analysis: [],
  });

  const analysisDatasetCount = uniqueAnalysisStudies.length;
  const getAffectedGeneCount = (analysis) => {
    const defaultCond = pickDefaultCondition(analysis);
    const condSummary = normalizeCondSummary(defaultCond);
    const deSummary = normalizeDeSummary(analysis.de_summary);

    return (
      condSummary?.n_significant ??
      deSummary?.n_significant ??
      0
    );
  };

  const getAnalysisPriority = (analysis) => {
    const title = (analysis?.title || "").toLowerCase();
    const tsvKey = (analysis?.s3_tsv_key || "").toLowerCase();
    const pngKey = (analysis?.s3_png_key || "").toLowerCase();

    const isNumberDegs =
      /number[-_ ]?degs?/i.test(title) ||
      /#\s*degs?/i.test(title) ||
      /number[-_ ]?degs?/i.test(tsvKey);

    const isCanonicalDe =
      analysis?.result_type === "DE" &&
      analysis?.role === "canonical_de" &&
      !!analysis?.s3_tsv_key;

    const isVolcanoDe = isCanonicalDe && !isNumberDegs;

    const isUmap =
      /umap/i.test(title) ||
      /_umap/i.test(pngKey);

    if (isVolcanoDe) return 0;   // volcano first
    if (isNumberDegs) return 1;  // DEG barplots second
    if (isUmap) return 2;        // UMAP third
    return 3;                    // everything else after
  };

  const sortedAnalysisResults = [...(geneData.Analysis_Results || [])].sort((a, b) => {
    const priorityA = getAnalysisPriority(a);
    const priorityB = getAnalysisPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return getAffectedGeneCount(b) - getAffectedGeneCount(a);
  });

  const groupedVolcanoAnalyses = sortedAnalysisResults.filter(isGroupableVolcanoAnalysis);
  const standaloneAnalyses = sortedAnalysisResults.filter(
    (analysis) => !isGroupableVolcanoAnalysis(analysis)
  );

  const groupedAnalysisPanels = groupAnalysisResults(
    groupedVolcanoAnalyses,
    studyById,
    labelToStudyMeta,
    geneData.Name
  );

  const hasVolcanoPlot = sortedAnalysisResults.some((analysis) => {
    const title = (analysis?.title || "").toLowerCase();
    const tsvKey = (analysis?.s3_tsv_key || "").toLowerCase();
    const pngKey = (analysis?.s3_png_key || "").toLowerCase();

    const isNumberDegs =
      /number[-_ ]?degs?/i.test(title) ||
      /#\s*degs?/i.test(title) ||
      /number[-_ ]?degs?/i.test(tsvKey);

    const isUmap =
      /umap/i.test(title) ||
      /_umap/i.test(pngKey);

    const isCanonicalDe =
      analysis?.result_type === "DE" &&
      analysis?.role === "canonical_de" &&
      !!analysis?.s3_tsv_key;

    return isCanonicalDe && !isNumberDegs && !isUmap;
  });

  const getGeoAccession = (studyMeta) => {
    const accessions = Array.isArray(studyMeta?.accessions) ? studyMeta.accessions : [];
    return accessions.find((acc) => {
      const v = String(acc || "").trim().toUpperCase();
      return v.startsWith("GSE") || v.startsWith("GSM");
    }) || null;
  };

  const getPrimaryRawAccession = (studyMeta) => {
    if (!studyMeta?.accessions || !Array.isArray(studyMeta.accessions)) return null;
    if (!studyMeta.accessions.length) return null;

    return studyMeta.accessions[0];
  };

  const renderProteinClass = (value) => {
    if (!value) return "—";

    const match = String(value).match(/^(.*?)(\s*\(([^)]+)\))?$/);
    const label = match?.[1]?.trim();
    const code = match?.[3]?.trim();

    return (
      <span className="gene-protein-class">
      <span className="gene-protein-class-label">{label || value}</span>
        {code && <span className="gene-protein-class-code">({code})</span>}
    </span>
    );
  };

  return (
      <div className="about gene-page">
        <div className="gene-header-inline gene-header-gradient gene-hero">
          <div className="gene-header-position-top">
            <Navbar />
          </div>

          <div className="gene-header-position-center">
            <div className="gene-search-container">
              <GeneSearch variant="compact" />
            </div>
          </div>

          <div className="gene-header-position-bottom gene-header-triangle"></div>
        </div>

        <div className="gene-container">
          <div className="gene-menu">
            <div className="gene-menu-card">
              <h1 className="gene-menu-title">gene: {geneData.Name}</h1>
              <ul>
                <li>
                  <a href="#" className="gene-menu-link gene-active">Overview</a>
                </li>
                {geneData.Analysis_Results?.length > 0 && (
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
              <div className="gene-card gene-overview-card">
                <div className="gene-overview-top">
                  <div className="gene-overview-title-wrap">
                    <div className="gene-overview-badge">
                      <span className="gene-overview-badge-inner">
                        <span className="gene-overview-badge-dot"></span>
                      </span>
                    </div>

                    <div className="gene-overview-title-block">
                      <h1 className="gene-overview-title">{geneData.Name}</h1>
                      <p className="gene-overview-subtitle">{geneData.Full_Name}</p>
                    </div>
                  </div>

                  <a href="/order-cell-lines/" className="gene-card-header-link">
                    <ShoppingCart size={16} className="gene-card-header-link-icon" />
                    <span>Order Alleles</span>
                  </a>
                </div>

                <div className="gene-overview-content">
                  <div className="gene-overview-info">
                    <h2 className="gene-overview-section-title">Gene Information</h2>

                    <dl className="gene-overview-info-grid">
                      {/*<dt>Name</dt>*/}
                      {/*<dd>{geneData.Full_Name || "—"}</dd>*/}

                      <dt>Synonyms</dt>
                      <dd>
                        {safeArray(geneData.Synonyms).length
                          ? safeArray(geneData.Synonyms).join(", ")
                          : "—"}
                      </dd>

                      <dt>HGNC ID</dt>
                      <dd>
                        <a
                          className="gene-overview-link inline-flex items-center gap-1.5"
                          href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${geneData.HGNC_ID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {geneData.HGNC_ID}
                          <ExternalLink size={14} title="Open HGNC page" />
                        </a>
                      </dd>

                      <dt>Protein class</dt>
                      <dd>{renderProteinClass(geneData.Protein_Class)}</dd>
                    </dl>
                  </div>

                  <div className="gene-card-summary gene-overview-summary">
                    <h2 className="gene-card-summary-title">MorPhiC Summary</h2>

                    {geneData.Analysis_Results && geneData.Analysis_Results.length > 0 ? (
                      (() => {
                        const analysisResults = geneData.Analysis_Results || [];

                        const dpcSet = new Set();
                        const assaySet = new Set();

                        analysisResults.forEach((r) => {
                          const label = r.study_label?.trim();
                          const studyId = r.study_id;
                          const ctx = r.analysis_context || {};

                          const metaByLabel = label ? labelToStudyMeta[label] : null;
                          const metaById = studyId ? studyById[studyId] : null;

                          console.log("SUMMARY DEBUG", {
                            gene: geneData.Name,
                            label,
                            studyId,
                            metaByLabel,
                            metaById,
                            ctx,
                          });

                          const dpc =
                            metaByLabel?.dpc ||
                            metaById?.institute ||
                            null;

                          const assay =
                            metaByLabel?.assay ||
                            metaById?.assay ||
                            ctx.study_assay ||
                            null;

                          if (dpc) dpcSet.add(dpc);
                          if (assay) assaySet.add(assay);
                        });

                        const profiledByText = dpcSet.size
                          ? Array.from(dpcSet).join(", ")
                          : "Unknown";

                        const assayTypesText = assaySet.size
                          ? Array.from(assaySet).join(", ")
                          : "Unknown";

                        const hasAnySummary = analysisResults.some((ar) => {
                          const deSummary = ar?.de_summary;
                          const deConditions = Array.isArray(ar?.de_conditions) ? ar.de_conditions : [];
                          return !!deSummary || deConditions.some((c) => c?.summary);
                        });

                        const statusText = hasAnySummary ? "ASSAYED, ANALYSED" : "ASSAYED";

                        return (
                          <dl className="gene-card-summary-grid">
                            <dt>Studied by MorPhiC</dt>
                            <dd>YES</dd>

                            <dt>Profiled by</dt>
                            <dd>{profiledByText}</dd>

                            <dt>Assay types</dt>
                            <dd>{assayTypesText}</dd>

                            <dt>Status</dt>
                            <dd>{statusText}</dd>
                          </dl>
                        );
                      })()
                    ) : (
                      <dl className="gene-card-summary-grid no-data">
                        <dt className="no-data">
                          Currently no MorPhiC results are available for this gene
                        </dt>
                      </dl>
                    )}
                  </div>
                </div>

                {/* Phenotype evidence */}
                <div className="gene-card-body gene-card-border-top">
                  <button
                    type="button"
                    className="gene-collapsible-trigger"
                    onClick={() => setIsPhenotypeOpen((prev) => !prev)}
                    aria-expanded={isPhenotypeOpen}
                    aria-controls="phenotype-evidence-panel"
                  >
                    <span className="gene-card-body-title">Phenotype evidence - external resources</span>
                    <span className={`gene-collapsible-icon ${isPhenotypeOpen ? "is-open" : ""}`}>
          ▾
        </span>
                  </button>

                  {isPhenotypeOpen && (
                    <div id="phenotype-evidence-panel" className="gene-collapsible-content">
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
                  )}
                </div>
              </div>
            </section>

            {/* --- Analysis Results --- */}
            {geneData.Analysis_Results?.length > 0 && (
              <section id="results">
                <div className="gene-section-header">
                  <h1 className="gene-section-title">
                    {geneData.Name} Perturbation Results{" "}
                    <span className="gene-section-count">
          ({analysisDatasetCount} dataset{analysisDatasetCount === 1 ? "" : "s"})
        </span>
                  </h1>
                  <a href="#" className="gene-section-link">
                    ↑&nbsp;Back to top
                  </a>
                </div>

                {hasVolcanoPlot && (
                  <div className="gene-results-footnote">
                    <span className="gene-results-footnote-label">Note:</span>{" "}
                    Volcano plots start with precomputed thresholds of padj ≤ 0.05 and |log2FC| ≥ 0.5, which can be adjusted in the UI. Top Genes Tables show the top 50 up- and down-regulated genes ranked by log2FC within each direction, with padj used to break ties. If no genes meet the significance thresholds, genes are instead ranked by effect size.
                  </div>
                )}

                <div className="gene-card gene-card--transparent">
                  <div className="gene-card-body">
                    <div className="dataset-stack">
                      {sortedAnalysisResults.map((analysis, index) => (
                        <AnalysisResultCard
                          key={`${analysis.study_id || analysis.title}-${index}`}
                          analysis={analysis}
                          geneName={geneData.Name}
                          resolvableSymbols={geneData.Resolvable_Symbols || []}
                          previousSymbols={geneData.Previous_Symbols || []}
                          studyById={studyById}
                          labelToStudyMeta={labelToStudyMeta}
                          getGeoAccession={getGeoAccession}
                          GENE_API_BASE={GENE_API_BASE}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* --- Enrichment Analysis --- */}
            {geneData.Enrichment_Analysis?.length > 0 && (
              <section id="enrichment">
                <div className="gene-card gene-card--transparent">
                  <div className="gene-card-header">
                    <h2>Enrichment Analysis</h2>
                  </div>

                  <div className="gene-card-body">
                    <div className="dataset-stack">
                      {geneData.Enrichment_Analysis.map((analysis, index) => (
                        <div className="dataset-card" key={index}>
                          <div className="dataset-card-header">
                            <div className="dataset-head">
                              <div className="dataset-head-title">{analysis.title}</div>
                            </div>
                          </div>

                          <div className="dataset-card-body">
                            <div className="dataset-static-plot">
                              {analysis.s3_tsv_key ? (
                                <DynamicEnrichmentPlot analysis={analysis} />
                              ) : analysis.svg ? (
                                <img
                                  src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}
                                  className="dataset-static-img"
                                  alt={analysis.title}
                                />
                              ) : analysis.s3_png_key ? (
                                <img
                                  src={`${GENE_API_BASE}/download/png?file_id=${encodeURIComponent(
                                    analysis.s3_png_key
                                  )}`}
                                  className="dataset-static-img"
                                  alt={analysis.title}
                                />
                              ) : (
                                <p>No image available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
