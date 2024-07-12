import React from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import cover from "../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png"

export default function Data() {
  return (
    <div>
      <div className="header-inline header-gradient">
        <img className="header-image" src={cover} alt=""></img>
        <div className="header-position-top">
          <Navbar />
        </div>
        <div className="header-position-bottom header-triangle"></div>
      </div>
      <div className="data-container">
        <div className="data-content">
            <div className="data-card">
                <div className="data-card-header">
                    <div className="data-card-header-container">
                        <span aria-hidden className="data-card-header-icon icon-data-tracker"></span>
                        <div>
                            <h1>Data Tracker</h1>
                            <p>Currently planned studies as part of the MorPhiC program</p>
                        </div>
                    </div>
                </div>
                <div className="data-card-body">
                    <div className="data-card-filter">
                        <div className="data-card-button-group">
                            <button className="data-card-filter-button"><img></img>Filter</button>
                            <button className="data-card-clear-button">Clear all</button>
                        </div>
                        <div className="data-card-form-container">
                            <form className="data-card-form">
                                <label for="gene-id">Search by Gene ID</label>
                                <input type="text" id="gene-id" name="gene-id" placeholder="Search by Gene ID"></input>
                                <label for="cell-line">By cell line</label>
                                <div className="select-wrapper"><select id="cell-line" name="cell-line">
                                    <option value="">By cell line</option>
                                    <option value=""></option>
                                </select></div>
                                <label for="assay">By assay</label>
                                <div className="select-wrapper"><select id="assay" name="assay">
                                    <option value="">By assay</option>
                                    <option value=""></option>
                                </select></div>
                                <label for="perturbation">By perturbation type</label>
                                <div className="select-wrapper"><select id="perturbation" name="perturbation">
                                    <option value="">By perturbation type</option>
                                    <option value=""></option>
                                </select></div>
                                <label for="model-system">By model system</label>
                                <div className="select-wrapper"><select id="model-system" name="model-system">
                                    <option value="">By model system</option>
                                    <option value=""></option>
                                </select></div>
                            </form> 
                        </div>
                    </div>
                    <div className="data-card-table-container">
                        <h3>15 of 15 studies shown</h3>
                        <table className="data-card-table">
                            <tr className="data-card-table-heading">
                                <th></th>
                                <th className="bold">study title</th>
                                <th>target genes</th>
                                <th>cell line</th>
                                <th>assay</th>
                                <th>perturbation type</th>
                                <th>centre</th>
                                <th>data</th>
                            </tr>
                            <tr>
                                <td><button><span className="icon-radio-open"></span></button></td>
                                <td className="bold">Genome-wide CRISPR/Cas screen in hESCs</td>
                                <td>PAX-6 + 996 more</td>
                                <td>KOLF 2.2</td>
                                <td>Perturb-Seq scRNASeq</td>
                                <td>Auxin-inducible degron (AID) CRISRP-Cas9 KO</td>
                                <td>MSKCC</td>
                                <td>124 FASTQ
                                3 protocols</td>
                                <td><div className="bold link-orange">465 GB<span className="icon-download"></span></div></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table> 
                    </div>
                </div>
            </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export function Head() {
    return (
      <>
        <title>Study Tracker</title>
        <link id="icon" rel="icon" href="favicon.svg" />
      </>
    )
  }