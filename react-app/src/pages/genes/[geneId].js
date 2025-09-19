import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import GenePhenotypeEvidence from "../../components/GenePhenotypeEvidence";
import MousePhenotype from "../../components/MousePhenotype";

const GenePage = ({ params }) => {
  console.log("params: ", params);
  const { geneId } = params;
  console.log("geneId: ", geneId);
  const [geneData, setGeneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side

  useEffect(() => {
    if (!geneId) return;
    const fetchGeneData = async () => {
      try {
        const response = await fetch(`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/gene/${geneId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch gene data');
        }
        const data = await response.json();
        setGeneData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneData();
  }, [geneId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!geneData) return <p>No data found for gene {geneId}</p>;
  // Extract unique title prefixes from Analysis_Results
    const uniqueTitles = Array.from(
      new Set(
        geneData.Analysis_Results
          .filter(result => result.title && result.title.includes(':'))
          .map(result => result.title.split(':')[0])
      )
    );
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
                        {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') && geneData.Analysis_Results[0] && (
                            <li>
                                <a href="#results" className="gene-menu-link">Analysis Results</a>
                            </li>
                        )}
                        {/*<li>
                            <a href="#" className="gene-menu-link">Cell Types</a>
                        </li>
                        <li>
                            <a href="#" className="gene-menu-link">Cell Types Alternative</a>
                        </li>
                        <li>
                            <a href="#" className="gene-menu-link">Cell Regulatory Networks</a>
                        </li>
                        <li>
                            <a href="#" className="gene-menu-link">Order Alleles</a>
                        </li>*/}
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
                                {/*<div className="gene-card-body-row">
                                    <div className="gene-card-body-link uppercase text-orange">GO MF</div>
                                    <div className="gene-card-body-link uppercase text-orange">GO BO</div>
                                    <div className="gene-card-body-link uppercase text-orange">GO CC</div>
                                    <div className="gene-card-body-link uppercase text-orange">REACTOME PATHWAYS</div>
                                </div>*/}
                            </div>
                            <div className="gene-card-body gene-card-summary">
                                <h2 className="gene-card-summary-title">MorPhiC summary</h2>
                                {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') && (
                                    <dl className="gene-card-body-dl-grid">
                                        <dt>Studied by MorPhic</dt>
                                        <dd>YES</dd>

                                        <dt>DPC</dt>
                                        <dd>The Jackson Laboratory (JAX)</dd>

                                        <dt>Readout assay type</dt>
                                        <dd>RNA-seq</dd>

                                        <dt>Analysis</dt>
                                        <dd>Fred Hutch Cancer Center</dd>
                                    </dl>
                                )}
                                {geneData.tags && Array.isArray(geneData.tags) && !geneData.tags.includes('release-1') && (
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
                                        {/*<p>{geneData?.Phenotype_Evidence?.Human?.Phenotypes?.[0]?.description || "N/A"}</p>
                                        <p className="bold">OMIM:</p>*/}
                                        <GenePhenotypeEvidence geneData={geneData} />
                                        {/*<p>{geneData?.Phenotype_Evidence?.Human?.OMIM || "N/A"}</p>
                                        <p className="bold">Human Phenotype Ontology: 5080</p>*/}
                                    </div>
                                    <div className="gene-card-phenotype-data">
                                        <h3>Mouse</h3>
                                        <div className="gene-card-body-row">
                                            {/*<p>MGI:{geneData?.Phenotype_Evidence?.Mouse?.MGI_ID || "N/A"}</p>*/}
                                            <p>Ortholog relation: {geneData?.Phenotype_Evidence?.Mouse?.MGI_ID || "N/A"}</p>
                                        </div>
                                        <MousePhenotype mouseData={geneData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') && geneData.Analysis_Results[0] && (
                    <section id="results">
                        <div className="gene-section-header">
                            <h1 className="gene-section-title">Analysis Results</h1>
                            <a href="#" className="gene-section-link">↑ Back to top</a>
                        </div>
                        <div className="gene-card">
                            <div className="gene-card-header">
                                <h2>Gene expression analysis</h2>
                                {/*<div className="gene-card-header-row">
                                    <div className="gene-card-header-link">Download XLS</div>
                                </div>*/}
                            </div>
                            <div className="gene-card-body">
                              <div className="gene-grid">
                                {geneData.Analysis_Results.map((analysis, index) => (
                                  <div className="gene-card-img-placeholder" key={index}>

                                    <div className="title-button-container">
                                      <div className="svg-title">{analysis.title}</div>
                                      {analysis?.tsv_file_id && (
                                        <div className="gene-card-header-link download-tsv">
                                          <a
                                            href={`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/download?tsv_file_id=${encodeURIComponent(
                                              analysis.tsv_file_id
                                            )}&file_name=${encodeURIComponent(analysis.title || geneData.Name || 'download')}`}
                                          >
                                            Download TSV
                                          </a>
                                        </div>
                                      )}
                                    </div>

                                    {/* NEW: frame reserves space & caps height */}
                                    <div className="plot-frame">
                                      {analysis.svg ? (
                                        <img
                                          src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}
                                          className="img-plot"
                                          alt={analysis.title}
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      ) : analysis.png_file_id ? (
                                        <img
                                          src={`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/download/png?file_id=${encodeURIComponent(analysis.png_file_id)}`}
                                          className="img-plot"
                                          alt={analysis.title}
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      ) : (
                                        <p>No image available</p>
                                      )}
                                    </div>


                                    {/*<div className="title-button-container">*/}
                                    {/*    <div className="svg-title">{analysis.title}</div>*/}
                                    {/*    /!*<div className="gene-card-header-link download-tsv"> <a href={`http://127.0.0.1:3000//download?tsv_file_id=${analysis.tsv_file_id}&file_name=${analysis.title}`}>Download TSV </a></div>*!/*/}

                                    {/*  /!* SHOW the Download button ONLY if tsv_file_id exists *!/*/}
                                    {/*  {analysis?.tsv_file_id ? (*/}
                                    {/*    <div className="gene-card-header-link download-tsv">*/}
                                    {/*      <a*/}
                                    {/*        href={`http://127.0.0.1:3000/download?tsv_file_id=${encodeURIComponent(*/}
                                    {/*          analysis.tsv_file_id*/}
                                    {/*        )}&file_name=${encodeURIComponent(analysis.title || geneData.Name || 'download')}`}*/}
                                    {/*      >*/}
                                    {/*        Download TSV*/}
                                    {/*      </a>*/}
                                    {/*    </div>*/}
                                    {/*  ) : null}*/}
                                    {/*</div>*/}
                                    {/*{analysis.svg ? (*/}
                                    {/*  // Render SVG if available*/}
                                    {/*  <img*/}
                                    {/*    src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}*/}
                                    {/*    className="img-plot"*/}
                                    {/*    alt={analysis.title}*/}
                                    {/*  />*/}
                                    {/*) : analysis.png_file_id ? (*/}
                                    {/*  // Render PNG if SVG is not available*/}
                                    {/*  <img*/}
                                    {/*    src={`http://127.0.0.1:3000/download/png?file_id=${analysis.png_file_id}`}*/}
                                    {/*    className="img-plot"*/}
                                    {/*    alt={analysis.title}*/}
                                    {/*  />*/}
                                    {/*) : (*/}
                                    {/*  // Fallback if neither SVG nor PNG is available*/}
                                    {/*  <p>No image available</p>*/}
                                    {/*)}*/}



                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="gene-card-body">
                                <h3>Data resources</h3>
                                <div className="gene-card-row">
                                    <div className="gene-card-group">
                                        {uniqueTitles.map((title, index) => (
                                          <div key={index} className="title-group">
                                            <div className="gene-card-icon"></div>
                                            <div className="column-layout">
                                              <h4>{title}</h4>
                                              <div className="gene-card-group-link">
                                                <a href="/data">View dataset</a>
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
                    {geneData.tags && Array.isArray(geneData.tags) && geneData.tags.includes('release-1') && geneData.Enrichment_Analysis[0] && (
                    <section id="results">
                        <div className="gene-card">
                            <div className="gene-card-header">
                                <h2>Enrichment Analysis</h2>
                                {/*<div className="gene-card-header-row">
                                    <div className="gene-card-header-link">Download XLS</div>
                                </div>*/}
                            </div>
                            <div className="gene-card-body">
                              <div className="gene-grid">
                                {geneData.Enrichment_Analysis.map((analysis, index) => (
                                  <div className="gene-card-img-placeholder" key={index}>
                                    <div className="svg-title">{analysis.title}</div>
                                    {analysis.svg ? (
                                      // Render SVG if available
                                      <img
                                        src={`data:image/svg+xml;utf8,${encodeURIComponent(analysis.svg)}`}
                                        className="img-plot"
                                        alt={analysis.title}
                                      />
                                    ) : analysis.png_file_id ? (
                                      // Render PNG if SVG is not available
                                      <img
                                        src={`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/download/png?file_id=${analysis.png_file_id}`}
                                        className="img-plot"
                                        alt={analysis.title}
                                      />
                                    ) : (
                                      // Fallback if neither SVG nor PNG is available
                                      <p>No image available</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="gene-card-body">
                                <h3>Data resources</h3>
                                <div className="gene-card-row">
                                    <div className="gene-card-group">
                                        {uniqueTitles.map((title, index) => (
                                          <div key={index} className="title-group">
                                            <div className="gene-card-icon"></div>
                                            <div className="column-layout">
                                              <h4>{title}</h4>
                                              <div className="gene-card-group-link">
                                                <a href="/data">View dataset</a>
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
  )
};

export function Head() {
    return (
      <>
        <title>MorPhiC program: Molecular Phenotypes of Null Alleles in Cells</title>
        <link id="icon" rel="icon" href="/favicon.svg" />
      </>
    )
}

export default GenePage;
