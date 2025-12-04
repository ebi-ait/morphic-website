export function parseTsv(text) {
  if (!text) {
    return { columns: [], rows: [] };
  }

  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) {
    return { columns: [], rows: [] };
  }

  const columns = lines[0].split("\t").map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split("\t");
    const obj = {};
    for (let j = 0; j < columns.length; j++) {
      obj[columns[j]] = parts[j] ?? "";
    }
    rows.push(obj);
  }

  return { columns, rows };
}

function coerceNumber(val) {
  if (val === "" || val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

// Map raw TSV DE columns to standard fields
export function normaliseDeRows(columns, rows) {
  const colMap = {
    log2fc: ["log2fc", "log2FoldChange", "log2_fc", "logFC", "log2_FC"],
    padj: ["padj", "p_adj", "padj_bh", "FDR", "adj.P.Val"],
    symbol: ["symbol", "gene_symbol", "hgnc_symbol"],
    gene_id: ["gene_id", "ensembl_gene_id", "EnsemblID"],
  };

  const colIndex = {};
  for (const [canonical, synonyms] of Object.entries(colMap)) {
    const found = synonyms.find((s) =>
      columns.some((c) => c.toLowerCase() === s.toLowerCase())
    );
    if (found) {
      colIndex[canonical] = found;
    }
  }

  const normalised = rows.map((r) => ({
    symbol: r[colIndex.symbol] || null,
    gene_id: r[colIndex.gene_id] || null,
    log2fc: coerceNumber(r[colIndex.log2fc]),
    padj: coerceNumber(r[colIndex.padj]),
  }));

  return {
    columns: ["symbol", "gene_id", "log2fc", "padj"],
    rows: normalised,
  };
}

// Map raw enrichment TSV columns to standard fields
export function normaliseEnrichmentRows(columns, rows) {
  const colMap = {
    pathway: ["pathway", "term", "description", "gs_name"],
    padj: ["padj", "p_adj", "padj_bh", "FDR", "qvalue"],
    nes: ["nes", "NES"],
    size: ["set_size", "gene_set_size", "size"],
  };

  const colIndex = {};
  for (const [canonical, synonyms] of Object.entries(colMap)) {
    const found = synonyms.find((s) =>
      columns.some((c) => c.toLowerCase() === s.toLowerCase())
    );
    if (found) {
      colIndex[canonical] = found;
    }
  }

  const normalised = rows.map((r) => ({
    pathway: r[colIndex.pathway] || null,
    padj: coerceNumber(r[colIndex.padj]),
    nes: coerceNumber(r[colIndex.nes]),
    size: coerceNumber(r[colIndex.size]),
  }));

  return {
    columns: ["pathway", "padj", "nes", "size"],
    rows: normalised,
  };
}
