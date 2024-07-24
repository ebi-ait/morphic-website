import React from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "gatsby"

import * as styles from "../styles/policies.module.css"

export default function Policies({ children }) {
  return (
    <div className={styles.policies}>
      <Navbar />
      <div className={styles.policiesTriangle}></div>
      <section className={styles.policiesContainer}>
        <div className={styles.policiesContentContainer}>
          <div className={styles.policiesContent}>
            <div className={styles.policiesMenuContainer}>
              <div className={styles.policiesCard}>
                <h2 className={styles.policiesCardTitle}>policies</h2>
                <ul>
                  <li>
                    <Link to="/policies/code-of-conduct" className="nav-link">Code of Conduct</Link>
                  </li>
                  <li>
                    <Link to="/policies/publication-policy" className="nav-link">Publication Policy</Link>
                  </li>
                  <li>
                    <Link to="/policies/software-sharing-policy" className="nav-link">Software Sharing Policy</Link>
                  </li>
                  <li>
                    <Link to="/policies/human-genome-assembly-policy">Human Genome Assembly Policy</Link>
                  </li>
                  <li>
                    <Link to="/policies/affiliate-membership-policy" className="nav-link">Affiliate Membership Policy</Link>
                  </li>
                  <li>
                    <Link to="/policies/data-release-and-use-policy" className="nav-link">Data Release and Use Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.policiesInfo}>
                { children }
            </div>
          </div>
        </div>
        <Footer />
      </section>
      
    </div>
  )
}