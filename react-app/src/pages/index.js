import * as React from "react"

import '../styles/global.css'

import Navbar from '../components/Navbar'
import FAQ from "../components/FAQ"
import Footer from "../components/Footer"

import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

export default function Home() {
  return (
    <div className="page">
      <div className="header-inline header-gradient">
        <StaticImage
          src="../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png"
          className="header-image"
        />
        <div className="header-position-top">
          <Navbar />
        </div>
        <div className="header-position-center">
          <h1>Molecular Phenotypes<br></br>
          of Null Alleles in Cells</h1>
          <p>A programme to better understand the function of every human gene and generate a catalogue of the molecular and cellular consequences of inactivating genes.</p>
        </div>
        <div className="header-position-bottom header-triangle"></div>
      </div>

      <section className="home-about">
        <div className="home-about-content">

          <div className="home-card-row">
            <div className="home-card">
              <h3 className="home-card-title">gene list</h3>
              <span aria-hidden className="home-card-icon icon-search"></span>
              <p className="home-card-text">
                <span className="bold">Phase 1</span> will focus on 1,000 protein-coding genes, exploring different ways to knock out gene function.
              </p>
              <div>
                <a className="home-card-link" href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer">
                  Study the gene list
                </a>
              </div>
            </div>
            <div className="home-card">
              <h3 className="home-card-title">data tracker</h3>
              <span aria-hidden className="home-card-icon icon-data-tracker"></span>
              <p className="home-card-text">
                The Data Production Centres have planned studies on some of the essential genes, and they are coming <span className="bold">in 2024</span>.
              </p>
              <div>
                <a className="home-card-link">
                  Open the data tracker
                </a>
              </div>
            </div>
            <div className="home-card">
              <h3 className="home-card-title">participants</h3>
              <span aria-hidden className="home-card-logo logo-jackson"></span>
              <p className="home-card-text">
                The Jackson Laboratory
              </p>
              <div>
                <a className="home-card-link">
                  See who’s involved
                </a>
              </div>
            </div>
          </div>

          <h2>About the MorPhiC Program</h2>
          <p className="home-about-text">The MorPhiC programme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community. MorPhiC has three components: the Data Production Research and Development Centers (DPCs), the Data Analysis and Validation Centers (DAVs) and the Data Resource and Administrative Coordinating Center (DRACC).</p>
          <Link to="/about" className="home-about-link">Learn more about MorPhiC program goals →</Link>
        </div>
      </section>

      <section className="home-news">
        <div className="home-news-triangle"></div>
        <div className="home-news-container">
          <h2>Latest news</h2>
          <div className="home-news-item-container">
            <div className="home-news-card">
              <StaticImage
                src="../images/external/ellipse21572-saf-200h.png"
                alt="Dr. Schürer and members of the MorPhiC DRACC"
                placeholder="blurred"
              />
              <time dateTime="2023-03-03">3 March 2023</time>
              <p>
                <a href="https://news.med.miami.edu/dr-stephan-schurer-enlisted-for-important-genome-research-project/" target="_blank" rel="noopener noreferrer">
                  The Molecular Phenotypes of Null Alleles in Cells program seeks to identify the purpose behind every gene.
                </a>
              </p>
            </div>
            <div className="home-news-card">
              <StaticImage
                src="../images/external/ellipse31572-mj5c-200h.png"
                alt="Luke Gilbert, UCSF"
                placeholder="blurred"
              />
              <time dateTime="2023-09-27">27 September 2022</time>
              <p>
                <a href="https://cancer.ucsf.edu/news/2022/09/27/nih-initiative-to-systematically-investigate-and-establish-function-of-every-human" target="_blank" rel="noopener noreferrer">
                  NIH initiative to systematically investigate and establish function of every human gene
                </a>
              </p>
            </div>
            <div className="home-news-card">
              <StaticImage
                src="../images/external/ellipse41572-5cll-200h.png"
                alt="Mazhar Adli, PhD"
                placeholder="blurred"
              />
              <time dateTime="2023-12-05">5 Dec 2022</time>
              <p>
                <a href="https://www.feinberg.northwestern.edu/research/podcast/2022/gene-function-to-understand-cancer-adli.html" target="_blank" rel="noopener noreferrer">
                  Identifying How Genes Function to Better Understand Cancer with Mazhar Adli, PhD
                </a>
              </p>
            </div>
            <div className="home-news-card">
              <StaticImage
                src="../images/external/ellipse51572-6fwh-200h.png"
                alt="Dr. Ka Yee Yeung and Dr. Ling-Hong Hung posing next to their poster"
                placeholder="blurred"
              />
              <time dateTime="2023-05-02">2 May 2023</time>
              <p>
                <a href="https://www.tacoma.uw.edu/news/bioinformatics-team-powers-international-effort-map-gene-function-0" target="_blank" rel="noopener noreferrer">
                  Bioinformatics Team Powers International Effort to Map Gene Function
                </a>
              </p>
            </div>
          </div>
          <Link to="/" className="home-news-link">News archive →</Link>
        </div>
      </section>
      
      <FAQ />

      <section className="home-policies">
        <div className="home-policies-triangle"></div>
        <div className="home-policies-container">
          <div className="home-policies-content">
            <h2>Licenses & Policies</h2>
            <p>The MorPhiC programme programme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community. The MorPhiC nullprogramme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad null use by the biomedical community. The MorPhiC programme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community.</p>
            <p>The following policies were approved by the MorPhiC Steering Committee:</p>
            <ul>
              <li>
                <Link>Code of Conduct</Link>
              </li>
              <li>
                <Link>Publication Policy</Link>
              </li>
              <li>
                <Link>Software Sharing Policy</Link>
              </li>
              <li>
                <Link>Human Genome Assembly Policy</Link>
              </li>
              <li>
                <Link>Affiliate Membership Policy</Link>
              </li>
              <li>
                <Link>Data Release and Use Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  )
}