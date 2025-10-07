import React, { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import cover from "../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png";
import { Link } from "gatsby";
import Download from "../components/Data/DownloadDataset";
import FilterDropdown from "../components/DataTrackerFilters/FilterDropdown";
import FilterTags from "../components/DataTrackerFilters/FilterTags";
import { Seo } from "../utils/SEO";

function Layout({ children }) {
  return (
    <div>
      <div className="header-inline header-gradient">
        <img className="header-image" src={cover} alt="" />
        <div className="header-position-top">
          <Navbar />
        </div>
        <div className="header-position-bottom header-triangle"></div>
      </div>
      <div className="data-container">
        <div className="data-content">
          <div className="data-card">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default function Data() {
  const [studiesData, setStudiesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [collapse, setCollapse] = useState(true);
  const handleCollapse = () => setCollapse(!collapse);

  const [searchInput, setSearchInput] = useState("");

  const [geneListId, setGeneListId] = useState(-1);
  const [targetGenesMap, setTargetGenesMap] = useState({});

  const [selectedCenters, setSelectedCenters] = useState(new Set());
  const [selectedAssay, setSelectedAssay] = useState(new Set());
  const [selectedCellLines, setSelectedCellLine] = useState(new Set());
  const [selectedPerturbationType, setSelectedPerturbationType] = useState(new Set());
  const [selectedModelSystem, setSelectedModelSystem] = useState(new Set());

  const [requestedLabel, setRequestedLabel] = useState(null);
  const [didScrollToLabel, setDidScrollToLabel] = useState(false);

  const API_BASE = process.env.GATSBY_INGEST_API ?? "https://api.ingest.archive.morphic.bio";

  const handleClearAll = () => {
    setSearchInput("");
    setSelectedCellLine(new Set());
    setSelectedAssay(new Set());
    setSelectedPerturbationType(new Set());
    setSelectedCenters(new Set());
    setSelectedModelSystem(new Set());
  };

  const GeneIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0275 0H1.9725C0.885 0 0 0.885 0 1.9725V10.0275C0 11.115 0.885 12 1.9725 12H10.0275C11.115 12 12 11.115 12 10.0275V1.9725C12 0.885 11.115 0 10.0275 0ZM8.1225 8.1225C6.9525 9.2925 5.055 9.2925 3.8775 8.1225C2.7075 6.9525 2.7075 5.0475 3.8775 3.8775C5.0475 2.7075 6.945 2.7075 8.1225 3.8775C9.2925 5.0475 9.2925 6.945 8.1225 8.1225Z" fill="#999999"/>
    </svg>
  );

  const updateSet = (set, item) => {
    const newSet = new Set(set);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    return newSet;
  };

  const handleSelectedCellLine = (cellLine) => setSelectedCellLine(updateSet(selectedCellLines, cellLine));
  const handleSelectedCenterInput = (centerName) => setSelectedCenters(updateSet(selectedCenters, centerName));
  const handleSelectedAssayInput = (assay) => setSelectedAssay(updateSet(selectedAssay, assay));
  const handleSelectedPerturbationType = (type) => setSelectedPerturbationType(updateSet(selectedPerturbationType, type));
  const handleSelectedModelSystem = (type) => setSelectedModelSystem(updateSet(selectedModelSystem, type));

  const fetchGenesInBulk = async (genes) => {
    const response = await fetch(
      "https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/bulk-gene-search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genes }),
      }
    );
    return response.json();
  };

  useEffect(() => {
    const getStudiesData = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/studies/search/findByReleaseStatus?releaseStatus=PUBLIC&page=0&size=20`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const resultStudiesData = await response.json();
        setStudiesData(resultStudiesData);

        const allTargetGenes =
          resultStudiesData?._embedded?.studies?.flatMap((s) => s.content?.target_genes || []) || [];
        const uniqueGenes = [...new Set(allTargetGenes)];
        if (uniqueGenes.length) {
          const genesWithIDs = await fetchGenesInBulk(uniqueGenes);
          const geneMap = genesWithIDs.reduce((map, gene) => {
            map[gene.Name] = gene.HGNC_ID;
            return map;
          }, {});
          setTargetGenesMap(geneMap);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getStudiesData();
  }, [API_BASE]);

  useEffect(() => {
    // read ?label=... from the URL (only in browser)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qLabel = params.get("label");
      if (qLabel) setRequestedLabel(qLabel);
    }
  }, []);

  const filteredData = useMemo(() => {
    const all = studiesData?._embedded?.studies || [];
    let result = all;

    if (searchInput) {
      const q = searchInput.trim().toUpperCase();
      result = result.filter((study) =>
        (study.content?.target_genes || []).some((gene) => String(gene).includes(q))
      );
    }

    if (selectedModelSystem.size > 0) {
      result = result.filter((study) => {
        const ms = study.content?.model_organ_systems;
        const arr = Array.isArray(ms) ? ms : ms ? [ms] : [];
        return arr.some((name) => selectedModelSystem.has(name));
      });
    }

    if (selectedCellLines.size > 0) {
      result = result.filter((study) => {
        const cl = study.content?.cell_line_names;
        const arr = Array.isArray(cl) ? cl : cl ? [cl] : [];
        return arr.some((name) => selectedCellLines.has(name));
      });
    }

    if (selectedAssay.size > 0) {
      result = result.filter((study) =>
        [...selectedAssay].some((name) =>
          String(study.content?.readout_assay || "").includes(name)
        )
      );
    }

    if (selectedPerturbationType.size > 0) {
      result = result.filter((study) => {
        const pt = study.content?.perturbation_type;
        const arr = Array.isArray(pt) ? pt : pt ? [pt] : [];
        return arr.some((name) => selectedPerturbationType.has(name));
      });
    }

    if (selectedCenters.size > 0) {
      result = result.filter((study) =>
        [...selectedCenters].some((name) =>
          String(study.content?.institute || "").includes(name)
        )
      );
    }

    return result;
  }, [
    studiesData,
    searchInput,
    selectedCenters,
    selectedAssay,
    selectedCellLines,
    selectedModelSystem,
    selectedPerturbationType,
  ]);

  // After data loads, scroll to and briefly highlight the matching row
  useEffect(() => {
    if (!requestedLabel || !filteredData?.length || didScrollToLabel) return;
    const el = document.getElementById(`study-row-${requestedLabel}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a temporary flash highlight
      el.classList.add("row-flash-highlight");
      setTimeout(() => el.classList.remove("row-flash-highlight"), 2500);
      setDidScrollToLabel(true);
    }
  }, [requestedLabel, filteredData, didScrollToLabel]);

  if (isLoading) return (<Layout><p>Loading...</p></Layout>);
  if (error) return (<Layout><p>Error loading studies</p></Layout>);

  const totalCount = studiesData?._embedded?.studies?.length || 0;

  return (
    <Layout>
      <div className="data-card-header">
        <div className="data-card-header-container">
          <span aria-hidden className="data-card-header-icon icon-data-tracker"></span>
          <div>
            <h1 className="dc-heading">Data Catalogue</h1>
            <p>
              All data generated as part of the MorPhiC program is made available in scheduled
              data releases and in public data repositories for wider use by the scientific community.
            </p>
            <p>Current data release: 2.0, September 2025.</p>
          </div>
        </div>
      </div>

      <div className="data-card-body">
        {collapse && (
          <div className="data-card-filter data-card-filter-collapsed">
            <button
              className="data-card-filter-button data-card-filter-button-collapse"
              onClick={() => setCollapse((prev) => !prev)}
              type="button"
            >
              <span className="icon-arrow-right icon"></span>
              <span className="text-rotate">Filter</span>
            </button>
          </div>
        )}

        {!collapse && (
          <>
            <div className="data-card-filter">
              <div className="data-card-button-group">
                <button className="data-card-filter-button" onClick={() => setCollapse((prev) => !prev)} type="button">
                  <span className="icon-arrow-left icon"></span>Filter
                </button>
                <button className="data-card-clear-button" onClick={handleClearAll} type="button">
                  Clear all
                </button>
              </div>

              <div className="data-card-form-container">
                <div className="data-card-form">
                  <label htmlFor="gene-id">Search by Gene ID</label>
                  <input
                    type="text"
                    id="gene-id"
                    name="gene-id"
                    value={searchInput}
                    placeholder="Search by Gene ID"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />

                  <FilterDropdown
                    label="By model system"
                    studiesData={filteredData}
                    contentType={"model_organ_systems"}
                    inputList={selectedModelSystem}
                    updateInputList={handleSelectedModelSystem}
                  />
                  <FilterDropdown
                    label="By cell line"
                    studiesData={filteredData}
                    contentType={"cell_line_names"}
                    inputList={selectedCellLines}
                    updateInputList={handleSelectedCellLine}
                  />
                  <FilterDropdown
                    label="By assay"
                    studiesData={filteredData}
                    contentType={"readout_assay"}
                    inputList={selectedAssay}
                    updateInputList={handleSelectedAssayInput}
                  />
                  <FilterDropdown
                    label="By perturbation type"
                    studiesData={filteredData}
                    contentType={"perturbation_type"}
                    inputList={selectedPerturbationType}
                    updateInputList={handleSelectedPerturbationType}
                  />
                  <FilterDropdown
                    label="By center"
                    studiesData={filteredData}
                    contentType={"institute"}
                    inputList={selectedCenters}
                    updateInputList={handleSelectedCenterInput}
                  />

                  <div>
                    <FilterTags tags={selectedModelSystem} updateTags={handleSelectedModelSystem} />
                    <FilterTags tags={selectedCellLines} updateTags={handleSelectedCellLine} />
                    <FilterTags tags={selectedAssay} updateTags={handleSelectedAssayInput} />
                    <FilterTags tags={selectedPerturbationType} updateTags={handleSelectedPerturbationType} />
                    <FilterTags tags={selectedCenters} updateTags={handleSelectedCenterInput} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="data-card-table-container">
          <h3>{filteredData.length} of {totalCount} studies shown</h3>

          <table className="data-card-table">
            <colgroup>
              <col style={{ width: "36px" }} />   {/* icon */}
              <col style={{ width: "27%" }} />    {/* study title */}
              <col style={{ width: "16%" }} />    {/* study label */}
              <col style={{ width: "10%" }} />    {/* target genes */}
              <col style={{ width: "10%" }} />    {/* model system */}
              <col style={{ width: "7%" }} />    {/* cell line */}
              <col style={{ width: "7%" }} />    {/* assay */}
              <col style={{ width: "10%" }} />    {/* perturbation */}
              <col style={{ width: "100px" }} />  {/* downloads */}
            </colgroup>

            <thead className="data-card-table-heading">
            <tr>
              <th scope="col" aria-label="icon"></th>
              <th scope="col" className="bold">study title</th>
              <th scope="col">study label</th>
              <th scope="col">target genes</th>
              <th scope="col">model system</th>
              <th scope="col">cell line</th>
              <th scope="col">assay</th>
              <th scope="col">perturbation type</th>
              {/*<th scope="col" aria-label="downloads"></th>*/}
            </tr>
            </thead>

            <tbody>
            {filteredData.map((data, index) => {
              const targetGenes = data.content?.target_genes ?? [];
              const hasExtra = targetGenes.length > 1;
              const title = data.content?.study_title;
              if (!title) return null;

              const datasetId = encodeURIComponent(data.id ?? "");

              // use helper to make it user-friendly
              const formatLabel = (label) => label?.replaceAll("_", " ") ?? label;

              const shortLabel = formatLabel(data.content?.label?.trim()) || "—";
              const isRequested = requestedLabel && shortLabel === requestedLabel;

              return (
                <tr
                  key={`content_item_${data.id || index}`}
                  id={`study-row-${shortLabel}`}
                  className={isRequested ? "row-flash-highlight" : ""}
                  style={isRequested ? { outline: "2px solid #f5c518", background: "#fffbe6" } : undefined}
                >
                  <td><span className="icon-triple-squares icon"></span></td>

                  <td className="bold">
                    <div title={title} className="data-text">
                      <Link to={`/dataset/${datasetId}`}>{title}</Link>
                    </div>
                  </td>

                  <td className="label">
                    <div className="data-text">{shortLabel}</div>
                  </td>

                  <td>
                    <div className="data-text">{targetGenes[0] ?? "—"}</div>
                    {hasExtra && (
                      <div className="gene-count" onClick={() => setGeneListId(index)}>
                        <span aria-hidden className="icon-plus-circle"></span> {targetGenes.length - 1} more
                        {geneListId === index ? (() => {
                          const COL_THRESHOLD = 7;
                          const desiredCols = Math.min(3, Math.ceil((targetGenes?.length || 0) / COL_THRESHOLD)) || 1;

                          const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
                          const maxColsByViewport = vw >= 700 ? 3 : vw >= 480 ? 2 : 1;
                          const colCount = Math.min(desiredCols, maxColsByViewport);

                          // Figma geometry
                          const COLUMN_START_GAP = 20;
                          const COLUMN_STRIDE    = 150;
                          const COLUMN_WIDTH     = COLUMN_STRIDE - COLUMN_START_GAP;

                          const PANEL_MAX_PX = 620; // safety

                          return (
                            <figure
                              className="expanded-gene-list expanded-gene-grid"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                padding: "12px 12px 8px 20px",
                                width: "max-content",
                                maxWidth: `min(${PANEL_MAX_PX}px, calc(100vw - 32px))`,
                                maxHeight: "min(360px, 60vh)",
                                overflowY: "auto",
                                overflowX: "hidden",
                                left: "50%",
                                transform: "translateX(-50%)",
                                border: "none",
                                boxShadow: "none",
                              }}
                            >
                              <button
                                className="gene-list-exit"
                                aria-label="Close list"
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setGeneListId(-1); }}
                                style={{ background: "transparent", border: "none", padding: 0 }}
                              >
                                <span className="icon-x icon"></span>
                              </button>

                              <div className="gene-grid-header">
                                <span className="gene-grid-count">{targetGenes.length} genes</span>
                              </div>
                              <div className="gene-grid-divider" aria-hidden="true"></div>

                              <div
                                className="gene-grid"
                                role="list"
                                aria-label="All target genes"
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: `repeat(${colCount}, ${COLUMN_WIDTH}px)`,
                                  columnGap: COLUMN_START_GAP,
                                  rowGap: 0,
                                  gridAutoRows: "30px",
                                  marginTop: 0,
                                  paddingRight: 6,
                                }}
                              >
                                {targetGenes.map((gene, i) => {
                                  const hgnc = targetGenesMap[gene] ?? "";
                                  return (
                                    <Link
                                      key={`list_item_${i}`}
                                      to={`/genes/${hgnc}`}
                                      className="gene-grid-item gene-link"
                                      role="listitem"
                                      title={gene}
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: "22px 1fr", // icon + text (text starts at +22px)
                                        alignItems: "center",
                                        padding: 0,
                                        border: "none",
                                        background: "transparent",
                                        color: "#111827",
                                        fontSize: 13,
                                        lineHeight: 1.2,
                                        width: "100%",
                                      }}
                                    >
              <span className="gene-grid-icon" style={{ lineHeight: 0 }}>
                <GeneIcon />
              </span>
                                      <span className="gene-grid-text">{gene}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </figure>
                          );
                        })() : null}

                      </div>
                    )}
                  </td>

                  <td>
                    {(Array.isArray(data.content?.model_organ_systems)
                        ? data.content?.model_organ_systems
                        : [data.content?.model_organ_systems]
                    )
                      .filter(Boolean)
                      .map((v, i) => (
                        <div key={i} className="data-text">{v}</div>
                      ))}
                  </td>

                  <td>
                    {(Array.isArray(data.content?.cell_line_names)
                        ? data.content?.cell_line_names
                        : [data.content?.cell_line_names]
                    )
                      .filter(Boolean)
                      .map((v, i) => (
                        <div key={i} className="data-text">{v}</div>
                      ))}
                  </td>

                  <td><div className="data-text">{data.content?.readout_assay || "—"}</div></td>
                  <td><div className="data-text">{data.content?.perturbation_type || "—"}</div></td>

                  <td>
                    <div className="data-download-text">
                      <button
                        className={`data-gene-link ${geneListId === "download" + index ? "active-data-button" : ""}`}
                        onClick={() => setGeneListId("download" + index)}
                        type="button"
                      >
                        Download ↓
                      </button>
                      {geneListId === "download" + index && (
                        <Download
                          key={`download_dataset_${index}`}
                          setGeneListId={setGeneListId}
                          data={data.accessions}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}
