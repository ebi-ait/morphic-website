import React from "react";

const MousePhenotype = ({ mouseData }) => {
  // Safely extract the data or use default values
  const orthologRelation = mouseData?.Phenotype_Evidence?.Mouse?.Ortholog_Relation || "N/A";
  const homozygotePhenotypes = mouseData?.Phenotype_Evidence?.Mouse?.Homozygote_Phenotypes || "";
  const heterozygotePhenotypes = mouseData?.Phenotype_Evidence?.Mouse?.Heterozygote_Phenotypes || "";
  const viability = mouseData?.IMPC_Viability || "N/A";

  // Helper to parse phenotypes into an array
  const parsePhenotypes = (data) => {
    return data ? data.split("|").map((item) => item.trim()) : [];
  };

  const homozygoteList = parsePhenotypes(homozygotePhenotypes);
  const heterozygoteList = parsePhenotypes(heterozygotePhenotypes);

  const capitalizeWords = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="mouse-phenotype-card" style={styles.card}>
      {/* Homozygote Phenotypes */}
      <div>
        <h4 style={styles.sectionTitle}>Homozygote Phenotypes</h4>
        {homozygoteList.length > 0 ? (
          <ul style={styles.list}>
            {homozygoteList.map((phenotype, index) => (
              <li key={index} style={styles.listItem}>
                {capitalizeWords(phenotype)}
              </li>
            ))}
          </ul>
        ) : (
          <p>N/A</p>
        )}
      </div>

      {/* Heterozygote Phenotypes */}
      <div>
        <h4 style={styles.sectionTitle}>Heterozygote Phenotypes</h4>
        {heterozygoteList.length > 0 ? (
          <ul style={styles.list}>
            {heterozygoteList.map((phenotype, index) => (
              <li key={index} style={styles.listItem}>
                {capitalizeWords(phenotype)}
              </li>
            ))}
          </ul>
        ) : (
          <p>N/A</p>
        )}
      </div>

      {/* IMPC Viability */}
      <p>
        <strong>IMPC Viability:</strong>{" "}
        <span>{viability}</span>
      </p>
    </div>
  );
};

// Inline CSS for styling
const styles = {
  
  title: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    marginTop: "1rem",
    marginBottom: "0.5rem",
    color: "#333",
  },
  list: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
  },
  listItem: {
    marginBottom: "0.5rem",
  },
  important: {
    color: "#d9534f",
    fontWeight: "bold",
  },
};

export default MousePhenotype;
