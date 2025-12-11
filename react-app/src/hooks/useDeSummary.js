import { useEffect, useState } from 'react';

const API_BASE = process.env.GATSBY_GENE_API || 'https://46ucfedadd.execute-api.us-east-1.amazonaws.com';

export default function useDeSummary(tsvKey) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(Boolean(tsvKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tsvKey) {
      setSummary([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API_BASE}/api/de-summary?tsv_file_id=${encodeURIComponent(
          tsvKey
        )}`;

        console.log('[useDeSummary] fetching', url);
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Failed to fetch DE summary (${res.status})`);
        }

        const data = await res.json();
        if (cancelled) return;

        setSummary(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (e) {
        console.error('useDeSummary error', e);
        if (!cancelled) {
          setError(e);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tsvKey]);

  return { summary, loading, error };
}
