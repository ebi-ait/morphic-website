import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { StaticImage } from "gatsby-plugin-image";

export default function ContactUs() {
  return (
    <div className="about">
      <div>
        <Navbar />
        <div className="policies-triangle"></div>
      </div>

      <div className="about-container">
        <div className="about-info-container">
          <div className="about-info contact-info-bg">
            <div>
              <h1>Contact Us</h1>
            </div>

            <section className="about-section">
              <div className="contact-card-row">
                <div className="contact-card">
                  <div className="contact-card-body">
                    <h2>Data release enquiries</h2>
                    <p>
                      For data release enquiries, contact the MorPhiC Data
                      Resource and Administrative Coordinating Center (DRACC)
                    </p>
                  </div>
                  <div className="contact-card-footer">
                    <a href="mailto:helpdesk@morphic.bio">helpdesk@morphic.bio</a>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-body">
                    <h2>General enquiries</h2>
                    <p>
                      For any enquiries about the MorPhiC Program Grant, contact
                    </p>
                  </div>
                  <div class="contact-card-footer">
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
