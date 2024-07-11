import { Link } from 'gatsby'
import React from 'react'

import logo from "../images/logos/morphic-logo-horizontal.svg"


export default function Navbar() {
  return (
    <div className='navbar-container'>
        <nav className='navbar'>
            <div className='navbar-left'>
                <Link to="/" className="nav-link">
                    <img
                        src={logo}
                        alt="MorPhiC logo"
                    ></img>
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
