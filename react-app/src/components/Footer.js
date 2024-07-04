import { Link } from "gatsby"
import React from "react"

import { StaticImage } from "gatsby-plugin-image"

export default function Footer() {
  return (
    <div className="footer-wrap">
      <footer class="footer">
        <div className="footer-logo-container">
          <StaticImage
            src="../images/external/logos/footer-logo.png"
            alt="MorPhiC logo"
            width={32.85}
            height={33}
            className="footer-logo"
          />
        </div>
        <div className="footer-content">
          <ul className="footer-menu">
            <li>
              <Link to="/">home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/data">Data</Link>
            </li>
            <li>
              <a href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer">Gene list</a>
            </li>
            <li>
              <Link to="/#faq">FAQ</Link>
            </li>
            <li>
              <Link to="/contact">Contact us</Link>
            </li>
          </ul>
          <div className="footer-photo-credit">Photo by Sangharsh Lohakare on Unsplash</div>
          <div className="footer-copyright-container">
            <p className="footer-copyright-tile">Molecular Phenotypes of Null Alleles in Cells</p>
            <p className='footer-copyright'>&copy; 2024 MorPhiC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
