import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { StaticImage } from "gatsby-plugin-image"

export default function About() {
  return (
    <div className="about">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>
      
      <div className="about-container">
        <div className="about-info-container">
          <div className="about-info">
            <div>
              <h1>About</h1>
              <div className="about-intro-container">
                <div className="about-intro">
                  <p>A programme to better understand the function of every human gene and generate a catalogue of the molecular and cellular consequences of inactivating genes.</p>
                  <div className="about-card-container">
                    <div className="about-card">
                      <h2 className="about-card-title">inside this page</h2>
                      <ul>
                        <li><a href="#about-morphic">↓ The MorPhiC programme</a></li>
                        <li><a href="#publications">↓ Publications</a></li>
                        <li><a href="#">↓ What is null allele?</a></li>
                        <li><a href="#">↓ Experiment design for the studies</a></li>
                        <li><a href="#data-flow">↓ Data flow and availability</a></li>
                        <li><a href="#">↓ Collaborators</a></li>
                        <li><a href="#funders">↓ Funders</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section id="about-morphic" className="about-section">
              <div className="about-section-subtitle-container">
                <h2>About the MorPhiC Program</h2>
                <a href="#">↑ Back to top</a>
              </div>
              <div className="about-section-description-container">
                <p>The MorPhiC programme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community. MorPhiC has three components: the Data Production Research and Development Centers (DPCs), the Data Analysis and Validation Centers (DAVs) and the Data Resource and Administrative Coordinating Center (DRACC).</p>
              </div>
            </section>

            <section id="publications" className="about-section">
              <div className="about-section-subtitle-container">
                <h2>Publications</h2>
                <a href="#">↑ Back to top</a>
              </div>
              <div className="about-section-description-container">
                <p className="bold">Description statement for the MorPhiC programme</p>
                <a>Link to paper</a>
              </div>
            </section>

            <section id="data-flow" className="about-section">
              <div className="about-section-subtitle-container">
                <h2>Data flow and availability</h2>
                <a href="#">↑ Back to top</a>
              </div>
              <div className="about-section-description-container">
                <p>The MorPhiC programme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community. MorPhiC has three components: the Data Production Research and Development Centers (DPCs), the Data Analysis and Validation Centers (DAVs) and the Data Resource and Administrative Coordinating Center (DRACC).</p>
              </div>
            </section>

            <div className="data-flow-card">
              <section className="organisation">
                <h2>The MorPhic organisation</h2>
                <div className="data-flow-categories">
                  <div className="data-flow-category">
                    <h3 className="data-flow-sub-heading"><span>Working Groups</span></h3>
                    <div className="data-flow-items">
                      <div className="data-flow-item item-bg-1">
                        <span aria-hidden className="data-flow-item-icon icon-group"></span>
                        <p className="item-label">Expertimental</p>
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
                          src="../images/external/logos/MSK.png"
                          alt="Sloan-Kettering Institute for Cancer Research"
                          className="data-flow-logo"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Northwestern-no-border.png"
                          alt="Northwestern University Feinberg School of Medicine"
                          className="data-flow-logo"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Jackson.png"
                          alt="Jackson Laboratory"
                          className="data-flow-logo"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Stanford.png"
                          alt="Stanford University"
                          className="data-flow-logo"
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
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Washington.png"
                          alt="University of Washington"
                          className="data-flow-logo"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/EMBL.png"
                          alt="EMBL"
                          className="data-flow-logo"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Queen-Mary.png"
                          alt="Queen Mary University of London"
                          className="data-flow-logo"
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
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Fred-Hutch.png"
                          alt="Fred Hutchinson Cancer Center"
                          className="data-flow-logo"
                        />
                      </div>
                      <div className="data-flow-logo-item">
                        <StaticImage
                          src="../images/external/logos/Jackson.png"
                          alt="Jackson Laboratory"
                          className="data-flow-logo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section id="funders" className="about-section">
              <div className="about-section-subtitle-container">
                <h2>Funders</h2>
                <a href="#">↑ Back to top</a>
              </div>
              <div className="about-section-description-container">
                <p className="bold">NIH Grant #1234567890</p>
                <a>Link to paper</a>
              </div>
              <div className="about-section-description-container">
                <p className="bold">NIH Grant #1234567890</p>
                <a>Link to paper</a>
              </div>
              <div className="about-section-description-container">
                <p className="bold">NIH Grant #1234567890</p>
                <a>Link to paper</a>
              </div>
              <div className="about-section-description-container">
                <p className="bold">NIH Grant #1234567890</p>
                <a>Link to paper</a>
              </div>
            </section>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}