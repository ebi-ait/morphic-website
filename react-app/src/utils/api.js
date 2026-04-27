export const PROXY_ENABLED =
  process.env.GATSBY_PROXY_ENABLED === "TRUE" ?? false;
export const BULK_SEARCH_URL =
  process.env.GATSBY_BULK_SEARCH_URL ?? "https://46ucfedadd.execute-api.us-east-1.amazonaws.com";


export const fetchGenesInBulk = async (genes) => {
  const domain = PROXY_ENABLED ? "http://localhost:8010/proxy" : BULK_SEARCH_URL;
  const response = await fetch(
    `${domain}/api/bulk-gene-search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genes }),
    }
  );
  return response.json();
};
