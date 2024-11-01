import React, { useEffect, useState } from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import cover from "../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png"
import JSONData from "../../content/studies.json"
import { Link } from "gatsby"

export async function getServerData() {
    try {
      const response = await fetch(`https://api.ingest.dev.archive.morphic.bio/studies/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const studiesData = await response.json();
      return {
        props: studiesData,
        error: null,
      };
    } catch (error) {
      return {
        props: {},
        status: 500,
        error: { message: 'Error retrieving studies data' },
      };
    }
  }

export default function Data({ serverData }) {

    const [collapse, setCollapse] = useState(false);
    const handleCollapse = () => {
        setCollapse(!collapse);
    }

    const [filteredData, setFilteredData] = useState(JSONData._embedded.studies);
    const [searchInput, setSearchInput] = useState('');

    const [geneListId, setGeneListId] = useState(-1);

    useEffect(() => {
        let result = filteredData;
        
        if (searchInput) {
            result = JSONData._embedded.studies.filter(
                (study) => study.content?.target_genes?.filter((gene) => gene.includes(searchInput.toUpperCase())).length > 0
            );
        } else {
            result = JSONData._embedded.studies
        }
        
        setFilteredData(result)
    }, [searchInput]);
    
    // if (error) {
    //     return (
    //         <div>
    //             <Navbar />
    //             <h1>Something went wrong while retrieving the studies data</h1>
    //         </div>
    //     )
    // }
    // if (!serverData) {
    //     return (
    //         <div>
    //             <Navbar />
    //             <h1>Loading studies...</h1>
    //         </div>
    //     )
    // }

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
                    {collapse && (
                    <div className="data-card-filter data-card-filter-collapsed">
                        <button className="data-card-filter-button data-card-filter-button-collapse" onClick={() => setCollapse((prev) => !prev)}>
                            <span className="icon-arrow-right icon"></span>
                            <span className="text-rotate">Filter</span>
                        </button>
                    </div>
                    )}
                    {!collapse && (<>
                    <div className="data-card-filter">
                        <div className="data-card-button-group">
                            <button className="data-card-filter-button" onClick={() => setCollapse((prev) => !prev)}><span className="icon-arrow-left icon"></span>Filter</button>
                            <button className="data-card-clear-button" onClick={() => setSearchInput('')}>Clear all</button>
                        </div>
                        <div className="data-card-form-container">
                            <div className="data-card-form">
                                <label for="gene-id">Search by Gene ID</label>
                                <input type="text" id="gene-id" name="gene-id" placeholder="Search by Gene ID" onChange={e => setSearchInput(e.target.value)}></input>
                                <label for="cell-line">By cell line</label>
                                <div className="select-wrapper">
                                    <select id="cell-line" name="cell-line">
                                    <option value="">By cell line</option>
                                    <option value=""></option>
                                </select></div>
                                <label for="assay">By assay</label>
                                <div className="select-wrapper">
                                    <select id="assay" name="assay">
                                    <option value="">By assay</option>
                                    <option value=""></option>
                                </select></div>
                                <label for="perturbation">By perturbation type</label>
                                <div className="select-wrapper">
                                    <select id="perturbation" name="perturbation">
                                    <option value="">By perturbation type</option>
                                    <option value=""></option>
                                </select></div>
                                <label for="model-system">By model system</label>
                                <div className="select-wrapper">
                                    <select id="model-system" name="model-system">
                                    <option value="">By model system</option>
                                    <option value=""></option>
                                </select></div>
                            </div> 
                        </div>
                    </div>
                    </>)}
                    <div className="data-card-table-container">
                        <h3>{filteredData.length} of {filteredData.length} studies shown</h3>

                        <table className="data-card-table">
                            <tr className="data-card-table-heading">
                                <th></th>
                                <th className="bold">study title</th>
                                <th>target genes</th>
                                <th>cell line</th>
                                <th>assay</th>
                                <th>perturbation type</th>
                                <th>center</th>
                            </tr>
                            {filteredData.map((data, index) => (data?.content?.study_title && (
                                <tr key={`content_item_${index}`}>
                                    <td><span className="icon-triple-squares icon"></span></td>
                                    <td className="bold"><div>{data.content?.study_title}</div></td>
                                    <td>
                                        <div>{data.content?.target_genes[0]}</div>
                                        {data.content?.target_genes?.length - 1 > 0 ? (
                                            <div className="gene-count" onClick={e => setGeneListId(index)}>
                                                <span aria-hidden className="icon-plus-circle"></span> {data.content?.target_genes?.length - 1} more
                                                {geneListId === index ? (
                                                <figure className="expanded-gene-list">
                                                    <button className="gene-list-exit" aria-label="Close list" onClick={e => {e.stopPropagation(); setGeneListId(-1);}}><span className="icon-x icon"></span></button>
                                                    <figcaption>{data.content?.target_genes?.length - 1} genes</figcaption>
                                                    <ul>
                                                    {data.content?.target_genes?.map((gene, index) => (
                                                        <li key={`list_item_${index}`}>{gene}</li>
                                                    ))}
                                                    </ul>
                                                </figure>): null}
                                            </div>
                                        ): null}
                                    </td>
                                    <td>
                                        <div>{data.content?.cell_line_names}</div>
                                    </td>
                                    <td>
                                        <div>{data.content?.readout_assay}</div>
                                    </td>
                                    <td>
                                        <div>{data.content?.perturbation_type}</div>
                                    </td>
                                    <td>
                                        <div>{data.content?.institute}</div>
                                    </td>
                                    <td>
                                        <div><Link
                                            to="/gene"
                                            className="data-gene-link"
                                        >Explore →</Link></div>
                                    </td>
                                </tr>
                            )))}
                        </table> 
                    </div>
                </div>
            </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export function Head() {
    return (
      <>
        <title>MorPhiC program: Molecular Phenotypes of Null Alleles in Cells</title>
        <link id="icon" rel="icon" href="favicon.svg" />
      </>
    )
  }