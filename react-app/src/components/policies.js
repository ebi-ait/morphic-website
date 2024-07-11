import React from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "gatsby"

export default function Policies({ children }) {
  return (
    <div className="policies">
      <Navbar />
      <div className="policies-triangle"></div>
      <section className="policies-container">
        <div className="policies-content-container">
          <div className="policies-content">
            <div className="policies-menu-container">
              <div className="policies-card">
                <h2 className="policies-card-title">policies</h2>
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
            <div className="policies-info">
                { children }
            </div>
          </div>
        </div>
        <Footer />
      </section>
      
    </div>
  )
}