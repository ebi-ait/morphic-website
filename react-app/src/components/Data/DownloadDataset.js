import React from "react"

import * as style from "./download-dataset.module.css";

export default function DownloadDataSet({ setGeneListId, data }) {
    const handleClose = (e) => {
        e.stopPropagation();
        setGeneListId(-1);
    }

    return (
        <div id="download-dataset" className={style.downloadDataset}>
            <div className={style.card}>
                <div className={style.cardHeader}>
                    <div className={style.headerFlex}>
                        <h3>Select dataset resource</h3>
                        <button aria-label="Close list" onClick={handleClose}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.314029 0.314028C0.732733 -0.104676 1.41158 -0.104676 1.83029 0.314028L11.686 10.1697C12.1047 10.5884 12.1047 11.2673 11.686 11.686C11.2673 12.1047 10.5884 12.1047 10.1697 11.686L0.314029 1.83029C-0.104674 1.41158 -0.104674 0.732731 0.314029 0.314028Z" fill="#1E1E1E" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.314028 11.686C-0.104676 11.2673 -0.104676 10.5884 0.314028 10.1697L10.1697 0.314056C10.5884 -0.104647 11.2673 -0.104647 11.686 0.314056C12.1047 0.73276 12.1047 1.41161 11.686 1.83032L1.83029 11.686C1.41158 12.1047 0.732731 12.1047 0.314028 11.686Z" fill="#1E1E1E" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={style.cardBody}>
                    {data[0] && (
                        <section className={style.resource}>
                            <div className="resource-image">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.50875 17.4675H15.495C15.9262 17.4675 16.275 17.1187 16.275 16.6875C16.275 16.2563 15.9262 15.9075 15.495 15.9075H8.50875C8.0775 15.9075 7.72875 16.2563 7.72875 16.6875C7.72875 17.1187 8.0775 17.4675 8.50875 17.4675ZM8.50875 14.3512H15.495C15.9262 14.3512 16.275 14.0025 16.275 13.5712C16.275 13.14 15.9262 12.7913 15.495 12.7913H8.50875C8.0775 12.7913 7.72875 13.14 7.72875 13.5712C7.72875 14.0025 8.0775 14.3512 8.50875 14.3512ZM8.50875 11.19H15.495C15.9262 11.19 16.275 10.8413 16.275 10.41C16.275 9.97875 15.9262 9.63 15.495 9.63H8.50875C8.0775 9.63 7.72875 9.97875 7.72875 10.41C7.72875 10.8413 8.0775 11.19 8.50875 11.19ZM8.50875 8.14125H12.2438C12.675 8.14125 13.0238 7.7925 13.0238 7.36125C13.0238 6.93 12.675 6.58125 12.2438 6.58125H8.50875C8.0775 6.58125 7.72875 6.93 7.72875 7.36125C7.72875 7.7925 8.0775 8.14125 8.50875 8.14125ZM12 0C5.37375 0 0 5.37375 0 12C0 18.6262 5.37375 24 12 24C18.6262 24 24 18.6262 24 12C24 5.37375 18.6262 0 12 0ZM18 19.125H6V5.02125H18V19.125ZM14.8762 8.145H18L14.8762 5.02125V8.145Z" fill="#04989E" />
                                </svg>

                            </div>
                            <div className={style.resourceInfo}>
                                <dl>
                                    <dt>Raw reads fastq</dt>
                                    <a className={style.link} href={`https://www.ebi.ac.uk/ena/browser/view/${data[0]}`} target="_blank">{data[0]}</a>
                                    <dd><a className={style.link}></a></dd>
                                </dl>
                            </div>
                        </section>
                    )}
                    {data[1] && (
                        <section className={style.resource}>
                            <div className="resource-image">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.50875 17.4675H15.495C15.9262 17.4675 16.275 17.1187 16.275 16.6875C16.275 16.2563 15.9262 15.9075 15.495 15.9075H8.50875C8.0775 15.9075 7.72875 16.2563 7.72875 16.6875C7.72875 17.1187 8.0775 17.4675 8.50875 17.4675ZM8.50875 14.3512H15.495C15.9262 14.3512 16.275 14.0025 16.275 13.5712C16.275 13.14 15.9262 12.7913 15.495 12.7913H8.50875C8.0775 12.7913 7.72875 13.14 7.72875 13.5712C7.72875 14.0025 8.0775 14.3512 8.50875 14.3512ZM8.50875 11.19H15.495C15.9262 11.19 16.275 10.8413 16.275 10.41C16.275 9.97875 15.9262 9.63 15.495 9.63H8.50875C8.0775 9.63 7.72875 9.97875 7.72875 10.41C7.72875 10.8413 8.0775 11.19 8.50875 11.19ZM8.50875 8.14125H12.2438C12.675 8.14125 13.0238 7.7925 13.0238 7.36125C13.0238 6.93 12.675 6.58125 12.2438 6.58125H8.50875C8.0775 6.58125 7.72875 6.93 7.72875 7.36125C7.72875 7.7925 8.0775 8.14125 8.50875 8.14125ZM12 0C5.37375 0 0 5.37375 0 12C0 18.6262 5.37375 24 12 24C18.6262 24 24 18.6262 24 12C24 5.37375 18.6262 0 12 0ZM18 19.125H6V5.02125H18V19.125ZM14.8762 8.145H18L14.8762 5.02125V8.145Z" fill="#04989E" />
                                </svg>

                            </div>
                            <div className={style.resourceInfo}>
                                <dl>
                                    <dt>Processed counts</dt>
                                    <a className={style.link} href={`https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${data[1]}`} target="_blank">{data[1]}</a>
                                    <dd><a className={style.link} ></a></dd>
                                </dl>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
