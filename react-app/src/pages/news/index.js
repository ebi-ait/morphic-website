import React from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { StaticImage } from "gatsby-plugin-image"

export default function News() {
  return (
    <div className="about">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>
      
      <div className="about-container">
        <div className="about-info-container">
          <div className="news-info">
            <div>
              <h1 className="news-heading">News</h1>
            </div>

            <section className="news-section news-articles">
              <article className="news-article">
                <div className="news-article-img-wrap">
                    <StaticImage
                        src="../../images/news-um.png"
                        alt="Dr. Schürer and members of the MorPhiC DRACC"
                        placeholder="none"
                        className="news-article-image"
                    />
                </div>
                <div className="news-article-info">
                    <time dateTime="2023-03-03">3 March 2023</time>
                    <h2 className="news-article-title">The Molecular Phenotypes of Null Alleles in Cells program seeks to identify the purpose behind every gene.</h2>
                    <p className="news-article-text">The Molecular Phenotypes of Null Alleles in Cells program seeks to identify the purpose behind every gene.</p>
                    <a 
                        href="https://news.med.miami.edu/dr-stephan-schurer-enlisted-for-important-genome-research-project/" 
                        target="_blank" rel="noopener noreferrer"
                        className="news-article-link"
                    >
                        Read more →
                    </a>
                </div>
              </article>

              <article className="news-article">
                <div className="news-article-img-wrap">
                    <StaticImage
                        src="../../images/news-ucsf.jpeg"
                        alt="Luke Gilbert, UCSF"
                        placeholder="none"
                        className="news-article-image"
                    />
                </div>
                <div className="news-article-info">
                    <time dateTime="2023-09-27">27 September 2022</time>
                    <h2 className="news-article-title">NIH initiative to systematically investigate and establish function of every human gene</h2>
                    <p className="news-article-text">NIH initiative to systematically investigate and establish function of every human gene</p>
                    <a 
                        href="https://cancer.ucsf.edu/news/2022/09/27/nih-initiative-to-systematically-investigate-and-establish-function-of-every-human" 
                        target="_blank" rel="noopener noreferrer"
                        className="news-article-link"
                    >
                        Read more →
                    </a>
                </div>
              </article>

              <article className="news-article">
                <div className="news-article-img-wrap">
                    <StaticImage
                        src="../../images/news-northwestern.png"
                        alt="Mazhar Adli, PhD"
                        placeholder="none"
                        className="news-article-image"
                    />
                </div>
                <div className="news-article-info">
                    <time></time>
                    <h2 className="news-article-title">Identifying How Genes Function to Better Understand Cancer with Mazhar Adli, PhD</h2>
                    <p className="news-article-text">Identifying How Genes Function to Better Understand Cancer with Mazhar Adli, PhD</p>
                    <a 
                        href="https://www.feinberg.northwestern.edu/research/podcast/2022/gene-function-to-understand-cancer-adli.html" 
                        target="_blank" rel="noopener noreferrer"
                        className="news-article-link"
                    >
                        Read more →
                    </a>
                </div>
              </article>

              <article className="news-article">
                <div className="news-article-img-wrap">
                    <StaticImage
                        src="../../images/news-uw.jpg"
                        alt="Dr. Ka Yee Yeung and Dr. Ling-Hong Hung posing next to their poster"
                        placeholder="none"
                        className="news-article-image"
                    />
                </div>
                <div className="news-article-info">
                    <time dateTime="2023-05-02">2 May 2023</time>
                    <h2 className="news-article-title">Bioinformatics Team Powers International Effort to Map Gene Function</h2>
                    <p className="news-article-text">Identifying How Genes Function to Better Understand Cancer with Mazhar Adli, PhD</p>
                    <a 
                        href="https://www.tacoma.uw.edu/news/bioinformatics-team-powers-international-effort-map-gene-function-0" 
                        target="_blank" rel="noopener noreferrer"
                        className="news-article-link"
                    >
                        Read more →
                    </a>
                </div>
              </article>

              <div className="news-article-btn-wrap">
                <button className="button button-orange">Load more</button>
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