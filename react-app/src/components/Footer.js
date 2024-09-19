import { Link } from "gatsby"
import React from "react"

import logo from "../images/logos/morphic-symbol.svg";

export default function Footer() {
  return (
    <div className="footer-wrap">
      <footer className="footer">
        <div className="footer-logo-container">
          <img
            src={logo}
            alt="MorPhiC logo"
            className="footer-logo"
          ></img>
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
              <Link to="/policies/code-of-conduct">Policies</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact us</Link>
            </li>
          </ul>
          <div className="footer-photo-credit">Photo by Sangharsh Lohakare on Unsplash</div>
          <div className="footer-copyright-container">
            <p className="footer-copyright-title">Molecular Phenotypes of Null Alleles in Cells</p>
            <p className='footer-copyright'>&copy; 2024 MorPhiC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
