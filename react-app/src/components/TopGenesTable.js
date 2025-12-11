import React, { useMemo } from 'react';
import useDeTsvData from '../hooks/useDeTsvData';

const defaultFormatPadj = (p) => {
  if (p === null || p === undefined || Number.isNaN(p)) return 'NA';
  if (p === 0) return '0';
  const abs = Math.abs(p);
  if (abs < 1e-4) return p.toExponential(1);
  if (abs < 1e-3) return p.toExponential(2);
  return p.toFixed(3);
};

const TopGenesTable = ({
                         tsvKey,
                         padjCutoff = 0.05,
                         lfcCutoff = 1,
                         maxRows = 50,
                         geneOfInterest,
                         useSharedFormatter = false,
                       }) => {
  const { rows, loading, error } = useDeTsvData(tsvKey);
  const fmtPadj = useSharedFormatter ? formatPadj : defaultFormatPadj;

  const sorted = useMemo(() => {
    if (!rows || !rows.length) return [];

    const filtered = rows.filter((r) => r.padj !== null);

    // Sort by padj ascending, then |log2FC| descending
    filtered.sort((a, b) => {
      if (a.padj !== b.padj) return a.padj - b.padj;
      return Math.abs(b.log2fc) - Math.abs(a.log2fc);
    });

    return filtered.slice(0, maxRows);
  }, [rows, maxRows]);

  if (!tsvKey) return <p>No table available.</p>;

  if (loading) return <p>Loading gene table…</p>;

  if (error || !sorted.length) {
    return <p>Gene table unavailable for this experiment.</p>;
  }

  return (
    <div className="top-genes-table-wrapper">
      <table className="top-genes-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Gene</th>
          <th>log₂FC</th>
          <th>padj</th>
          <th>Significant</th>
        </tr>
        </thead>
        <tbody>
        {sorted.map((r, i) => {
          const isSig =
            r.padj !== null &&
            r.padj < padjCutoff &&
            Math.abs(r.log2fc) >= lfcCutoff;

          const isFocus =
            geneOfInterest && r.label === geneOfInterest;

          return (
            <tr
              key={`${r.label}-${i}`}
              className={[
                isSig ? 'is-significant' : '',
                isFocus ? 'is-focus-gene' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <td>{i + 1}</td>
              <td>{r.label}</td>
              <td>{r.log2fc.toFixed(2)}</td>
              <td>{fmtPadj(r.padj)}</td>
              <td>{isSig ? '✓' : ''}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default TopGenesTable;
