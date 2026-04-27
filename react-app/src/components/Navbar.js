import { Link } from "gatsby"
import React, { useState } from "react"

import logo from "../images/logos/morphic-logo-horizontal.svg"
import * as style from "../styles/navbar.module.css";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

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
                        <Link to="/order-cell-lines" activeClassName="navbar-active">
                            <span>Cell Lines</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/data" activeClassName="navbar-active">
                            <span>Data</span>
                        </Link>
                    </li>
                    <li className={style.dropdown}>
                        <button className={`${style.dropdownBtn} ${style.inlineText}`}>
                            <span>Software</span>
                            <ChevronDown size={16}/>
                        </button>
                        <div className={`${style.dropdownMenu} ${style.card}`}>
                            <ul className={`${style.cardBody} ${style.inlineList}`}>
                                <li>
                                    <span className={style.cardTitle}>In portal</span>
                                    <ul>
                                        <li>
                                            <a href="#">Tool & Apps</a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className={style.cardTitle}>External Tools</span>
                                    <ul>
                                        <li>
                                            <a className={style.inlineText} href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer">
                                                <span>Gene List</span>
                                                <ExternalLink size={16} />
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <div className={style.cardFooter}>
                                <a href="#" className={style.inlineText}>
                                    <span>View all</span>
                                    <ChevronRight size={16} />
                                </a>
                            </div>
                        </div>
                    </li>
                    <li>
                        <Link to="/methods" className="nav-link" activeClassName="navbar-active">
                            <span>Methods</span>
                        </Link>
                    </li>
                    <li className={style.dropdown}>
                        <Link to="/publications" className={`${style.dropdownBtn} ${style.inlineText}`} activeClassName="navbar-active">
                            <span>Publications</span>
                            <ChevronDown size={16} />
                        </Link>
                        <div className={`${style.dropdownMenu} ${style.card}`}>
                            <ul className={style.cardBody}>
                                <li>
                                    <Link to="/publications">Publications</Link>
                                </li>
                                <li>
                                    <Link to="/publications/#pre-prints">Pre-prints</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/news" className="nav-link" activeClassName="navbar-active">
                            <span>News</span>
                        </Link>
                    </li>
                    <li className={style.dropdown}>
                        <button className={`${style.dropdownBtn} ${style.inlineText}`}>
                            <span>About</span>
                            <ChevronDown size={16}/>
                        </button>
                        <div className={`${style.dropdownMenu} ${style.card}`}>
                            <ul className={style.cardBody}>
                                <li>
                                    <Link to="/about">About MorPhiC</Link>
                                </li>
                                <li>
                                    <Link to="/policies">Policies</Link>
                                </li>
                                <li>
                                    <Link to="/faq">FAQ</Link>
                                </li>
                                <li>
                                    <Link to="/contact-us">Contact</Link>
                                </li>
                            </ul>
                        </div>
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
                            <Link to="/order-cell-lines" className="nav-link" activeClassName={style.navbarActive}>
                                <span>Cell Lines</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/data" className="nav-link" activeClassName={style.navbarActive}>
                                <span>Data</span>
                            </Link>
                        </li>
                        <li>
                            <a href="https://whri-phenogenomics.shinyapps.io/morphic_gene_list/" target="_blank" rel="noopener noreferrer">
                                <span style={{paddingRight: "0.5rem"}}>Gene List</span>
                                <ExternalLink size={16} />
                            </a>
                        </li>
                        <li>
                            <Link to="/methods" activeClassName={style.navbarActive}>
                                <span>Methods</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/publications" activeClassName={style.navbarActive}>
                                <span>Publications</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/news" className="nav-link" activeClassName={style.navbarActive}>
                                <span>News</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" activeClassName={style.navbarActive}>
                                <span>About</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/policies" activeClassName={style.navbarActive}>
                                <span>Policies</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/faq" activeClassName={style.navbarActive}>
                                <span>FAQ</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact-us" className="nav-link" activeClassName={style.navbarActive}>
                                <span>Contact</span>
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
