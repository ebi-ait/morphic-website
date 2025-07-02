import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { withPrefix } from "gatsby";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import cover from "../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png";
import { Seo } from "../utils/SEO";
import FilterDropdown from "../components/DataTrackerFilters/FilterDropdown";
import FilterTags from "../components/DataTrackerFilters/FilterTags";

/* ---------- column map & row remapper ---------- */
const COLUMN_MAP = {
  "Clone ID": "cloneId",
  Gene: "targetGene",
  "Parental Cell Line": "cellLine",
  Variant: "strategy",
  Center: "center",
};
const remapRow = (row) =>
  Object.fromEntries(
    Object.entries(COLUMN_MAP).map(([k, v]) => [v, row[k]?.trim() ?? ""])
  );

/* ---------- page layout wrapper ---------- */
function Layout({ children }) {
  return (
    <div>
      <div className="header-inline header-gradient">
        <img className="header-image" src={cover} alt="" />
        <div className="header-position-top">
          <Navbar />
        </div>
        <div className="header-position-bottom header-triangle" />
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

/* ---------- main page ---------- */
export default function OrderCellLines() {
  /* raw data */
  const [cellLines, setCellLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* filter-drawer toggle */
  const [collapse, setCollapse] = useState(false);

  /* filter state */
  const [geneQuery, setGeneQuery] = useState("");
  const [selectedStrategies, setSelectedStrategies] = useState(new Set());
  const [selectedCellLines, setSelectedCellLines] = useState(new Set());
  const [selectedCenters, setSelectedCenters] = useState(new Set());

  /* -------------------------------- fetch TSV once -------------------------------- */
  useEffect(() => {
    fetch(withPrefix("/cell_lines.tsv"))
      .then((r) => {
        if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
        return r.text();
      })
      .then((txt) => {
        const { data } = Papa.parse(txt, {
          header: true,
          delimiter: "\t",
          skipEmptyLines: true,
        });
        setCellLines(data.map(remapRow));
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  /* -------------------------------- derived list -------------------------------- */
  const filteredLines = useMemo(() => {
    if (!cellLines.length) return [];
    let res = [...cellLines];

    if (geneQuery.trim()) {
      const q = geneQuery.trim().toUpperCase();
      res = res.filter((r) => r.targetGene.toUpperCase().includes(q));
    }
    if (selectedStrategies.size) {
      res = res.filter((r) => selectedStrategies.has(r.strategy));
    }
    if (selectedCellLines.size) {
      res = res.filter((r) => selectedCellLines.has(r.cellLine));
    }
    if (selectedCenters.size) {
      res = res.filter((r) => selectedCenters.has(r.center));
    }
    return res;
  }, [cellLines, geneQuery, selectedStrategies, selectedCellLines, selectedCenters]);

  /* -------------------------------- helpers -------------------------------- */
  const toggleInSet = (value, setState) =>
    setState((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });

  const handleSelectedStrategies = (v) => toggleInSet(v, setSelectedStrategies);
  const handleSelectedCellLine = (v) => toggleInSet(v, setSelectedCellLines);
  const handleSelectedCenter = (v) => toggleInSet(v, setSelectedCenters);

  const handleClearAll = () => {
    setGeneQuery("");
    setSelectedStrategies(new Set());
    setSelectedCellLines(new Set());
    setSelectedCenters(new Set());
  };

  /* -------------------------------- render -------------------------------- */
  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <Layout>
      {/* ---------- header ---------- */}
      <div className="data-card-header">
        <div className="data-card-header-container">
          <span aria-hidden className="data-card-header-icon icon-data-tracker" />
          <div>
            <h1 className="order-cell-lines dc-heading">Order clonal cell lines</h1>
            <p className="">
              Gene perturbation cell lines from the MorPhiC Data Production Centers are available for ordering and research by the wider scientific community.
            </p>
            <p>
              Search through the knockout cell lines below and send an enquiry for the gene you’re interested in.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="data-card-body">
        {/* collapsible drawer toggle */}
        {collapse ? (
          <div className="data-card-filter data-card-filter-collapsed">
            <button
              className="data-card-filter-button data-card-filter-button-collapse"
              onClick={() => setCollapse((p) => !p)}
            >
              <span className="icon-arrow-right icon" />
              <span className="text-rotate">Filter</span>
            </button>
          </div>
        ) : (
          <div className="data-card-filter">
            {/* top-row buttons */}
            <div className="data-card-button-group">
              <button
                className="data-card-filter-button"
                onClick={() => setCollapse((p) => !p)}
              >
                <span className="icon-arrow-left icon" />
                Filter
              </button>
              <button className="data-card-clear-button" onClick={handleClearAll}>
                Clear all
              </button>
            </div>

            {/* filter controls */}
            <div className="data-card-form-container">
              <div className="data-card-form">
                {/* gene search */}
                <label htmlFor="gene-search">Search by Gene</label>
                <input
                  type="text"
                  id="gene-search"
                  placeholder="Search by Gene"
                  value={geneQuery}
                  onChange={(e) => setGeneQuery(e.target.value)}
                />

                {/* dropdowns */}
                <FilterDropdown
                  label="By perturbation strategy"
                  studiesData={cellLines}
                  contentType="strategy"
                  inputList={selectedStrategies}
                  updateInputList={handleSelectedStrategies}
                />
                <FilterDropdown
                  label="By cell line"
                  studiesData={cellLines}
                  contentType="cellLine"
                  inputList={selectedCellLines}
                  updateInputList={handleSelectedCellLine}
                />
                <FilterDropdown
                  label="By center"
                  studiesData={cellLines}
                  contentType="center"
                  inputList={selectedCenters}
                  updateInputList={handleSelectedCenter}
                />

                {/* tag chips */}
                <div>
                  <FilterTags
                    tags={selectedStrategies}
                    updateTags={handleSelectedStrategies}
                  />
                  <FilterTags
                    tags={selectedCellLines}
                    updateTags={handleSelectedCellLine}
                  />
                  <FilterTags
                    tags={selectedCenters}
                    updateTags={handleSelectedCenter}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* result count & table */}
        <div className="data-card-table-container">
          <h3 className="order-cell-lines sub-heading">
            {`${filteredLines.length} cell lines shown`}
          </h3>

          <table className="data-card-table">
            <thead className="order-cell-lines grey">
              <tr className="order-cell-lines border">
                <th style={{ width: "4rem" }} />
                <th className="order-cell-lines black less-wide">
                  <span className="order-cell-lines filter-icon bold" />
                  Clone ID
                </th>
                <th>Target Gene</th>
                <th>Cell Line</th>
                <th>Perturbation Strategy</th>
                <th>Center</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredLines.map((row) => (
                <tr key={row.cloneId} className="data-card-table-row">
                  <td />
                  <td className="order-cell-lines bold">
                    <span className="order-cell-lines checkbox-circle" />
                    {row.cloneId}
                  </td>
                  <td>{row.targetGene}</td>
                  <td>{row.cellLine}</td>
                  <td>{row.strategy}</td>
                  <td>{row.center}</td>
                  <td className="order-cell-lines button-wide">
                    <a
                      href={`mailto:bill.skarnes@jax.org?subject=Clonal%20cell%20line%20enquiry:%20${encodeURIComponent(
                        row.cloneId
                      )}`}
                      className="send-enquiry-btn button button-blue wide-button"
                    >
                      Send enquiry
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export function Head() {
  return (
    <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />
  );
}
