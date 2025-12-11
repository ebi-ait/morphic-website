import { useEffect, useState } from 'react';

const API_BASE = process.env.GATSBY_GENE_API || 'https://46ucfedadd.execute-api.us-east-1.amazonaws.com';

function parseTsv(tsvText, analysisTitle) {
  const lines = tsvText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  if (lines.length === 0) return [];

  const header = lines[0].split('\t');
  const lower = header.map((h) => h.toLowerCase());

  const findExactIdx = (...candidates) => {
    for (const c of candidates) {
      const target = c.toLowerCase();
      const idx = lower.indexOf(target);
      if (idx !== -1) return idx;
    }
    return -1;
  };

  // gene ID / symbol detection
  const idxGeneId = (() => {
    const idx = findExactIdx('gene_id', 'ensembl_gene_id', 'gene.stable_id', 'ensembl_id');
    if (idx !== -1) return idx;
    const idxLoose = lower.findIndex((h) => /gene[_ ]?id/.test(h));
    return idxLoose;
  })();

  const idxSymbol = (() => {
    const idx = findExactIdx('symbol', 'hgnc_symbol', 'gene_symbol', 'gene_name');
    if (idx !== -1) return idx;
    const idxLoose = lower.findIndex((h) => /symbol|gene(_name)?/.test(h));
    return idxLoose;
  })();

  // ---------- classify log2fc / padj like Python ----------
  const classifyDeColumns = () => {
    // 1) Generic case
    const genericLog2fc = findExactIdx('log2foldchange', 'log2fc', 'logfc', 'log2_fold_change');
    const genericPadj   = findExactIdx('padj', 'padjust', 'p_adj', 'p_adj_bh', 'fdr', 'qvalue');

    if (genericLog2fc !== -1 && genericPadj !== -1) {
      return { idxLog2fc: genericLog2fc, idxPadj: genericPadj };
    }

    // 2) Condition-specific columns
    const suffix = '_log2foldchange';
    const condCols = header
      .map((h, i) => ({ h, i }))
      .filter(({ h }) => h.toLowerCase().endsWith(suffix));

    if (!condCols.length) {
      return { idxLog2fc: -1, idxPadj: -1 };
    }

    const titleL = (analysisTitle || '').toLowerCase();
    const prefixToIdx = {};
    condCols.forEach(({ h, i }) => {
      const prefix = h.slice(0, -suffix.length); // e.g. "PAX6_KO"
      prefixToIdx[prefix] = i;
    });

    const padjIdxForPrefixStrict = (prefix) => {
      const name = `${prefix}_padj`.toLowerCase();
      const idx = lower.indexOf(name);
      return idx !== -1 ? idx : -1;
    };

    const pickByKeyword = (keywords) => {
      for (const kw of keywords) {
        for (const [prefix, idxLfc] of Object.entries(prefixToIdx)) {
          if (prefix.toLowerCase().includes(kw) && titleL.includes(kw)) {
            const idxPadj = padjIdxForPrefixStrict(prefix);
            if (idxPadj !== -1) {
              return { idxLog2fc: idxLfc, idxPadj };
            }
          }
        }
      }
      return null;
    };

    // Priority: revert → ko → ptc → ce
    let choice =
      pickByKeyword(['revert']) ||
      pickByKeyword(['ko']) ||
      pickByKeyword(['ptc']) ||
      pickByKeyword(['ce']);

    // Fallback: first prefix with *_padj
    if (!choice) {
      for (const [prefix, idxLfc] of Object.entries(prefixToIdx)) {
        const idxPadj = padjIdxForPrefixStrict(prefix);
        if (idxPadj !== -1) {
          choice = { idxLog2fc: idxLfc, idxPadj };
          break;
        }
      }
    }

    if (!choice) {
      return { idxLog2fc: -1, idxPadj: -1 };
    }

    return choice;
  };

  const { idxLog2fc, idxPadj } = classifyDeColumns();

  const idxDiffexpressed = (() => {
    const idx = findExactIdx('diffexpressed', 'de_label', 'delabel');
    if (idx !== -1) return idx;
    return lower.findIndex((h) => h.includes('diffexpressed'));
  })();

  const idxCellType = (() => {
    const idx = findExactIdx('celltype', 'cell_type');
    if (idx !== -1) return idx;
    return lower.findIndex((h) => h.includes('celltype'));
  })();

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    if (!cols.length) continue;

    const geneId  = idxGeneId  >= 0 ? cols[idxGeneId]  : '';
    const symbol  = idxSymbol  >= 0 ? cols[idxSymbol]  : '';
    const label   = symbol || geneId || `row_${i}`;

    if (idxLog2fc < 0) continue;
    const log2fc = parseFloat(cols[idxLog2fc]);
    if (Number.isNaN(log2fc)) continue;

    // padj only (no padj→pvalue fallback)
    let padj = null;
    if (idxPadj >= 0) {
      const raw = cols[idxPadj];
      const v = parseFloat(raw);
      if (!Number.isNaN(v)) {
        padj = v;
      }
    }

    const diffexpressed =
      idxDiffexpressed >= 0 ? cols[idxDiffexpressed] : undefined;
    const celltype = idxCellType >= 0 ? cols[idxCellType] : undefined;

    rows.push({ geneId, symbol, label, log2fc, padj, diffexpressed, celltype });
  }

  return rows;
}

// Hook
export default function useDeTsvData(tsvKey, { enabled = true, title } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(Boolean(tsvKey && enabled));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tsvKey || !enabled) {
      setRows([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API_BASE}/api/de-tsv?tsv_file_id=${encodeURIComponent(
          tsvKey
        )}`;

        console.log('[useDeTsvData] fetching', url);

        const res = await fetch(url);

        if (res.status === 404) {
          console.warn('[useDeTsvData] TSV not found (404) for', tsvKey);
          if (!cancelled) {
            setRows([]);
            setLoading(false);
            setError(null);
          }
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch DE TSV (${res.status})`);
        }

        const text = await res.text();
        if (cancelled) return;

        // 👇 pass title through
        const parsed = parseTsv(text, title);
        console.log(
          `[useDeTsvData] parsed ${parsed.length} rows from`,
          tsvKey
        );

        setRows(parsed);
        setLoading(false);
      } catch (e) {
        console.error('useDeTsvData error', e);
        if (!cancelled) {
          setError(e);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tsvKey, enabled, title]);

  return { rows, loading, error };
}
