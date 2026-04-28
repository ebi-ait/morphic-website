import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FAQ from "../components/FAQ"

import { about } from "../styles/about.module.css";

const triangleSeparator = {
    clipPath: "polygon(-5% 105%, 105% 105%, 105% -5%)",
	backgroundColor: "var(--dl-color-default-smartblack)",
	width: "100%",
	height: "110px"
}

const colorThemeDefaultBlue = {
    backgroundColor: "var(--dl-color-default-darkblue)",
    color: "var(--dl-color-default-smartwhite)"
}

export default function faq() {
    return (
        <div>
            <div className={about}>
                <Navbar />
                <div style={triangleSeparator}></div>
            </div>

            {/* Main Content */}
            <FAQ />
            <div style={colorThemeDefaultBlue}>
                <Footer />
            </div>
        </div>
    )
}
