import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GenePhenotypeEvidence from "../../components/GenePhenotypeEvidence";
import MousePhenotype from "../../components/MousePhenotype";

const API_BASE = process.env.GATSBY_INGEST_API ?? "https://api.ingest.archive.morphic.bio";

// helper to make labels more user-friendly
const formatLabel = (label) => label?.replaceAll("_", " ") ?? label;

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

const GenePage = ({ params }) => {
  const { geneId } = params;

  const [geneData, setGeneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map study_label -> study id (fallback when some records lack study_id)
  const [labelToStudyId, setLabelToStudyId] = useState({});

  useEffect(() => {
    if (!geneId) return;

    (async () => {
      try {
        // Fetch gene details
        const response = await fetch(`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/gene/${encodeURIComponent(geneId)}`);
        if (!response.ok) throw new Error('Failed to fetch gene data');
        const data = await response.json();
        setGeneData(data);

        // Build label -> id map from PUBLIC studies
        try {
          const studiesRes = await fetch(
            `${API_BASE}/studies/search/findByReleaseStatus?releaseStatus=PUBLIC&page=0&size=500`
          );
          if (studiesRes.ok) {
            const studiesJson = await studiesRes.json();
            const list = studiesJson?._embedded?.studies ?? [];
            const map = {};
            for (const s of list) {
              const label = s?.content?.label?.trim();
              const id = s?.id;
              if (label && id) map[label] = id;
            }
            setLabelToStudyId(map);
          } else {
            console.warn("Could not fetch studies to build label→id map");
          }
        } catch (e) {
          console.warn("Failed to build study label → id map", e);
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

  // Resolve /dataset/:id (prefer embedded study_id; else fallback via labelToStudyId)
  // const datasetHrefForStudy = (study) => {
  //   const id = study?.id || (study?.label ? labelToStudyId[study.label] : null);
  //   return id ? `/dataset/${encodeURIComponent(id)}` : "/data";
  // };

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
              {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') && geneData.Analysis_Results?.[0] && (
                <li>
                  <a href="#results" className="gene-menu-link">Analysis Results</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="gene-content">
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
                    <p className="gene-card-body-bold-text">HGNC ID:{geneData.HGNC_ID.split(':')[1]}</p>
                    <p className="gene-card-body-bold-text">{geneData.Ensembl_Gene_ID}</p>
                  </div>
                  <dl className="gene-card-body-dl-grid">
                    <dt>{geneData.Name}</dt>
                    <dd>{geneData.Full_Name}</dd>
                    <dt>Protein class</dt>
                    <dd>{geneData.Protein_Class}</dd>
                  </dl>
                </div>
                <div className="gene-card-body gene-card-summary">
                  <h2 className="gene-card-summary-title">MorPhiC summary</h2>
                  {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') ? (
                    <dl className="gene-card-body-dl-grid">
                      <dt>Studied by MorPhic</dt><dd>YES</dd>
                      <dt>DPC</dt><dd>The Jackson Laboratory (JAX)</dd>
                      <dt>Readout assay type</dt><dd>RNA-seq</dd>
                      <dt>Analysis</dt><dd>Fred Hutch Cancer Center</dd>
                    </dl>
                  ) : (
                    <dl className="gene-card-body-dl-grid no-data">
                      <dt className="no-data">Currently no MorPhiC results are available for this Gene</dt>
                    </dl>
                  )}
                </div>
              </div>

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
                        <p>Ortholog relation: {geneData?.Phenotype_Evidence?.Mouse?.MGI_ID || "N/A"}</p>
                      </div>
                      <MousePhenotype mouseData={geneData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') && geneData.Analysis_Results?.[0] && (
            <section id="results">
              <div className="gene-section-header">
                <h1 className="gene-section-title">Analysis Results</h1>
                <a href="#" className="gene-section-link">↑&nbsp;Back to top</a>
              </div>

              <div className="gene-card">
                <div className="gene-card-header">
                  <h2>Gene expression analysis</h2>
                </div>

                <div className="gene-card-body">
                  <div className="gene-grid">
                    {geneData.Analysis_Results.map((analysis, index) => (
                      <div className="gene-card-img-placeholder" key={index}>
                        <div className="title-button-container">
                          <div className="svg-title">{analysis.title}</div>

                          {analysis?.s3_tsv_key && (
                            <div className="gene-card-header-link download-tsv">
                              <a
                                href={`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/download?tsv_file_id=${encodeURIComponent(
                                  analysis.s3_tsv_key
                                )}&file_name=${encodeURIComponent(analysis.title || geneData.Name || 'download')}`}
                              >
                                Download TSV
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="plot-frame">
                          {analysis.svg ? (
                            <img
                              src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}
                              className="img-plot"
                              alt={analysis.title}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : analysis.s3_png_key ? (
                            <img
                              src={`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/download/png?file_id=${encodeURIComponent(analysis.s3_png_key)}`}
                              className="img-plot"
                              alt={analysis.title}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <p>No image available</p>
                          )}
                        </div>
                      </div>
                    ))}
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

          {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') && geneData.Enrichment_Analysis?.[0] && (
            <section id="results">
              <div className="gene-card">
                <div className="gene-card-header">
                  <h2>Enrichment Analysis</h2>
                </div>

                <div className="gene-card-body">
                  <div className="gene-grid">
                    {geneData.Enrichment_Analysis.map((analysis, index) => (
                      <div className="gene-card-img-placeholder" key={index}>
                        <div className="svg-title">{analysis.title}</div>
                        {analysis.svg ? (
                          <img
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}
                            className="img-plot"
                            alt={analysis.title}
                          />
                        ) : analysis.s3_png_key ? (
                          <img
                            src={`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/download/png?file_id=${encodeURIComponent(analysis.s3_png_key)}`}
                            className="img-plot"
                            alt={analysis.title}
                          />
                        ) : (
                          <p>No image available</p>
                        )}
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
