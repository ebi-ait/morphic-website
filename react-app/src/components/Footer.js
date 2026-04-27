import React from "react"

import logo from "../images/logos/morphic-symbol.svg";
import * as style from "../styles/footer.module.css";

export default function Footer() {
  return (
    <div className={style.footerWrap}>
      <footer className={style.footer}>
        <div className={style.footerLogoContainer}>
          <img
            src={logo}
            alt="MorPhiC logo"
            className={style.footerLogo}
          ></img>
        </div>
        <div className={style.footerCopyrightContainer}>
          <p className={style.footerCopyrightTitle}>Molecular Phenotypes of Null Alleles in Cells</p>
          <p className={style.footerCopyright}>&copy; 2024 MorPhiC. All rights reserved.</p>
          <p className={style.footerPhotoCredit}>Photo by Sangharsh Lohakare on Unsplash</p>
        </div>
      </footer>
    </div>
  )
}
