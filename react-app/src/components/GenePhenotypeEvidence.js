import React from "react";

const GenePhenotypeEvidence = ({ geneData }) => {
  const omimData = geneData?.Phenotype_Evidence?.Human?.OMIM || "";

  // Helper function to parse OMIM data into individual items
  const parseOMIMData = (data) => {
    return data.split("|").map((item) => {
      // Extract OMIM ID (numeric value) using a regular expression
      const match = item.match(/\((\d{6})\)/); // Matches 6-digit numbers in parentheses
      const omimId = match ? match[1] : null;

      return {
        text: item.trim(),
        omimId: omimId,
      };
    });
  };

  const parsedOMIM = parseOMIMData(omimData);

  return (
    <div>
      {parsedOMIM.length > 0 ? (
        <ul style={{ lineHeight: "1.6", listStyleType: "none", padding: 0 }}>
          {parsedOMIM.map((entry, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              {entry.omimId ? (
                <>
                  {entry.text.replace(`(${entry.omimId})`, "")}{" "}
                  <a
                    href={`https://omim.org/entry/${entry.omimId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    (OMIM:{entry.omimId})
                  </a>
                </>
              ) : (
                entry.text
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>N/A</p>
      )}
    </div>
  );
};

export default GenePhenotypeEvidence;
