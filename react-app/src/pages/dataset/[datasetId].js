import React, { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import * as style from "../../styles/dataset.module.css";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

function GeneList({ genes }) {
  // example gene list
  // const genes = ["PAX-6", "MXD1", "MEIS2", "RUNX1"];
  console.log("genes: ", genes);
  const shortList = genes.slice(0, 4);
  const expandedList = genes.slice(4);

  const [expand, setExpand] = useState(false);


  return (
    <div>
      <ul className={style.descList}>
        {shortList.map((gene, index) => (
          <li key={index}>{gene}</li>
        ))}
      </ul>

      {expandedList.length > 0 ? (
        <div className={style.geneCount} onClick={e => setExpand(true)}>
          <span aria-hidden className="icon-plus-circle"></span> {expandedList.length} more
          {expand ? (
            <figure className={style.expandedGeneList}>
              <button className={style.geneListExit} aria-label="Close list" onClick={e => { e.stopPropagation(); setExpand(false); }}>
                <span className="icon-x icon"></span>
              </button>
              <figcaption>{expandedList.length} genes</figcaption>
              <ul>
                {expandedList.map((gene, index) => (
                  <li key={index}>{gene}</li>
                ))}
              </ul>
            </figure>) : null}
        </div>
      ) : null}
    </div>
  )
}

export default function Dataset({params}) {
  console.log("params: ", params);
  const { datasetId } = params;
  console.log("datasetId: ", datasetId);

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side

  useEffect(() => {
    if (!datasetId) return;
    const fetchPageData = async () => {
      try {
        const response = await fetch(`https://api.ingest.dev.archive.morphic.bio/studies/${datasetId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch gene data');
        }
        const data = await response.json();
        console.log("data: ", data);
        setPageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [datasetId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pageData) return <p>No data found for gene {datasetId}</p>;
  // Extract unique title prefixes from Analysis_Results
    // const uniqueTitles = Array.from(
    //   new Set(
    //     geneData.Analysis_Results
    //       .filter(result => result.title && result.title.includes(':'))
    //       .map(result => result.title.split(':')[0])
    //   )
    // );

  return (
    <div className="about">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>

      <div className={style.container}>
        <div className={style.menu}>
          <div className={style.menuCard}>
            <div>
              <h1 className={style.menuTitle}>Table of Contents</h1>
            </div>
            <div>
              <ul>
                <li>
                  <a href="#" className="gene-menu-link gene-active">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#" className="gene-menu-link">
                    Data availability
                  </a>
                </li>
                <li>
                  <a href="#" className="gene-menu-link">
                    Differential expression
                  </a>
                </li>
                <li>
                  <a href="#" className="gene-menu-link">
                    Enrichment analysis
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Link to="/" className={style.buttonLink}>
            Back to results
          </Link>
        </div>

        <div className="content">
          <section className={style.section}>
            <div className={style.card}>
              <div className={`${style.cardHeader} ${style.borderBottom}`}>
                <div className={style.cardHeaderRow}>
                  <svg width="47" height="46" viewBox="0 0 47 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.4892 20.2723H30.5108C32.3987 20.2723 33.9444 18.7733 33.9444 16.9411V3.33246C33.9444 1.49897 32.3987 0 30.5108 0H16.4892C14.6 0 13.0556 1.49897 13.0556 3.33246V16.9411C13.0556 18.7733 14.6 20.2735 16.4892 20.2735V20.2723ZM19.8066 6.55089C21.8472 4.57168 25.1515 4.57295 27.1921 6.55089C29.2314 8.53009 29.2314 11.7384 27.1921 13.7188C25.1515 15.6981 21.8485 15.6981 19.8066 13.7188C17.7686 11.7384 17.7686 8.53136 19.8066 6.55089Z" fill="#1E1E1E" />
                    <path d="M17.4553 25.3419H3.43361C1.54578 25.3419 0 26.8409 0 28.6744V42.283C0 44.1152 1.54447 45.6155 3.43361 45.6155H17.4553C19.3431 45.6155 20.8889 44.1165 20.8889 42.2843V28.6757C20.8889 26.8422 19.3444 25.3419 17.4553 25.3419ZM14.1365 39.0633C12.0986 41.0425 8.7903 41.0425 6.75233 39.0633C4.71175 37.0828 4.71175 33.8733 6.75233 31.8941C8.7903 29.9149 12.0986 29.9161 14.1365 31.8941C16.1771 33.8745 16.1771 37.0828 14.1365 39.0633Z" fill="#1E1E1E" />
                    <path d="M43.5664 25.3419H29.5447C27.6569 25.3419 26.1111 26.8409 26.1111 28.6744V42.283C26.1111 44.1152 27.6556 45.6155 29.5447 45.6155H43.5664C45.4542 45.6155 47 44.1165 47 42.2843V28.6757C47 26.8422 45.4555 25.3419 43.5664 25.3419ZM40.2464 39.0633C38.2071 41.0425 34.9014 41.0425 32.8621 39.0633C30.8229 37.0828 30.8229 33.8733 32.8621 31.8941C34.9014 29.9149 38.2071 29.9161 40.2464 31.8941C42.2869 33.8745 42.2869 37.0828 40.2464 39.0633Z" fill="#1E1E1E" />
                  </svg>
                  <h1>
                    {pageData.content.study_title}
                  </h1>
                </div>
              </div>

              <div className={style.cardBody}>
                <div className={style.flexWrap}>
                  <div className={style.col}>
                    <dl className={style.desc}>
                      <dt className={style.descTitle}>summary</dt>
                      <dd className={style.descDesc}>
                        <p>
                          {pageData.content.study_description}
                        </p>
                      </dd>
                    </dl>
                  </div>
                  <div className={`${style.col} ${style.flexWrap}`}>
                    <div className={style.flexColumn}>
                      <dl className={style.desc}>
                        <dt className={style.descTitle}>number of alleles</dt>
                        <dd className={style.descDesc}>40</dd>
                      </dl>
                      <dl className={style.desc}>
                        <dt className={style.descTitle}>number of wt</dt>
                        <dd className={style.descDesc}>3</dd>
                      </dl>
                      <dl className={style.desc}>
                        <dt className={style.descTitle}>readout assay</dt>
                        <dd className={style.descDesc}>RNAseq</dd>
                      </dl>
                      <dl className={style.desc}>
                        <dt className={style.descTitle}>target genes</dt>
                        <dd className={style.descDesc}>
                          <GeneList genes={["PAX-6", "MXD1", "MEIS2", "RUNX1", "DMRTA1"]} />
                        </dd>
                      </dl>
                    </div>

                    <div className={style.flexColumn}>
                      <dl className={style.desc}>
                        <dt className={style.descTitle}>perturbation method</dt>
                        <dd className={style.descDesc}>CRISPRi, arrayed</dd>
                      </dl>
                      <dl className={style.desc}>
                        <dt className={style.descTitle}>data center</dt>
                        <dd className={style.descDesc}>
                          <StaticImage
                            src="../../images/other-logos/Jackson.png"
                            alt=""
                            placeholder="none"
                            className={style.descImg}
                          />
                        </dd>
                      </dl>
                      <dl className={style.desc}>
                        <dt className={style.descTitle}>Contributors</dt>
                        <dd className={style.descDesc}>
                          <ul className={style.descList}>
                            <li>Bill Flynn</li>
                            <li>Julia Alcoforado</li>
                            <li>Marie Shelton</li>
                            <li>Eesa Johnson</li>
                            <li>Brandon Fischer</li>
                            <li>Ayden Cortez</li>
                          </ul>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={style.section}>
            <div className={style.card}>
              <div className={style.cardHeader}>
                <h2>Data availability</h2>
              </div>

              <div className={style.cardBody}>
                <div className={style.gridWrap}>
                  <div className={style.resource}>
                    <div className="resource-image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.50875 17.4675H15.495C15.9262 17.4675 16.275 17.1187 16.275 16.6875C16.275 16.2563 15.9262 15.9075 15.495 15.9075H8.50875C8.0775 15.9075 7.72875 16.2563 7.72875 16.6875C7.72875 17.1187 8.0775 17.4675 8.50875 17.4675ZM8.50875 14.3512H15.495C15.9262 14.3512 16.275 14.0025 16.275 13.5712C16.275 13.14 15.9262 12.7913 15.495 12.7913H8.50875C8.0775 12.7913 7.72875 13.14 7.72875 13.5712C7.72875 14.0025 8.0775 14.3512 8.50875 14.3512ZM8.50875 11.19H15.495C15.9262 11.19 16.275 10.8413 16.275 10.41C16.275 9.97875 15.9262 9.63 15.495 9.63H8.50875C8.0775 9.63 7.72875 9.97875 7.72875 10.41C7.72875 10.8413 8.0775 11.19 8.50875 11.19ZM8.50875 8.14125H12.2438C12.675 8.14125 13.0238 7.7925 13.0238 7.36125C13.0238 6.93 12.675 6.58125 12.2438 6.58125H8.50875C8.0775 6.58125 7.72875 6.93 7.72875 7.36125C7.72875 7.7925 8.0775 8.14125 8.50875 8.14125ZM12 0C5.37375 0 0 5.37375 0 12C0 18.6262 5.37375 24 12 24C18.6262 24 24 18.6262 24 12C24 5.37375 18.6262 0 12 0ZM18 19.125H6V5.02125H18V19.125ZM14.8762 8.145H18L14.8762 5.02125V8.145Z" fill="#04989E" />
                      </svg>
                    </div>
                    <div className={style.resourceInfo}>
                      <dl>
                        <dt>Metadata CSV</dt>
                        <dd>
                          <p>Local download, 50 KB</p>
                          <a className={style.link}>Download</a>
                        </dd>
                      </dl>
                    </div>
                  </div>

                  <div className={style.resource}>
                    <div className="resource-image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.50875 17.4675H15.495C15.9262 17.4675 16.275 17.1187 16.275 16.6875C16.275 16.2563 15.9262 15.9075 15.495 15.9075H8.50875C8.0775 15.9075 7.72875 16.2563 7.72875 16.6875C7.72875 17.1187 8.0775 17.4675 8.50875 17.4675ZM8.50875 14.3512H15.495C15.9262 14.3512 16.275 14.0025 16.275 13.5712C16.275 13.14 15.9262 12.7913 15.495 12.7913H8.50875C8.0775 12.7913 7.72875 13.14 7.72875 13.5712C7.72875 14.0025 8.0775 14.3512 8.50875 14.3512ZM8.50875 11.19H15.495C15.9262 11.19 16.275 10.8413 16.275 10.41C16.275 9.97875 15.9262 9.63 15.495 9.63H8.50875C8.0775 9.63 7.72875 9.97875 7.72875 10.41C7.72875 10.8413 8.0775 11.19 8.50875 11.19ZM8.50875 8.14125H12.2438C12.675 8.14125 13.0238 7.7925 13.0238 7.36125C13.0238 6.93 12.675 6.58125 12.2438 6.58125H8.50875C8.0775 6.58125 7.72875 6.93 7.72875 7.36125C7.72875 7.7925 8.0775 8.14125 8.50875 8.14125ZM12 0C5.37375 0 0 5.37375 0 12C0 18.6262 5.37375 24 12 24C18.6262 24 24 18.6262 24 12C24 5.37375 18.6262 0 12 0ZM18 19.125H6V5.02125H18V19.125ZM14.8762 8.145H18L14.8762 5.02125V8.145Z" fill="#04989E" />
                      </svg>
                    </div>
                    <div className={style.resourceInfo}>
                      <dl>
                        <dt>Raw reads fastq</dt>
                        <dd>
                          <p>ENSG00000007372, 102 MB</p>
                          <a className={style.link}>Download</a>
                        </dd>
                      </dl>
                    </div>
                  </div>

                  <div className={style.resource}>
                    <div className="resource-image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.50875 17.4675H15.495C15.9262 17.4675 16.275 17.1187 16.275 16.6875C16.275 16.2563 15.9262 15.9075 15.495 15.9075H8.50875C8.0775 15.9075 7.72875 16.2563 7.72875 16.6875C7.72875 17.1187 8.0775 17.4675 8.50875 17.4675ZM8.50875 14.3512H15.495C15.9262 14.3512 16.275 14.0025 16.275 13.5712C16.275 13.14 15.9262 12.7913 15.495 12.7913H8.50875C8.0775 12.7913 7.72875 13.14 7.72875 13.5712C7.72875 14.0025 8.0775 14.3512 8.50875 14.3512ZM8.50875 11.19H15.495C15.9262 11.19 16.275 10.8413 16.275 10.41C16.275 9.97875 15.9262 9.63 15.495 9.63H8.50875C8.0775 9.63 7.72875 9.97875 7.72875 10.41C7.72875 10.8413 8.0775 11.19 8.50875 11.19ZM8.50875 8.14125H12.2438C12.675 8.14125 13.0238 7.7925 13.0238 7.36125C13.0238 6.93 12.675 6.58125 12.2438 6.58125H8.50875C8.0775 6.58125 7.72875 6.93 7.72875 7.36125C7.72875 7.7925 8.0775 8.14125 8.50875 8.14125ZM12 0C5.37375 0 0 5.37375 0 12C0 18.6262 5.37375 24 12 24C18.6262 24 24 18.6262 24 12C24 5.37375 18.6262 0 12 0ZM18 19.125H6V5.02125H18V19.125ZM14.8762 8.145H18L14.8762 5.02125V8.145Z" fill="#04989E" />
                      </svg>
                    </div>
                    <div className={style.resourceInfo}>
                      <dl>
                        <dt>Processed file and analysis outputs</dt>
                        <dd>
                          <p>Download available at Biostudies</p>
                          <a className={style.link}>Open</a>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className={style.section}>
            <div className={style.card}>
              <div className={style.cardHeader}>
                <h2>Differential expression</h2>
              </div>

              <div className={style.cardBody}>
                <div className={style.dataImgPlaceholder}>

                </div>
              </div>
            </div>
          </section>

          <section className={style.section}>
            <div className={style.card}>
              <div className={style.cardHeader}>
                <h2>Enrichment analysis</h2>
              </div>

              <div className={style.cardBody}>
                <div className={style.dataImgGrid}>
                  <div className={style.dataImgPlaceholder}>

                  </div>
                  <div className={style.dataImgPlaceholder}>

                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div >

      <div className={style.bgSmartWhite}>
        <Footer />
      </div>
    </div >
  );
}

export function Head() {
    return (
      <>
        <title>MorPhiC program: Molecular Phenotypes of Null Alleles in Cells</title>
        <link id="icon" rel="icon" href="/favicon.svg" />
      </>
    )
}