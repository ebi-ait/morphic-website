import React, { useState } from 'react';
import DynamicVolcanoPlot from './DynamicVolcanoPlot';
import TopGenesTable from './TopGenesTable';

const GeneDePanel = ({ analysis, geneName }) => {
  const [view, setView] = useState('volcano'); // 'volcano' | 'table'
  const [padjCutoff, setPadjCutoff] = useState(0.05);
  const [lfcCutoff, setLfcCutoff] = useState(1);
  const [showOnlySig, setShowOnlySig] = useState(false);
  const [colorMode, setColorMode] = useState('updown'); // 'updown' | 'gene' | 'mono'

  if (!analysis || !analysis.s3_tsv_key) {
    return (
      <div className="gene-de-panel gene-de-panel-empty">
        <p>No interactive DE results are available for this experiment.</p>
      </div>
    );
  }

  const tsvKey = analysis.s3_tsv_key;

  // 🔍 Only treat the special MSK "topDEG-dotplot" analysis as a dotplot
  const isTopDegDotplot =
    !!analysis.title &&
    /topdeg[-_ ]?dotplot/i.test(analysis.title);

  // 🔹 Only pass dotplot_data down for the special analysis
  const dotplotDataFromApi = isTopDegDotplot
    ? analysis.dotplot_data || null
    : null;

  // Still pass de_summary for everything (volcano/table can use this)
  const deSummary = analysis.de_summary || null;

  console.log(
    '[GeneDePanel] analysis title:',
    analysis.title,
    'isTopDegDotplot?',
    isTopDegDotplot,
    'has dotplot_data?',
    !!analysis.dotplot_data
  );

  // Cosmetic: label the main view differently for the dotplot analysis
  const volcanoOptionLabel = isTopDegDotplot
    ? 'Dotplot heatmap'
    : 'Volcano plot';

  return (
    <div className="gene-de-panel">
      <div className="gene-de-panel-header">
        <div className="gene-de-panel-title">
          <h3>Interactive gene expression</h3>
          <p className="gene-de-panel-subtitle">
            {analysis.title}
          </p>
        </div>

        <div className="gene-de-panel-controls">
          <label>
            View:&nbsp;
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option value="volcano">{volcanoOptionLabel}</option>
              <option value="table">Top genes table</option>
            </select>
          </label>

          <label>
            padj ≤&nbsp;
            <input
              type="number"
              min="0"
              max="1"
              step="0.001"
              value={padjCutoff}
              onChange={(e) =>
                setPadjCutoff(parseFloat(e.target.value) || 0.05)
              }
              style={{ width: '5rem' }}
            />
          </label>

          <label>
            |log₂FC| ≥&nbsp;
            <input
              type="number"
              min="0"
              step="0.1"
              value={lfcCutoff}
              onChange={(e) =>
                setLfcCutoff(parseFloat(e.target.value) || 0)
              }
              style={{ width: '4rem' }}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={showOnlySig}
              onChange={(e) => setShowOnlySig(e.target.checked)}
            />
            &nbsp;Only significant
          </label>

          <label>
            Colour by:&nbsp;
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value)}
            >
              <option value="updown">Up / down regulation</option>
              <option value="gene">Highlight this gene</option>
              <option value="mono">Monochrome</option>
            </select>
          </label>
        </div>
      </div>

      <div className="gene-de-panel-body">
        {view === 'volcano' && (
          <DynamicVolcanoPlot
            tsvKey={tsvKey}
            title={analysis.title}
            // filters (still ignored by the plot code for now, but fine to pass)
            padjCutoff={padjCutoff}
            lfcCutoff={lfcCutoff}
            showOnlySignificant={showOnlySig}
            colorMode={colorMode}
            geneOfInterest={geneName}
            // give the dotplot a bit more height
            height={isTopDegDotplot ? 480 : 360}
            // 🔹 Only non-null for the MSK topDEG-dotplot analysis
            dotplotDataFromApi={dotplotDataFromApi}
            deSummaryFromApi={deSummary}
          />
        )}

        {view === 'table' && (
          <TopGenesTable
            tsvKey={tsvKey}
            padjCutoff={padjCutoff}
            lfcCutoff={lfcCutoff}
            maxRows={50}
            geneOfInterest={geneName}
          />
        )}
      </div>
    </div>
  );
};

export default GeneDePanel;
