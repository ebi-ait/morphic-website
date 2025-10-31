import React from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import NewsItems from "../../components/NewsItems"
import PublicationItems from "../../components/PublicationItems"
import { StaticImage } from "gatsby-plugin-image"
import { Seo } from "../../utils/SEO";

import * as styles from "../../styles/news.module.css"

export default function News() {
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
                <h2 className="about-card-title">Insdie this page</h2>
                <nav>
                  <ul className={styles.cardList}>
                    <li><a href="#news">News</a></li>
                    <li><a href="#publications">Publications</a></li>
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className={styles.marginXAutoAtMd}>

              {/* News Section */}
              <section id="news" className={`${styles.newsSection} ${styles.newsArticles}`}>
                <div className="about-section-subtitle-container">
                  <h1 className={styles.marginNone}>News</h1>
                </div>
                <NewsItems />

                {/*<div className={styles.newsArticleBtnWrap}>
                  <button className="button button-orange">Load more</button>
                </div>*/}
              </section>

              {/* Publications Section */}
              <section id="publications" className={`${styles.newsSection} ${styles.newsArticles} ${styles.marginTop}`}>
                <div className="about-section-subtitle-container">
                  <h1 className={styles.marginNone}>Publications</h1>
                </div>

                <PublicationItems />
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