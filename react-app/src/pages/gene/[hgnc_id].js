import React from "react"
import Navbar from "../../components/Navbar"

export async function getServerData({ params }) {
  try {
    const res = await fetch(`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/gene/${params.hgnc_id}`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const geneData = await res.json();
    console.log("geneData.Phenotype_Evidence.Human.OMIM: ", geneData.Phenotype_Evidence.Human.OMIM);
    return {
      props: { geneData },
    };
  } catch (error) {
    return {
      props: {},
      status: 500,
    };
  }
}

export default function Gene({ serverData: { geneData } }) {
  if (!geneData) {
    return <p>Gene not found</p>;
  }
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
                        <li>
                            <a href="#" className="gene-menu-link">Gene Expression Analysis</a>
                        </li>
                        <li>
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
                        </li>
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
                            <div className="gene-card-header-row">
                                <div className="gene-card-header-link">Study the gene list</div>
                                <div className="gene-card-header-link">Order Alleles</div>
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

                                    {/*<dt>Synonyms</dt>
                                    <dd>{geneData.Synonyms.join(', ')}</dd>*/}

                                    <dt>Protein class</dt>
                                    <dd>{geneData.Protein_Class}</dd>
                                </dl>
                                <div className="gene-card-body-row">
                                    <div className="gene-card-body-link uppercase text-orange">GO MF</div>
                                    <div className="gene-card-body-link uppercase text-orange">GO BO</div>
                                    <div className="gene-card-body-link uppercase text-orange">GO CC</div>
                                    <div className="gene-card-body-link uppercase text-orange">REACTOME PATHWAYS</div>
                                </div>
                            </div>
                            <div className="gene-card-body gene-card-summary">
                                <h2 className="gene-card-summary-title">MorPhiC summary</h2>
                                <dl className="gene-card-body-dl-grid">
                                    <dt>Studied by MorPhic</dt>
                                    <dd></dd>

                                    <dt>Profiled by</dt>
                                    <dd></dd>

                                    <dt>Assay types</dt>
                                    <dd></dd>

                                    <dt>Analysis</dt>
                                    <dd></dd>

                                    <dt>Status</dt>
                                    <dd></dd>
                                </dl>
                            </div>
                        </div>
                        <div className="gene-card-body">
                            <div>
                                <h2 className="gene-card-body-title">Phenotype evidence</h2>
                                <div className="gene-card-row-gap">
                                    <div className="gene-card-phenotype-data">
                                        <h3 className="gene-card-body-subtitle">Human</h3>
                                        <p className="bold">Phenotypes:</p>
                                        <p>{geneData?.Phenotype_Evidence?.Human?.Phenotypes?.[0]?.description || "N/A"}</p>
                                        <p className="bold">OMIM:</p>
                                        <p>{geneData?.Phenotype_Evidence?.Human?.OMIM || "N/A"}</p>
                                        {/*<p className="bold">Human Phenotype Ontology: 5080</p>*/}
                                    </div>
                                    <div className="gene-card-phenotype-data">
                                        <h3>Mouse</h3>
                                        <div className="gene-card-body-row bold">
                                            <p>MGI:{geneData?.Phenotype_Evidence?.Mouse?.MGI_ID || "N/A"}</p>
                                            <p>Ortholog relation:{geneData?.Phenotype_Evidence?.Mouse?.Ortholog_relation || "N/A"}</p>
                                        </div>
                                        {/*<p><b>MGI Phenotypes:</b></p>
                                        <p>188 phenotypes from 42 alleles in 45 genetic backgrounds<br></br>
                                            46 phenotypes from multigenic genotypes<br></br>
                                            367 phenotype references MGI
                                        </p>*/}
                                        <p><b>Homozygote Phenotypes:</b> {geneData?.Phenotype_Evidence?.Mouse?.Homozygote_Phenotypes || "N/A"}</p>
                                        <p><b>Heterozygote Phenotypes:</b> {geneData?.Phenotype_Evidence?.Mouse?.Heterozygote_Phenotypes || "N/A"}</p>
                                        <p><b>IMPC Viability:</b> {geneData?.Phenotype_Evidence?.Mouse?.IMPC_Viability || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="gene-section-header">
                        <h1 className="gene-section-title">MorPhiC Analysis Results</h1>
                        <a href="#" className="gene-section-link">↑ Back to top</a>
                    </div>
                    <div className="gene-card">
                        <div className="gene-card-header">
                            <h2>Gene expression analysis</h2>
                            <div className="gene-card-header-row">
                                <div class="gene-card-header-link">Download XLS</div>
                                <div class="gene-card-header-link">Download TSV</div>
                            </div>
                        </div>
                        <div className="gene-card-body">
                            <div className="gene-card-img-placeholder"></div>
                        </div>
                        <div className="gene-card-body">
                            <h3>Data resources</h3>
                            <div className="gene-card-row">
                                <div className="gene-card-group">
                                    <div className="gene-card-icon-placeholder"></div>
                                    <div>
                                        <h4>Perturbseq Dataset1</h4>
                                        <p>knockout of PAX6</p>
                                        <div className="gene-card-group-link">View dataset</div>
                                    </div>
                                </div>
                                <div className="gene-card-group">
                                    <div className="gene-card-icon-placeholder"></div>
                                    <div>
                                        <h4>Perturbseq Dataset1</h4>
                                        <p>knockout of PAX6</p>
                                        <div className="gene-card-group-link">View dataset</div>
                                    </div>
                                </div>
                                <div className="gene-card-group">
                                    <div className="gene-card-icon-placeholder"></div>
                                    <div>
                                        <h4>Perturbseq Dataset1</h4>
                                        <p>knockout of PAX6</p>
                                        <div className="gene-card-group-link">View dataset</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
  )
}

export function Head() {
    return (
      <>
        <title>MorPhiC program: Molecular Phenotypes of Null Alleles in Cells</title>
        <link id="icon" rel="icon" href="favicon.svg" />
      </>
    )
}