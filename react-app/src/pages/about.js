import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { StaticImage } from "gatsby-plugin-image"
import * as style from "../styles/about.module.css";

export default function About() {
  return (
    <div className="about">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>
      
      <div className="about-container">
        <div className="about-info-container">
          <div className={style.aboutInfo}>
            <div>
              <h1>About</h1>
              <div className="about-intro-container">
                <div className={style.aboutIntro}>
                  <p>A program to better understand the function of every human gene and generate a catalogue of the molecular and cellular consequences of inactivating genes.</p>
                  <div className="about-card-container">
                    <div className={style.aboutCard}>
                      <h2 className="about-card-title">inside this page</h2>
                      <ul>
                        <li><a href="#program-goals">↓ Program goals</a></li>
                        <li><a href="#participants">↓ Participants</a></li>
                        <li><a href="#funding">↓ Funding</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section id="program-goals" className={style.aboutSection}>
              <div className="about-section-subtitle-container">
                <h2>Program goals</h2>
                <a href="#">↑ Back to top</a>
              </div>
              <div className="about-section-description-container">
                <p>
                  MorPhiC aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community. The program will start with a Phase 1 to optimize available methods to create null alleles and measure their phenotypic effects in a target subset of 1,000 protein coding genes across the program. Phase 1 will also assess the scale limitations of such methods, develop common data formats and establish use cases for this catalog.
                </p>
                <p>
                  Systematically obtaining information about the molecular and cellular phenotypic effects of gene knockouts for all human genes would provide wide-ranging insights into their biological function. Such data would provide a foothold for understanding the mechanisms through which genes act to produce phenotypes and would help elucidate the roles and relationships of genes and regulatory elements in pathways and networks.
                </p>
                <p><b>MorPhiC Phase 1</b> will include three components:</p>
                <p>
                  <b>Data Production Research and Development Centers</b> will develop diverse systems and assays and explore and compare approaches to produce MorPhiC data at scale, and to maximize its informativeness.
                </p>
                <p>
                  <b>Data Analysis and Validation Centers</b> will undertake applicant-proposed analyses of the data in order to characterize its quality and utility for multiple purposes.
                </p>
                <p>
                  There will be a <b>Data Resource and Administrative Coordinating Center.</b>
                </p>
                <p>All components will work together to ensure that the data are informative, of high quality and useful to the community.</p>
              </div>
            </section>

            <section id="participants" className={style.aboutSection}>
              <div className="about-section-subtitle-container">
                <h2>Participants</h2>
                <a href="#">↑ Back to top</a>
              </div>
            </section>

            <div className={style.dataFlowCard}>
              <section className="organisation">
                <h2>The MorPhiC participants</h2>
                <div className="data-flow-categories">
                  <div className="data-flow-category">
                    <h3 className="data-flow-sub-heading"><span>Working Groups</span></h3>
                    <div className="data-flow-items">
                      <div className="data-flow-item item-bg-1">
                        <span aria-hidden className="data-flow-item-icon icon-group"></span>
                        <p className="item-label">Experimental</p>
                      </div>
                      <div className="data-flow-item item-bg-2">
                        <span aria-hidden className="data-flow-item-icon icon-category"></span>
                        <p className="item-label">data</p>
                      </div>
                      <div className="data-flow-item item-bg-3">
                        <span aria-hidden className="data-flow-item-icon icon-list"></span>
                        <p className="item-label">policy & outreach</p>
                      </div>
                      <div className="data-flow-item item-bg-4">
                        <span aria-hidden className="data-flow-item-icon icon-gear"></span>
                        <p className="item-label">analysis</p>
                      </div>
                    </div>
                  </div>
                  <div className="data-flow-category">
                    <h3><span>data production centres</span></h3>
                    <div className="data-flow-items white-box flex-space-evenly">
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/other-logos/MSK.png"
                          alt="Sloan-Kettering Institute for Cancer Research"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/other-logos/Northwestern.png"
                          alt="Northwestern University Feinberg School of Medicine"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/other-logos/Jackson.png"
                          alt="Jackson Laboratory"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/other-logos/UCSF.png"
                          alt="University of California San Francisco"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="data-flow-category">
                    <h3><span>data resource, admin and coordinating centrE</span></h3>
                    <div className="data-flow-items white-box flex-space-evenly">
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Miami.png"
                          alt="University of Miami"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Washington.png"
                          alt="University of Washington"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/EMBL.png"
                          alt="EMBL"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/other-logos/Queen-Mary.png"
                          alt="Queen Mary University of London"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="data-flow-category">
                    <h3><span>data analysis and validation centres</span></h3>
                    <div className="data-flow-items white-box flex-space-evenly">
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Stanford.png"
                          alt="Stanford University"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Fred-Hutch.png"
                          alt="Fred Hutchinson Cancer Center"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Jackson.png"
                          alt="Jackson Laboratory"
                          className="data-flow-logo"
                          placeholder="none"
                          loading="eager"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section id="funding" className={style.aboutSection}>
              <div className="about-section-subtitle-container">
                <h2>Funding</h2>
                <a href="#">↑ Back to top</a>
              </div>
              <div className="about-section-description-container">
                <p>
                  Read the <a className="" href="https://www.genome.gov/research-funding/Funded-Programs-Projects/Molecular-Phenotypes-of-Null-Alleles-in-Cells" target="_blank" rel="noopener noreferrer">
                  MorPhiC Program outline on the NHGRI website →</a>
                </p>
              </div>
            </section>

            <Footer />
          </div>
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