import React from 'react'
import * as styles from "../styles/news.module.css"
import { publications } from "../utils/constants/PublicationArticles.js"


export default function PublicationItems() {
  return (
    <>
      <ul className={styles.publicationList}>
        {
          publications.map((item) => {
            const pmid = item.pmid || "N/A"

            return (
              <li key={item.id}>
                <article className={styles.publicationArticle}>
                  <h2>
                    <a className="link" href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  </h2>
                  <p><i>{item.journal}</i>, {item.date}</p>
                  <p><b>{item.authors}</b></p>
                  <p>
                    {item.centers.split(" ").map((center) => (
                        <span className={styles.badge}>{center}</span>
                    ))}
                  </p>
                  <p>PMID: {pmid}</p>
                </article>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}
