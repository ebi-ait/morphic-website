import React from 'react'
import * as styles from "../styles/news.module.css"
import { events } from "../utils/constants/EventsFeatured.js"

// Utility function, convert date string (YYYY-MM-DD) to Date object
const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return new Date(`${month} ${day}, ${year}`);
};

// Sort events by date (newest to oldest)
const sortedEvents = [...events].sort((a, b) => parseDate(b.date) - parseDate(a.date));


export default function EventsItems() {
  return (
    <>
      <ul className={`${styles.listNone} ${styles.paddingNone} ${styles.marginNone}`}>
        {
          sortedEvents.map((item, index) => {
            const date = parseDate(item.date);
            const dateStringFormat = date.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });

            return (
              <li key={index}>
                <article className={`${styles.eventArticle}`}>
                  <header className={`${styles.grid} ${styles.gridColumns1}`}>
                    <h2 className={styles.eventTitle}>{item.title}</h2>
                    <time dateTime={item.date} className={`${styles.eventDate} ${styles.orderFirst}`}>{dateStringFormat}</time>
                  </header>
                  <a className={styles.buttonOrange} href={item.videoLink} target="_blank" rel="noopener noreferrer">Watch Video →</a>
                </article>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}
