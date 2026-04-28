import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import PublicationItems from "../components/PublicationItems"
import { Seo } from '../utils/SEO';
import { ExternalLink } from "lucide-react";

import * as styles from "../styles/news.module.css"

export default function Publications() {
  return (
    <div className="about">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>

      <div className="about-container">
        <div className={styles.container}>
          <div className={`${styles.grid} ${styles.gap} ${styles.gridColumns3} ${styles.gridColumns1AtMd}`}>

            {/* Side Menu */}
            <aside className={`${styles.slideContainer} ${styles.hiddenAtMd}`}>
              <div className={`${styles.card} ${styles.slidePanel}`}>
                <h2 className="about-card-title">Inside this page</h2>
                <nav>
                  <ul className={styles.cardList}>
                    <li><a href="#publications">Publications</a></li>
                    <li><a href="#pre-prints">Pre-prints</a></li>
                    <li>
                      <a href="https://connect.biorxiv.org/relate/content/220" target="_blank" rel="noopener noreferrer">
                        <span style={{ paddingRight: "0.5rem" }}>NHGRI MorPhiC bioRxiv</span>
                        <ExternalLink size={16} />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className={styles.marginXAutoAtMd}>

              {/* Publications Section */}
              <section id="publications" className={`${styles.newsSection} ${styles.newsArticles}`}>
                <div className="about-section-subtitle-container">
                  <h1 className={styles.marginNone}>Publications</h1>
                </div>

                <PublicationItems />
              </section>

              {/* Pre-prints Section */}
              <section id="pre-prints" className={`${styles.newsSection} ${styles.newsArticles} ${styles.marginTop}`}>
                <div className="about-section-subtitle-container">
                  <h1 className={styles.marginNone}>Pre-prints</h1>
                </div>
              </section>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}


export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}