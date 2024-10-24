import { Link } from "gatsby"
import React, { useState } from "react"

import logo from "../images/logos/morphic-logo-horizontal.svg"
import * as style from "../styles/navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={style.navbarContainer}>
        <nav className='navbar'>
            <div className='navbar-left'>
                <Link to="/" className="nav-link">
                    <img
                        src={logo}
                        alt="MorPhiC logo"
                    ></img>
                </Link>
            </div>
            <div className={style.navbarRight}>
                <ul className={style.navbarList}>
                    <li>
                        <Link to="/" className="nav-link" activeClassName="navbar-active">
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="nav-link" activeClassName="navbar-active">
                            <span>About</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/data" className="nav-link" activeClassName="navbar-active">
                            <span>Data</span>
                        </Link>
                    </li>
                    <li>
                        <a className="nav-link" href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer">
                            Gene List
                        </a>
                    </li>
                    <li>
                        <Link to="/news" className="nav-link" activeClassName="navbar-active">
                            <span>News</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/#faq" className="nav-link">
                            <span>FAQ</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact-us" className="nav-link" activeClassName="navbar-active">
                            <span>Contact us</span>
                        </Link>
                    </li>
                </ul>
                <button className={style.mobileMenuBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                    {isOpen ? (
                    <span className="icon-x-white"></span>
                    ) : (
                    <span className="icon-list"></span>
                    )}
                </button>
            </div>
        </nav>
        {isOpen && (
        <div className={style.menuOverlay}>
            <nav className={style.navbarOverlay}>
                <div className={style.navbarTop}>
                    <Link to="/" className="nav-link">
                        <img
                            src={logo}
                            alt="MorPhiC logo"
                        ></img>
                    </Link>
                    <button className={style.mobileMenuBtn} onClick={() => setIsOpen(false)} aria-label="Close menu">
                        <span aria-hidden className="icon-x-white"></span>
                    </button>
                </div>
                <div className={style.navbarBottom}>
                    <ul className={style.navList}>
                        <li>
                            <Link to="/" className="nav-link" activeClassName={style.navbarActive}>
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="nav-link" activeClassName={style.navbarActive}>
                                <span>About</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/data" className="nav-link" activeClassName={style.navbarActive}>
                                <span>Data</span>
                            </Link>
                        </li>
                        <li>
                            <a className="nav-link" href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer">
                                Gene List
                            </a>
                        </li>
                        <li>
                            <Link to="/news" className="nav-link" activeClassName={style.navbarActive}>
                                <span>News</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/#faq" className="nav-link">
                                <span>FAQ</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact-us" className="nav-link" activeClassName={style.navbarActive}>
                                <span>Contact us</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        )}
    </div>
  )
}
