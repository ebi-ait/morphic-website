import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"
import * as styles from "../styles/news.module.css"
import { articles } from "../utils/constants/NewsArticles.js"
import { useLocation } from "@reach/router"

export default function NewsItems() {
  const location = useLocation(); //Get current page path
  const currentPath = location.pathname;
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: { sourceInstanceName: { eq: "images" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(width: 600)
          }
        }
      }
    }
  `)

  //Map image filenames to Gatsby image objects
  const imageMap = data.allFile.nodes.reduce((acc, node) => {
    if (node.childImageSharp) {
      acc[node.relativePath] = node.childImageSharp.gatsbyImageData;
    }
    return acc;
  }, {})

  return (
    <>
      {articles.map((item) => {
        const imageData = imageMap[item.imageSrc] //Use mapped images

        return (
          <article key={item.id} className={styles.newsArticle}>
            <div className={styles.newsArticleImgWrap}>
              {imageData ? (
                <GatsbyImage
                  image={getImage(imageData)}
                  alt={item.title}
                  className={styles.newsArticleImage}
                />
              ) : (
                <p>Image not available</p>
              )}
            </div>
            <div className={styles.newsArticleInfo}>
              <time dateTime={item.date}>{item.date}</time>
              <h2 className={styles.newsArticleTitle}>{item.title}</h2>
              {currentPath === "/news/" && (
                <>
                  <p className={styles.newsArticleText}>{item.subTitle}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.newsArticleLink}
                  >
                    Read more →
                  </a>
                </>
              )}
            </div>
          </article>
        )
      })}
    </>
  )
}