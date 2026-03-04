import { useEffect, useMemo, useState } from "react";

const GENE_API_BASE =
  process.env.GATSBY_GENE_API ??
  "https://46ucfedadd.execute-api.us-east-1.amazonaws.com";

export default function useUmapData(genotypes, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const genoKey = useMemo(
    () => (genotypes || []).map((g) => String(g).trim()).filter(Boolean).join(","),
    [genotypes]
  );

  useEffect(() => {
    if (!enabled || !genoKey) return;

    const controller = new AbortController();

    async function fetchUmap() {
      setLoading(true);
      setError(null);

      try {
        const qs = encodeURIComponent(genoKey);
        const res = await fetch(`${GENE_API_BASE}/api/umap?genotypes=${qs}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`UMAP fetch failed (${res.status})`);

        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("[useUmapData] error", err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUmap();
    return () => controller.abort();
  }, [enabled, genoKey]);

  return { data, loading, error };
}
