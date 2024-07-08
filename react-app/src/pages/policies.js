import React from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Policies() {
  return (
    <div className="policies">
      <Navbar />
      <div className="policies-triangle"></div>
      <section className="policies-container">
        <div className="policies-content-container">
          <div className="policies-content">
            <div className="policies-menu-container">
              <div className="policies-card">
                <h2 className="policies-card-title">policies</h2>
                <ul>
                  <li>
                    <a className="nav-link" href="https://github.com/morphic-bio/morphic-bio.github.io/blob/main/Policies/Morphic%20Code%20of%20Conduct%20for%20Events.pdf" target="_blank" rel="noopener noreferrer">
                        Code of Conduct
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="https://github.com/morphic-bio/morphic-bio.github.io/blob/main/Policies/MorPhiC%20-%20Publication%20Policy.pdf" target="_blank" rel="noopener noreferrer">
                      Publication Policy
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="https://github.com/morphic-bio/morphic-bio.github.io/blob/main/Policies/Morphic%20-%20Software%20Sharing%20Policy.pdf" target="_blank" rel="noopener noreferrer">
                      Software Sharing Policy
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="https://github.com/morphic-bio/morphic-bio.github.io/blob/main/Policies/Morphic%20-%20Human%20Genome%20Assembly%20Policy.pdf" target="_blank" rel="noopener noreferrer">
                      Human Genome Assembly Policy
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="https://github.com/morphic-bio/morphic-bio.github.io/blob/main/Policies/MorPhiC%20Affiliate%20Membership.pdf" target="_blank" rel="noopener noreferrer">
                      Affiliate Membership Policy
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="https://github.com/morphic-bio/morphic-bio.github.io/blob/main/Policies/Morphic%20-%20Data%20Release%20and%20Use%20Policy.pdf" target="_blank" rel="noopener noreferrer">
                      Data Release and Use Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="policies-info">
              <h1>Code of Conduct</h1>
              <p>MorPhiC Consortium Publication, Data Release, and Software Sharing Policies distinguish two release tiers:</p>
              <ul>
                <li>Tier 1 concerns release to consortium members</li>
                <li>Tier 2 concerns release to the public</li>
              </ul>
              <p>This policy will be reviewed and, if necessary, updated on a semi-annual basis.</p>
              <p>This policy is based on the ENCODE software release policy <a href="https://www.encodeproject.org/about/data-use-policy/" target="_blank" rel="noopener noreferrer">(https://www.encodeproject.org/about/data-use-policy/)</a>.</p>
              <p>Rationale: To ensure reproducibility of analyses and to encourage reuse of software.</p>
              <p>Developers of significant new MorPhiC Consortium-related software will make their programs, including source code, freely available to consortium members and to the public. Examples include data processing pipelines and implementations of statistical, visualization, and modeling tools developed by MorPhiC Consortium funded groups to process or analyze data produced by the Data Production Centers (DPCs). Developers are strongly encouraged to integrate support for data format standards agreed upon by the MorPhiC Consortium Data Working Group into their software.</p>
              <h2>What to Release</h2>
              <p>The MorPhiC Consortium requires the release of analysis pipelines used for major Morphic Consortium products. The consortium requires release of software tools and pipelines used to process any released data and used for major analyses and modeling in planned Morphic Consortium publications. When released together with specific datasets or modeling applications, the software should be released together with the parameter files that would allow fully reproducible runs as well as a minimum sample data set and expected outputs. Furthermore, a complete description of all external dependencies (such as libraries and their specific versions) of the software needs to be provided. To enhance reproducibility, software containers that include all dependencies are strongly recommended. Where possible, the files required to produce the container images, (Dockerfiles, executables) should be included. They should include exact versions of the dependencies and executables.</p>
              <p>We also strongly encourage release of software likely to be useful to multiple groups either within the consortium or in the broader community.</p>
              <h2>When to Release</h2>
              <p>The decision of when software should be released should balance the benefit to the consortium and the broader community, against the labor involved in software release and maintenance.</p>
              <p>Software tools for data analysis and processing should be released as soon as they are sufficiently stable and no later than the time of the data release (according to the Tier system described at the beginning of this document). </p>
              <p>Other software should be released with the release of the manuscript according to the publication policy and the Tier system.</p>
            </div>
          </div>
        </div>
        <Footer />
      </section>
      
    </div>
  )
}
