import React from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import NewsItems from "../../components/NewsItems"
import { StaticImage } from "gatsby-plugin-image"

import * as styles from "../../styles/news.module.css"

export default function News() {
  return (
    <div className="about">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>
      
      <div className={`about-container ${styles.newsContainer}`}>
        <div className="about-info-container">
          <div className={styles.newsInfo}>
            <div>
              <h1 className={styles.newsHeading}>News</h1>
            </div>

            <section className={`${styles.newsSection} ${styles.newsArticles}`}>
              <NewsItems />

              <div className={styles.newsArticleBtnWrap}>
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
      <link id="icon" rel="icon" href="../../favicon.svg" />
    </>
  )
}