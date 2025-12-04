// src/hooks/useEnrichmentTsvData.js
import { useEffect, useState } from "react";
import { parseTsv, normaliseEnrichmentRows } from "../utils/tsv";

export function useEnrichmentTsvData(tsvKey, titleForFilename = "enrichment") {
  const [state, setState] = useState({
    rows: [],
    loading: !!tsvKey,
    error: null,
  });

  useEffect(() => {
    if (!tsvKey) {
      setState({ rows: [], loading: false, error: null });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const url = `http://localhost:3000/download?tsv_file_id=${encodeURIComponent(
          tsvKey
        )}&file_name=${encodeURIComponent(titleForFilename)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch enrichment TSV");
        const text = await res.text();

        if (cancelled) return;

        const { columns, rows } = parseTsv(text);
        const normalised = normaliseEnrichmentRows(columns, rows);

        const filtered = normalised.rows
          .filter((r) => r.padj !== null && r.pathway)
          .sort((a, b) => a.padj - b.padj)
          .slice(0, 30);

        setState({ rows: filtered, loading: false, error: null });
      } catch (e) {
        if (!cancelled) {
          setState({ rows: [], loading: false, error: e.message });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tsvKey, titleForFilename]);

  return state;
}
