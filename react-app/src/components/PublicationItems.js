import React from 'react'
import * as styles from "../styles/news.module.css"
import { publications } from "../utils/constants/PublicationArticles.js"

// Utility function, convert date string (YYYY MM DD) to Date object
const parseDate = (dateStr) => {
  const [year,  month, day] = dateStr.split();
  return new Date(`${month} ${day}, ${year}`);
};

// Sort publications by date (newest to oldest)
const sortedPublications = [...publications].sort((a, b) => parseDate(b.date) - parseDate(a.date));


export default function PublicationItems() {
  return (
    <>
      <ul className={styles.publicationList}>
        {
          sortedPublications.map((item) => {
            const pmid = item.pmid || "N/A";
            const journalReferenceInfo = item.journalReferenceInfo? `;${item.journalReferenceInfo}.`: "";

            return (
              <li key={item.pmid || item.link}>
                <article className={styles.publicationArticle}>
                  <h2>
                    <a className="link" href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  </h2>
                  <p><i>{item.journal}</i>, {item.date}{journalReferenceInfo}</p>
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
