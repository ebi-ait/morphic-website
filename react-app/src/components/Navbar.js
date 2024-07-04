import { Link } from 'gatsby'
import React from 'react'
import { StaticImage } from "gatsby-plugin-image"


export default function Navbar() {
  return (
    <div className='navbar-container'>
        <nav className='navbar'>
            <div className='navbar-left'>
                <Link to="/" className="nav-link">
                    <StaticImage 
                        src="../images/external/vector1571-21gu.svg"
                        alt="MorPhiC logo"
                        placeholder="blurred"
                    />
                </Link>
            </div>
            <div className='navbar-right'>
                <ul className='navbar-list'>
                    <li>
                        <Link to="/" className="nav-link">
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="nav-link">
                            <span>About</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/data" className="nav-link">
                            <span>Data</span>
                        </Link>
                    </li>
                    <li>
                        <a className="nav-link" href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer">
                            Genes studied
                        </a>
                    </li>
                    <li>
                        <Link to="/#faq" className="nav-link">
                            <span>FAQ</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="nav-link">
                            <span>Contact us</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
  )
}
