import React, { useEffect, useState } from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import cover from "../images/external/sangharshlohakare8olkmpo8ugunsplash11571-51ur-800h.png"
import { Link } from "gatsby"
import Download from "../components/Data/DownloadDataset"
import FilterDropdown from "../components/DataTrackerFilters/FilterDropdown"
import FilterTags from "../components/DataTrackerFilters/FilterTags"
import { Seo } from "../utils/SEO";

function Layout({ children }) {
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
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default function Data() {

    const [studiesData, setStudiesData] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [collapse, setCollapse] = useState(false);
    const handleCollapse = () => {
        setCollapse(!collapse);
    }

    const [filteredData, setFilteredData] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const [geneListId, setGeneListId] = useState(-1);
    const [targetGenesMap, setTargetGenesMap] = useState({});

    const [selectedCenters, setSelectedCenters] = useState(new Set());
    const [selectedAssay, setSelectedAssay] = useState(new Set());
    const [selectedCellLines, setSelectedCellLine] = useState(new Set());
    const [selectedPerturbationType, setSelectedPerturbationType] = useState(new Set());
    const [selectedModelSystem, setSelectedModelSystem] = useState(new Set());

    const handleClearAll = () => {
        setSearchInput('')
        setSelectedCellLine(new Set());
        setSelectedAssay(new Set());
        setSelectedPerturbationType(new Set());
        setSelectedCenters(new Set());
        setSelectedModelSystem(new Set());
    }

    const updateSet = (set, item) => {
        const newSet = new Set(set);
        if (newSet.has(item)) {
            newSet.delete(item);
        } else {
            newSet.add(item);
        }
        return newSet;
    }

    const handleSelectedCellLine = (cellLine) => {
        const updatedSet = updateSet(selectedCellLines, cellLine);
        setSelectedCellLine(updatedSet);
    }
    const handleSelectedCenterInput = (centerName) => {
        const updatedSet = updateSet(selectedCenters, centerName);
        setSelectedCenters(updatedSet);
    }
    const handleSelectedAssayInput = (assay) => {
        const updatedSet = updateSet(selectedAssay, assay);
        setSelectedAssay(updatedSet);
    }
    const handleSelectedPerturbationType = (type) => {
        const updatedSet = updateSet(selectedPerturbationType, type);
        setSelectedPerturbationType(updatedSet);
    }
    const handleSelectedModelSystem = (type) => {
        const updatedSet = updateSet(selectedModelSystem, type);
        setSelectedModelSystem(updatedSet);
    }


    const fetchGenesInBulk = async (genes) => {
        const response = await fetch('https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/bulk-gene-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ genes }),
        });
        return response.json();
    };

    // Fetch data once when component mounts
    useEffect(() => {
        const getStudiesData = async () => {
            try {
                const response = await fetch(`https://api.ingest.dev.archive.morphic.bio/studies/search/findByReleaseStatus?releaseStatus=PUBLIC&page=0&size=20`);

                if (!response.ok) {
                    throw new Error("Nework response was not ok");
                }

                const resultStudiesData = await response.json();
                setStudiesData(resultStudiesData);
                setFilteredData(resultStudiesData._embedded.studies);

                // Extract all target genes across studies
                const allTargetGenes = resultStudiesData._embedded.studies.flatMap(
                    (study) => study.content?.target_genes || []
                );
                // Fetch HGNC_IDs for these genes
                const uniqueGenes = [...new Set(allTargetGenes)]; // Remove duplicates
                const genesWithIDs = await fetchGenesInBulk(uniqueGenes);

                // Map genes to their HGNC_IDs
                const geneMap = genesWithIDs.reduce((map, gene) => {
                    map[gene.Name] = gene.HGNC_ID;
                    return map;
                }, {});
                setTargetGenesMap(geneMap);
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false);
            }
        }

        getStudiesData();
    }, []);

    useEffect(() => {
        if (studiesData) {
            let result = studiesData;

            // Filter by search input
            if (searchInput) {
                result = studiesData._embedded.studies.filter(
                    (study) => study.content?.target_genes?.filter((gene) => gene.includes(searchInput.toUpperCase())).length > 0
                );
            } else {
                result = studiesData._embedded.studies
            }
            //Filter by Model System
            if (selectedModelSystem.size > 0) {
                result = result.filter(
                    (study) => {
                        const modelSystems = study.content?.model_organ_systems
                        if (!modelSystems) return false
                        const listOfModelSystems = Array.isArray(modelSystems)
                          ? modelSystems
                          : [modelSystems]
                        console.log("listOfModelSystems: ", listOfModelSystems);
                        return listOfModelSystems.some(name => selectedModelSystem.has(name))
                    }
                );
            }
            // Filter by cell line
            if (selectedCellLines.size > 0) {
                result = result.filter(
                    (study) => {
                        const cellLineNames = study.content?.cell_line_names

                        if (!cellLineNames) return false

                        const listOfCellLineNames = Array.isArray(cellLineNames)
                          ? cellLineNames
                          : [cellLineNames]

                        return listOfCellLineNames.some(name => selectedCellLines.has(name))
                    }
                );
            }
            // Filter by assay
            if (selectedAssay.size > 0) {
                result = result.filter(
                    (study) => [...selectedAssay].some(name => study.content?.readout_assay?.includes(name))
                );
            }
            // Filter by perturbation type
            if (selectedPerturbationType.size > 0) {
                result = result.filter(
                    (study) => {
                        const perturbationType = study.content?.perturbation_type

                        if (!perturbationType) return false

                        const listOfPertubationType = Array.isArray(perturbationType)
                          ? perturbationType
                          : [perturbationType]

                        return listOfPertubationType.some(name => selectedPerturbationType.has(name))
                    }
                );
            }
            // Filter by center
            if (selectedCenters.size > 0) {
                result = result.filter(
                    (study) => [...selectedCenters].some(name => study.content?.institute?.includes(name))
                );
            }

            setFilteredData(result)
        }
    }, [searchInput, selectedCenters, selectedAssay, selectedCellLines, selectedModelSystem, selectedPerturbationType]);

    if (isLoading) return (<Layout><p>Loading...</p></Layout>);
    if (error) return (<Layout><p>Error loading studies</p></Layout>)

  return (

    <Layout>
                <div className="data-card-header">
                    <div className="data-card-header-container">
                        <span aria-hidden className="data-card-header-icon icon-data-tracker"></span>
                        <div>
                            <h1 className="dc-heading">Data Catalogue</h1>
                            <p>All data generated as part of the MorPhiC program is made available in scheduled data releases and in public data repositories for wider use by the scientific community.</p>
                            <p>Current data release: 2.0, September 2025.</p>
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
                            <button className="data-card-clear-button" onClick={handleClearAll}>Clear all</button>
                        </div>
                        <div className="data-card-form-container">
                            <div className="data-card-form">
                                <label for="gene-id">Search by Gene ID</label>
                                <input type="text" id="gene-id" name="gene-id" value={searchInput} placeholder="Search by Gene ID" onChange={e => setSearchInput(e.target.value)}></input>
                                <FilterDropdown label="By model system" studiesData={filteredData} contentType={"model_organ_systems"} inputList={selectedModelSystem} updateInputList={handleSelectedModelSystem} />
                                <FilterDropdown label="By cell line" studiesData={filteredData} contentType={"cell_line_names"} inputList={selectedCellLines} updateInputList={handleSelectedCellLine} />
                                <FilterDropdown label="By assay" studiesData={filteredData} contentType={"readout_assay"} inputList={selectedAssay} updateInputList={handleSelectedAssayInput} />
                                <FilterDropdown label="By perturbation type" studiesData={filteredData} contentType={"perturbation_type"} inputList={selectedPerturbationType} updateInputList={handleSelectedPerturbationType} />
                                <FilterDropdown label="By center" studiesData={filteredData} contentType={"institute"} inputList={selectedCenters} updateInputList={handleSelectedCenterInput} />

                                <div>
                                    <FilterTags tags={selectedModelSystem} updateTags={handleSelectedModelSystem}/>
                                    <FilterTags tags={selectedCellLines} updateTags={handleSelectedCellLine}/>
                                    <FilterTags tags={selectedAssay} updateTags={handleSelectedAssayInput}/>
                                    <FilterTags tags={selectedPerturbationType} updateTags={handleSelectedPerturbationType}/>
                                    <FilterTags tags={selectedCenters} updateTags={handleSelectedCenterInput}/>
                                </div>
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
                                <th>model system</th>
                                <th>cell line</th>
                                <th>assay</th>
                                <th>perturbation type</th>
                                <th></th>
                            </tr>
                            {filteredData.map((data, index) => {
                                const targetGenes = data.content?.target_genes ?? [];
                                const hasExtra    = targetGenes.length > 1;

                                return data.content?.study_title && (
                                <tr key={`content_item_${index}`}>
                                    <td><span className="icon-triple-squares icon"></span></td>
                                    <td className="bold">
                                        <div title={data.content?.study_title} className="data-text">
                                            <Link to={`/dataset/${data.id ?? ''}`}>
                                                {data.content?.study_title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="data-text">{targetGenes[0] ?? '—'}</div>
                                        {hasExtra && (
                                            <div className="gene-count" onClick={e => setGeneListId(index)}>
                                                <span aria-hidden className="icon-plus-circle"></span> {data.content?.target_genes?.length - 1} more
                                                {geneListId === index ? (
                                                <figure className="expanded-gene-list">
                                                    <button className="gene-list-exit" aria-label="Close list" onClick={e => {e.stopPropagation(); setGeneListId(-1);}}><span className="icon-x icon"></span></button>
                                                    <figcaption>{data.content?.target_genes?.length - 1} genes</figcaption>
                                                    <ul>
                                                    {data.content?.target_genes?.map((gene, index) => (
                                                        <li key={`list_item_${index}`}>
                                                        <Link to={`/genes/${targetGenesMap[gene] ?? ''}`} className="gene-link">
                                                            {gene}
                                                        </Link>
                                                        </li>
                                                    ))}
                                                    </ul>
                                                </figure>): null}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {data.content?.model_organ_systems && data.content?.model_organ_systems.length == 1 &&
                                            <div className="data-text">{data.content?.model_organ_systems}</div>
                                        }
                                        {data.content?.model_organ_systems && data.content?.model_organ_systems.length > 1 &&
                                            data.content.model_organ_systems.map((result, i) => (
                                              <div key={i} className="data-text">{result}</div>
                                          ))
                                        }
                                    </td>
                                    <td>
                                        {data.content?.cell_line_names && data.content?.cell_line_names.length == 1 &&
                                            <div className="data-text">{data.content?.cell_line_names}</div>
                                        }
                                        {data.content?.cell_line_names && data.content?.cell_line_names.length > 1 &&
                                          data.content.cell_line_names.map((result, i) => (
                                              <div key={i} className="data-text">{result}</div>
                                          ))}
                                    </td>
                                    <td>
                                        <div className="data-text">{data.content?.readout_assay}</div>
                                    </td>
                                    <td>
                                        <div className="data-text">{data.content?.perturbation_type}</div>
                                    </td>
                                    <td>
                                        <div className="data-download-text">
                                            <button className={`data-gene-link ${geneListId === "download" + index ? "active-data-button": ""}`} onClick={e => setGeneListId("download" + index)}>Download ↓</button>
                                            {geneListId === "download" + index && (
                                                <Download key={`download_dataset_${index}`} setGeneListId={setGeneListId} data={data.accessions} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </table>
                    </div>
                </div>
    </Layout>
  );
}

export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}
