import React, { useEffect, useState } from "react";

import * as style from "../styles/search-bar.module.css";

export default function Searchbar() {
  const [input, setInput] = useState("");
  const [genes, setGenes] = useState([]);

  const [studies, setStudies] = useState(null); // Store fetched studies data

  const handleInput = (e) => {
    const userInput = e.target.value;
    console.log("User input:");
    console.log(userInput);

    if (userInput) {
      setInput(true)
    //   const filteredStudies = studies._embedded.studies.filter(
    //     (study) =>
    //       study.content?.target_genes?.filter((gene) =>
    //         gene.includes(userInput.toUpperCase())
    //       ).length > 0
    //   );
    //   console.log("filteredStudies:");
    //   console.log(filteredStudies);

      //   const geneSet = new Set(filteredStudies?.map(study => study.content?.target_genes));
      //   console.log("geneSet");
      //   console.log([...geneSet]);

      //   const geneSet = new Set();
      //   filteredStudies.forEach((study) => {
      //     study.content?.target_genes?.forEach((gene) => {
      //       geneSet.add(gene);
      //     });
      //   });

      const geneSet = new Set();
      studies._embedded.studies.forEach((study) => {
        study.content?.target_genes?.forEach((gene) => {
          if (gene.includes(userInput.toUpperCase())) {
            geneSet.add(gene);
          }
        });
      });

      console.log("genSet")
      console.log([...geneSet]);

      setGenes(geneSet.size > 0 ? [...geneSet] : []);
    }
  };

  const handleClickAway = (e) => {
    e.target.value = "";
    setInput(false);
    // setGenes([])
  }

  useEffect(() => {
    const getStudiesData = async () => {
      try {
        const response = await fetch(
          `https://api.ingest.dev.archive.morphic.bio/studies/`
        );

        if (!response.ok) {
          throw new Error("Nework response was not ok");
        }

        const resultStudiesData = await response.json();
        console.log(resultStudiesData);
        setStudies(resultStudiesData);
      } catch (error) {
        // setError(error);
        console.log(error);
      } finally {
        // setIsLoading(false);
      }
    };

    getStudiesData();
  }, []);

  return (
    <div className={style.search}>
      <div className={style.searchForm}>
        <label className={style.searchBox}>
          <span className="search-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.537 13.3474L11.2874 9.16111C11.9887 8.04422 12.3372 6.6874 12.1525 5.23958C11.7914 2.40598 9.36422 0.176336 6.47097 0.0108709C2.93104 -0.195961 -0.0041947 2.57558 4.49999e-06 6.0214C0.0042037 9.23143 2.67909 11.9327 5.93767 12.0195C7.04626 12.0485 8.09186 11.7837 8.99889 11.2997L13.3073 15.5439C13.9245 16.152 14.9198 16.152 15.537 15.5439C16.1543 14.9359 16.1543 13.9555 15.537 13.3474ZM6.10144 9.5665C4.10682 9.5665 2.49013 7.97389 2.49013 6.00899C2.49013 4.04409 4.10682 2.45149 6.10144 2.45149C8.09606 2.45149 9.71275 4.04409 9.71275 6.00899C9.71275 7.97389 8.09606 9.5665 6.10144 9.5665Z"
                fill="#1E1E1E"
              />
            </svg>
          </span>
          <input
            className={style.searchInput}
            placeholder="Search by Gene ID, name or synonym"
            onChange={handleInput}
            autoFocus
            onBlur={handleClickAway}
          />
        </label>
        <button className={style.searchButton}>Search</button>
      </div>

      {input && (
        <div className={style.searchResults}>
          <ul className={style.searchList}>
            {genes.length > 0 ? (
              genes.map((gene, index) => (
                <li key={`gene_item_${gene}`}>{gene}</li>
              ))
            ) : (
              <li>No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
