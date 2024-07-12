import React from "react"
import Navbar from "../components/Navbar"

export default function Gene() {
  return (
    <div className="about gene-page">
        <div>
            <Navbar />
            <div className="policies-triangle"></div>
        </div>
        <div className="gene-container">
            <div className="gene-menu">
                <div className="gene-menu-card">
                    <h1 className="gene-menu-title">gene: pax6</h1>
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
                                <h1>Gene: Pax6</h1>
                            </div>
                            <div className="gene-card-header-row">
                                <div className="gene-card-header-link">Study the gene list</div>
                                <div className="gene-card-header-link">Order Alleles</div>
                            </div>
                        </div>
                        <div className="gene-card-row gene-card-border-bottom">
                            <div className="gene-card-body">
                                <div className="gene-card-body-row">
                                    <p className="gene-card-body-bold-text">HGNC ID:8620</p>
                                    <p className="gene-card-body-bold-text">ENSG00000007372</p>
                                </div>
                                <dl className="gene-card-body-dl-grid">
                                    <dt>Name</dt>
                                    <dd>Paired box 6</dd>

                                    <dt>Synonyms</dt>
                                    <dd>Gsfaey11, Pax-6, Dey, AEY11, 1500038E17Rik, Dickie's small eye</dd>

                                    <dt>Protein class</dt>
                                    <dd>PAIRED BOX PROTEIN PAX-6-RELATED</dd>
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
                                    <dd>YES</dd>

                                    <dt>Profiled by</dt>
                                    <dd>JAX</dd>

                                    <dt>Assay types</dt>
                                    <dd>scRNAseq, perturbSEQ, bulkRNAseq</dd>

                                    <dt>Analysis</dt>
                                    <dd>Fred Hutch, JAX</dd>

                                    <dt>Status</dt>
                                    <dd>ASSAYED, ANALYSED</dd>
                                </dl>
                            </div>
                        </div>
                        <div className="gene-card-body">
                            <div>
                                <h2 className="gene-card-body-title">Phenotype evidence</h2>
                                <div className="gene-card-row-gap">
                                    <div className="gene-card-phenotype-data">
                                        <h3 className="gene-card-body-subtitle">Human</h3>
                                        <p className="bold">OMIM:607108</p>
                                        <p>Coloboma of optic nerve 120430AD3</p>
                                        <p>Morning glory disc anomaly 120430AD3</p>
                                        <p>Aniridia 106210AD3</p>
                                        <p>Anterior segment dysgenesis 5, multiple subtypes 604229AD3</p>
                                        <p>Cataract with late-onset corneal dystrophy 106210</p>
                                        <p>Foveal hypoplasia 1</p>
                                        <p className="bold">Human Phenotype Ontology: 5080</p>
                                    </div>
                                    <div className="gene-card-phenotype-data">
                                        <h3>Mouse</h3>
                                        <div className="gene-card-body-row bold">
                                            <p>MGI:97490</p>
                                            <p>Ortholog relation:1:1</p>
                                        </div>
                                        <p><b>MGI Phenotypes:</b></p>
                                        <p>188 phenotypes from 42 alleles in 45 genetic backgrounds<br></br>
                                            46 phenotypes from multigenic genotypes<br></br>
                                            367 phenotype references MGI
                                        </p>
                                        <p><b>MGI Viability:</b> Lethal</p>
                                        <p><b>IMPC Phenotypes:</b> 18</p>
                                        <p><b>IMPC Viability:</b> Lethal</p>
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
        <title>Study Tracker</title>
        <link id="icon" rel="icon" href="favicon.svg" />
      </>
    )
}
