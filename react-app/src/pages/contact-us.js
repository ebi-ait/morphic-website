import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Seo } from "../utils/Seo";

import * as style from "../styles/contact-us.module.css";

export default function ContactUs() {
  return (
    <div className="about">
      <div>
        <Navbar />
        <div className={style.triangle}></div>
      </div>

      <div className={style.contactContainer}>
        <div className={style.contactInfoContainer}>
          <div className={`${style.contactInfo} ${style.contactInfoBg}`}>
            <div>
              <h1>Contact Us</h1>
            </div>

            <section className={style.contactSection}>
              <div className={style.contactCardRow}>
                <div className={style.contactCard}>
                  <div className={style.contactCardBody}>
                    <h2>Data release enquiries</h2>
                    <p>
                      For data release enquiries, contact the MorPhiC Data
                      Resource and Administrative Coordinating Center (DRACC)
                    </p>
                  </div>
                  <div className={style.contactCardFooter}>
                    <a href="mailto:helpdesk@morphic.bio">helpdesk@morphic.bio</a>
                  </div>
                </div>

                <div className={style.contactCard}>
                  <div className={style.contactCardBody}>
                    <h2>General enquiries</h2>
                    <p>
                      For any enquiries about the MorPhiC Program Grant, contact
                    </p>
                  </div>
                  <div className={style.contactCardFooter}>
                    <a href="mailto:morphicprogram@mail.nih.gov">morphicprogram@mail.nih.gov</a>
                  </div>
                </div>
              </div>
            </section>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}