import { StaticImage } from "gatsby-plugin-image";
import React, { useState } from "react"

export default function FAQ() {
  const [faqNumber, setFaqNumber] = useState(0);

  function handleFaq1() {
    setFaqNumber((faqNumber === 1 ? 0 : 1));
  }
  function handleFaq2() {
    setFaqNumber((faqNumber === 2 ? 0 : 2));
  }
  function handleFaq3() {
    setFaqNumber((faqNumber === 3 ? 0 : 3));
  }
  function handleFaq4() {
    setFaqNumber((faqNumber === 4 ? 0 : 4));
  }

  return (
    <>
        <section className="home-questions-section" id="faq">
            <div className="home-questions-triangle"></div>

            <div className="home-questions-container">
                <div className="home-questions-content">
                    <h3>Frequently asked questions</h3>
                    <ul>
                        <li>
                            <button onClick={handleFaq1}>
                              {faqNumber === 1 ?
                                <StaticImage
                                  src="../images/external/polygon21571-1aur.svg"
                                  alt="Dropdown arrow to close"
                                  className="dropdown-arrow"
                                />
                              :
                                <StaticImage
                                  src="../images/external/polygon11571-ri2.svg"
                                  alt="Dropdown arrow to open"
                                  className="dropdown-arrow"
                                />
                              }
                              <h4>What is the goal of the MorPhiC project?</h4>
                            </button>
                            {faqNumber === 1 && <p>
                                MorPhiC stands for Molecular Phenotypes of Null Alleles in Cells. MorPhiC is a collaborative research project that aims to functionally characterize all protein-coding human genes. The project focuses on developing a catalog of molecular and cellular phenotypes for null alleles for every protein-coding human gene. The ultimate goal is to provide a comprehensive understanding of the biological function of each human gene, filling the knowledge gap for the majority of genes that are currently underrepresented in scientific literature.
                            </p>}
                        </li>
                        <li>
                            <button onClick={handleFaq2}>
                              {faqNumber === 2 ?
                                <StaticImage
                                  src="../images/external/polygon21571-1aur.svg"
                                  alt="Dropdown arrow to close"
                                  className="dropdown-arrow"
                                />
                              :
                                <StaticImage
                                  src="../images/external/polygon11571-ri2.svg"
                                  alt="Dropdown arrow to open"
                                  className="dropdown-arrow"
                                />
                              }
                              <h4>How was the gene list for the MorPhic project chosen? </h4>
                            </button>
                            {faqNumber === 2 && <p>
                            To prioritize gene targets, the MorPhiC consortium considers a set of genes involved in critical cellular and organismal functions, including essential genes, transcription factors, developmental regulators, and disease-associated genes. 
                            <a href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer"> Full list of genes to be studied under MorPhic.</a>
                            </p>}
                        </li>
                        <li>
                            <button onClick={handleFaq3}>
                              {faqNumber === 3 ?
                                <StaticImage
                                  src="../images/external/polygon21571-1aur.svg"
                                  alt="Dropdown arrow to close"
                                  className="dropdown-arrow"
                                />
                              :
                                <StaticImage
                                  src="../images/external/polygon11571-ri2.svg"
                                  alt="Dropdown arrow to open"
                                  className="dropdown-arrow"
                                />
                              }
                              <h4>What is a null allele?</h4>
                            </button>
                            {faqNumber === 3 && <p>
                                Within the MorPhiC project, null alleles are defined as genes with less than 10% of the normal level of functional protein.
                            </p>}
                        </li>
                        <li>
                            <button onClick={handleFaq4}>
                              {faqNumber === 4 ?
                                <StaticImage
                                  src="../images/external/polygon21571-1aur.svg"
                                  alt="Dropdown arrow to close"
                                  className="dropdown-arrow"
                                />
                              :
                                <StaticImage
                                  src="../images/external/polygon11571-ri2.svg"
                                  alt="Dropdown arrow to open"
                                  className="dropdown-arrow"
                                />
                              }
                            <h4>Who are the participants in the MorPhiC project?</h4>
                            </button>
                            {faqNumber === 4 && <p>
                                The MorPhiC consortium consists of four Data Production Centers (DPCs), one Data Resource and Administrative Coordinating Center (DRACC), and three Data Analysis and Validation Centers (DAVs). The four DPCs are: The Jackson Laboratory (JAX), Memorial Sloan Kettering Cancer Center (MSK), Northwestern University (NWU), and University of California San Francisco (UCSF). The DRACC is composed of members from University of Miami (UM), European Bioinformatic Institute (EBI), University of Washington (UW), and Queen Mary University of London (QMUL). The three DAVs are: Fred Hutchinson Cancer Center (Fred-Hutch), The Jackson Laboratory (JAX), and Stanford University.
                            </p>}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </>
  )
}
