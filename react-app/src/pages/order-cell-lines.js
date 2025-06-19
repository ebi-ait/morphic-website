import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import cover from "../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png";
import { Seo } from "../utils/SEO";

const COLUMN_MAP = {
  "Clone ID": "cloneId",
  "Gene": "targetGene",
  "Parental Cell Line": "cellLine",
  "Variant": "strategy",
  "Clone #": "centre",
};

function remapRow(sheetRow) {
  return Object.fromEntries(
    Object.entries(COLUMN_MAP).map(([sheetKey, propKey]) => [
      propKey,
      sheetRow[sheetKey] ?? "",
    ])
  );
}

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


export default function OrderCellLines() {
  const [cellLines, setCellLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState([]);
  const toggleRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetch("/cell_lines.tsv") // served from static/
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
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="data-card-header">
        <div className="data-card-header-container">
          <span aria-hidden className="data-card-header-icon icon-data-tracker" />
          <div>
            <h1 className="dc-heading">Order clonal cell lines</h1>
            <p>
              MorPhiC Data production have the first gene perturbation cell
              lines available for ordering and research. Search through the list
              below and send your enquiry for a gene you’re interested in.
            </p>
          </div>
        </div>
      </div>

      <div className="data-card-body">
        {/* Collapsible filter drawer – placeholder */}
        <aside className="data-card-filter data-card-filter-collapsed" />

        <div className="data-card-table-container">
          <h3>
            {loading
              ? "Loading…"
              : error
              ? "Error loading data"
              : `${cellLines.length} cell lines shown`}
          </h3>

          <table className="data-card-table">
            <thead className="data-card-table-heading">
              <tr>
                <th style={{ width: "2rem" }}>
                  {/*<input
                    type="checkbox"
                    aria-label="Select all rows"
                    disabled={loading || error}
                    checked={
                      !loading && !error && selected.length === cellLines.length
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? cellLines.map((r) => r.cloneId) : []
                      )
                    }
                  />*/}
                </th>
                <th>Clone ID</th>
                <th>Target Gene</th>
                <th>Cell Line</th>
                <th>Perturbation Strategy</th>
                <th>Centre</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7}>Loading data…</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={7} style={{ color: "red" }}>
                    {error.message}
                  </td>
                </tr>
              )}
              {!loading && !error &&
                cellLines.map((row) => (
                  <tr key={row.cloneId} className="data-card-table-row">
                    <td>
                      {/*<input
                        type="checkbox"
                        aria-label={`Select ${row.cloneId}`}
                        checked={selected.includes(row.cloneId)}
                        onChange={() => toggleRow(row.cloneId)}
                      />*/}
                    </td>
                    <td>{row.cloneId}</td>
                    <td>{row.targetGene}</td>
                    <td>{row.cellLine}</td>
                    <td>{row.strategy}</td>
                    <td>{row.centre}</td>
                    <td>
                      <a
                        href={`mailto:helpdesk@morphic.bio?subject=Clonal%20cell%20line%20enquiry:%20${encodeURIComponent(
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

          {/* Pagination placeholder
          <div className="data-card-pagination">
            <span>Showing 1–15 of 30</span>
            <nav>
              <button disabled>Previous</button>
              <button disabled>Next</button>
            </nav>
          </div>
          */}
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
