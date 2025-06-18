import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import cover from "../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png"
import { Seo } from "../utils/SEO";

/**
 * Page: /order-cell-lines
 * -----------------------------------------------------------------------------
 * Mirrors the look‑and‑feel of the existing **Data Catalogue** page by using the
 * *same* structural class names that appear in `data.js` (e.g. `data-card-body`,
 * `data-card-table`, etc.).  No new CSS frameworks are introduced so we inherit
 * all visual styling that is already defined in the project’s SCSS.
 *
 * NOTE ──  All data are static placeholders in this first cut. We’ll swap the
 *          `CELL_LINES` array for an API call and wire up pagination later.
 * ---------------------------------------------------------------------------*/

// ─── Stub rows ────────────────────────────────────────────────────────────────
const CELL_LINES = [
  {
    cloneId: "CL-KOLF-222-PTC-001",
    targetGene: "PAX‑6",
    cellLine: "KOLF 2.2",
    strategy: "Premature termination codon (PTC)",
    centre: "JAX",
  },
  {
    cloneId: "CL-KOLF-222-CE-002",
    targetGene: "PAX‑6",
    cellLine: "KOLF 2.2",
    strategy: "Critical exon deletion (CE)",
    centre: "JAX",
  },
  {
    cloneId: "CL-WIBJ-KO-003",
    targetGene: "PAX‑6",
    cellLine: "WIBJ",
    strategy: "Knock‑out – gene deletion (KO)",
    centre: "JAX",
  },
  {
    cloneId: "CL-KOLF-222-CE-004",
    targetGene: "PAX‑6",
    cellLine: "KOLF 2.2",
    strategy: "Critical exon deletion (CE)",
    centre: "JAX",
  },
  {
    cloneId: "CL-KOLF-222-CE-005",
    targetGene: "PAX‑6",
    cellLine: "KOLF 2.2",
    strategy: "Critical exon deletion (CE)",
    centre: "JAX",
  },
];

// ─── Shared Layout component (same as in data.js) ────────────────────────────
function Layout({ children }) {
  return (
        <div>
            <div className="header-inline header-gradient">
                <img className="header-image" src={cover} alt=""></img>
                <div className="header-position-top">
                    <Navbar />
                </div>
                <div className="header-position-bottom header-triangle"></div>
            </div>
            <div className="data-container">
                <div className="data-content">
                    <div className="data-card">
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

// ─── OrderCellLines page component ───────────────────────────────────────────
export default function OrderCellLines() {

  const [collapse, setCollapse] = useState(false);
  const handleCollapse = () => {
      setCollapse(!collapse);
  }

  const handleClearAll = () => {

  }
  /* Track which rows are selected so we can add bulk‑actions later. */
  const [selected, setSelected] = useState([]);
  const toggleRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="data-card-header">
          <div className="data-card-header-container">
              <span aria-hidden className="data-card-header-icon icon-data-tracker"></span>
              <div>
                  <h1 className="dc-heading">Order clonal cell lines</h1>
                  <p>MorPhiC Data production have the first gene perturbation cell lines
              available for ordering and research. Search through the list below
              and send your enquiry for a gene you’re interested in.</p>
              </div>
          </div>
      </div>
      <div className="data-card-body">
        {collapse && (
          <div className="data-card-filter data-card-filter-collapsed">
              <button className="data-card-filter-button data-card-filter-button-collapse" onClick={() => setCollapse((prev) => !prev)}>
                  <span className="icon-arrow-right icon"></span>
                  <span className="text-rotate">Filter</span>
              </button>
          </div>
          )}
          {!collapse && (<>
          <div className="data-card-filter">
              <div className="data-card-button-group">
                  <button className="data-card-filter-button" onClick={() => setCollapse((prev) => !prev)}><span className="icon-arrow-left icon"></span>Filter</button>
                  <button className="data-card-clear-button" onClick={handleClearAll}>Clear all</button>
              </div>
              <div className="data-card-form-container">
                  <div className="data-card-form">

                  </div> 
              </div>
          </div>
          </>)}
          <div className="data-card-table-container">
            <h3> cell lines shown</h3>
            <table className="data-card-table">
              <tr className="data-card-table-heading">
                <th></th>
                <th>Clone ID</th>
                <th>Target Gene</th>
                <th>Cell Line</th>
                <th>Perturbation Strategy</th>
                <th>Centre</th>
                <th></th>
              </tr>
              <tbody>
                {CELL_LINES.map((row, i) => (
                  <tr
                    key={row.cloneId}
                    className="data-card-table-row"
                  >
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.cloneId}`}
                        checked={selected.includes(row.cloneId)}
                        onChange={() => toggleRow(row.cloneId)}
                      />
                    </td>
                    <td>{row.cloneId}</td>
                    <td>{row.targetGene}</td>
                    <td>{row.cellLine}</td>
                    <td>{row.strategy}</td>
                    <td>{row.centre}</td>
                    <td>
                      <a
                        href={`mailto:morphic@ebi.ac.uk?subject=Clonal%20cell%20line%20enquiry:%20${encodeURIComponent(
                          row.cloneId
                        )}`}
                        className="send-enquiry-btn"
                      >
                        Send enquiry
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

              {/* Pagination placeholder */}
              <div className="data-card-pagination">
                <span>Showing 1–15 of 30</span>
                <nav>
                  <button disabled>Previous</button>
                  <button disabled>Next</button>
                </nav>
              </div>
          </div>  
          </div>
    </Layout>
  );
}

// ─── SEO ---------------------------------------------------------------------
export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}
