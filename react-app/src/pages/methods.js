import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "../styles/policies.module.css";
import { Seo } from "../utils/SEO";

export default function Methods() {
  return (
    <div className={styles.policies}>
      <Navbar />
      <div className={styles.policiesTriangle}></div>

      <section className={styles.policiesContainer}>
        <div className={styles.policiesContentContainer} style={{justifyContent: "flex-start"}}>
          <div className={styles.policiesContent}>

            {/* Side Menu */}
            <div style={{position: 'relative'}}>
              <div className={styles.policiesCard} style={{position: 'sticky', top: '1rem', marginTop: '40px', display: 'inline-block'}}>
                <h2 className="about-card-title">inside this page</h2>
                <ul style={{maxHeight: `max(calc(100vh - 7.5rem), 544px)`, overflowY: `auto`}}>
                  <li>
                    <a href="#dpc-experimental-strategies">DPCs Experimental Strategies</a>
                    <ul style={{paddingLeft: '1em'}}>
                      <li><a href="#gene-knock-out-ko">Gene knock-out (KO)</a></li>
                      <li><a href="#protein-degradation">Protein degradation</a></li>
                      <li><a href="#gene-knockdown">Gene knockdown</a></li>
                    </ul>
                  </li>
                  <li>
                    <a href="#dav-analysis-methods">DAVs Analysis Methods</a>
                    <ul style={{paddingLeft: '1em'}}>
                      <li><a href="#bulk-rnaseq-differential-expression-analysis">Bulk RNAseq Differential Expression Analysis</a></li>
                      <li><a href="#scrna-seq-cell-type-composition">scRNA-seq Cell Type Composition</a></li>
                      <li><a href="#scrna-seq-variance-decomposition">scRNA-seq Variance Decomposition</a></li>
                      <li><a href="#scrna-seq-differential-expression-analysis-pseudobulk-based">scRNA-seq Differential Expression Analysis - Pseudobulk-based approach</a></li>
                      <li><a href="#scrna-seq-differential-expression-analysis-cell-level">scRNA-seq Differential Expression Analysis - Cell-level approach</a></li>
                      <li><a href="#gene-progam-evaluation">Gene program evaluation</a></li>
                      <li><a href="#chrombpnet">ChromBPNet</a></li>
                    </ul>
                  </li>
                  <li>
                    <a href="#dracc-uniform-and-scalable-data-processing-methods">Uniform and Scalable Data Processing Methods by the DRACC</a>
                    <ul style={{paddingLeft: '1em'}}>
                      <li><a href="#analytical-pipelines">Analytical pipelines</a></li>
                      <li><a href="#scalable-data-processing">Scalable data processing</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className={styles.policiesInfo}>
                <h1 id="dpc-experimental-strategies" className={styles.titleL}>Experimental strategies for null allele generation</h1>
                <p>A proven strategy for understanding gene functions is to remove the gene or its protein product and perform a set of assays to study how its loss affects molecular and cellular phenotypes. The Data Production Centers have employed the following strategies for null allele generation:</p>

                <h2 id="gene-knock-out-ko" className={styles.titleM}>1. Gene knock-out (KO)</h2>

                <h3 className={styles.titleS}>KO - Premature termination codon (PTC)</h3>

                <p>Strategy used by: The Jackson Laboratory, view on <a href="https://www.protocols.io/view/jax-dpc-protocol-for-generating-ptc-1-knockout-all-5qpvo92dxv4o/v1" target="_blank" >protocols.io </a></p>

                <p>The PTC+1 strategy involves precise CRISPR-Cas9 engineering of a premature stop codon and the insertion of a degenerate base in an early common exon, thereby truncating all isoforms of the protein and introducing a frame-shift mutation to ensure the production of a non-functional protein, essentially "knocking out" the normal function of the gene. Depending on the position of the PTC+1 mutation with respect to the genomic structure of the gene, the mutant mRNA may or may not be subject to nonsense mediated decay (NMD). </p>
                <StaticImage src="../images/jax-ptc-1.png" alt="" loading="eager" placeholder="none"/>
                <p></p>

                <p>Strategy used by: Memorial Sloan Kettering Cancer Center </p>
                <p>Frameshift indel mutations introduced by CRISPR-Cas9 typically result in the creation of a premature stop codon within the coding region, producing a truncated, nonfunctional protein and effectively "knocking out" the gene’s normal function. At MSK, they have generated knockout hPSC lines, and a small number of enhancer deletion lines. Then they individually barcoded these lines, and pooled them for differentiation experiments. Cells were collected at consecutive differentiation stages for scRNA-seq, followed by computational demultiplexing to analyze the transcriptomic phenotypes associated with each individual knockout condition. </p>
                <StaticImage src="../images/msk-morphic-ko-strategy-ptc-1.png" alt="" loading="eager" placeholder="none"/>

                <h3 className={styles.titleS}>KO - Critical exon deletion</h3>

                <p>Strategy used by: The Jackson Laboratory, view on <a href="https://www.protocols.io/view/jax-dpc-protocol-to-generate-whole-gene-knockout-k-dyhw7t7e" target="_blank" >protocols.io </a></p>
                
                <p>A critical exon deletion refers to a genetic knockout (KO) where an early common, frame-shifting exon within a gene has been deleted, leading to a truncated, nonfunctional protein being produced; essentially "knocking out" the normal function of the gene. Depending on the position of the premature termination codon with respect to the genomic structure of the gene, the mutant mRNA may or may not be subject to nonsense mediated decay (NMD).</p>
                <StaticImage src="../images/critical-exon.png" alt="" loading="eager" placeholder="none"/>

                <h3 className={styles.titleS}>KO - Gene deletion</h3>
                <p>Strategy used by: The Jackson Laboratory, view on <a href="https://www.protocols.io/view/jax-dpc-protocol-to-generate-whole-gene-knockout-k-dyhw7t7e" target="_blank" >protocols.io </a> </p>

                <p>Gene deletion means the complete removal of most or all protein coding exons of the gene, eliminating the possibility of the protein production entirely. The non-coding RNA transcript that remains is not subject to nonsense mediated decay and can potentially be identified by RNA-seq.</p>
                <StaticImage src="../images/whole-gene.png" alt="" loading="eager" placeholder="none"/>

                <h3 className={styles.titleS}>KO - Insertion of a cassette (a KI-KO approach)</h3>

                <p>Strategy used by: Memorial Sloan Kettering Cancer Center </p>

                <p>A cassette is knocked into the target gene coding region. This insertion is expected to disrupt transcription due to the large insertion size, introduce frameshift mutations, and create a premature termination codon, thus effectively  "knocking out" the normal function of the gene.</p>
                <StaticImage
                    src="../images/msk-morphic-ko-strategy-ki-ko-1.png"
                    alt=""
                    loading="eager"
                    placeholder="none"
                />


                <h2 id="protein-degradation" className={styles.titleM}>2. Protein degradation</h2>


                <h3 className={styles.titleS}>Auxin-inducible degron</h3>

                <p>Strategy used by: Northwestern University</p>

                <p>Auxin-inducible degron (AID) is a chemical genetic tool that uses the plant hormone auxin to degrade specific proteins in mammalian cells, which allows researchers to study protein function in living tissues.</p>
                <p>At NWU, cells are engineered to express the TIR1 auxin receptor and Crispr-Cas9 technology is used to add the AID protein degron tag to specific endogenous gene loci. Cells express the tagged protein normally until treated with Auxin, which induces rapid, reversible protein degradation.</p>

                <StaticImage
                    src="../images/nwu-auxin-inducible-degron-1.png"
                    alt=""
                    loading="eager"
                    placeholder="none"
                />

                <h2 id="gene-knockdown" className={styles.titleM}>3. Gene knockdown</h2>


                <h3 className={styles.titleS}>CRISPR interference (CRISPRi)</h3>

                <p>Strategy used by: University of California San Francisco</p>
                
                <p>CRISPRi (CRISPR interference) utilizes a catalytically dead Cas9 (dCas9) protein fused to a KRAB (Krüppel-associated box) domain, a transcriptional repressor. A guide RNA (gRNA) directs dCas9-KRAB to a specific DNA sequence, where it binds and blocks transcription by recruiting endogenous chromatin-modifying repressive complexes via the KRAB domain. This approach enables reversible, precise, and non-destructive repression of gene expression at the transcriptional level, making it ideal for functional genomics and studying essential genes.</p>

                <h1 id="dav-analysis-methods" className={styles.titleL}>DAVs Analysis Methods</h1>

                <h2 id="bulk-rnaseq-differential-expression-analysis" className={styles.titleM}>Bulk RNAseq Differential Expression Analysis</h2>


                <p>Strategy used by: Fred Hutch Cancer Center, view on <a href="https://github.com/morphic-bio/MorPhiC_bulk_RNAseq" target="_blank" >GitHub</a></p>

                <p>To quantify KO effect using Bulk RNA-seq data, we mainly focus on Differential Expression (DE) analysis comparing knock out (KO) versus wild type (WT) samples, using method DESeq2, followed by gene set enrichment analysis.</p>

                <figure style={{margin: `0`}}>
                  <StaticImage
                      src="../images/fh-jax-rnaseq-analysis.png"
                      alt=""
                      loading="eager"
                      placeholder="none"
                  />
                  <figcaption style={{margin: `1em auto 1em`, textAlign: `center`}}><em>Created in BioRender. Liu, S. (2025) <a href="https://BioRender.com/x9fgd6f" target="_blank" rel="noopener noreferrer">https://BioRender.com/x9fgd6f</a></em></figcaption>
                </figure>
                <p></p>

                <p>The Jackson Laboratory produced bulk RNAseq data with gene knockout and WT involving different gene knockout strategies, different model systems, different cell lines, and different days. For certain gene, the datasets involve two oxygen conditions.</p>
                <p>Each dataset is processed separately. To assess the differential expression (DE) effects of gene knockout, the steps taken include quality control, DE analysis, and functional category enrichment analysis. For data visualization, volcano plots are provided to highlight the significantly differentially expressed genes under each gene knockout, and bar plots are provided to show significantly enriched functional categories. Detailed DE results are provided in tables, including basic information for each gene and the corresponding log2(fold change), p-value, and adjusted p-value.</p>
                <p>The gene differential expression analysis method used is DESeq2. The major type of DE testing is between knockout samples and wild type samples. The second type of DE testing is between the two oxygen conditions. Proper levels of sample groups are chosen to run DESeq2 on, balancing between borrowing information across samples and avoiding batch effect. </p>
                <p>When running DESeq2 model, there are two covariates considered: sequencing run ID and read depth (computed as the 75% quantile of gene expression in each sample). The sequencing run ID is included if the samples involve more than one sequencing run. To decide whether to include read depth, a model including read depth is fit first, and the proportion of genes for which the read depth can explain a significant amount of variation is estimated. The read depth is included in the final model if the estimated proportion is above a threshold that is adjusted according to sample size.</p>
                <p>To make the results more reliable, multiple filtering steps are carried out based on the expression level of the genes. Genes with low expression are excluded from DE testing or have adjusted p-value marked as NA.</p>

                <h2 id="scrna-seq-cell-type-composition" className={styles.titleM}>scRNA-seq Cell Type Composition</h2>


                <p>Strategy used by: Fred Hutch Cancer Center, view on <a href="https://github.com/morphic-bio/MSK_KO_village_analysis" target="_blank" >GitHub</a></p>

                <p>To quantify perturbation effects on cell type composition, pseudobulk samples were generated for each clone at each time point. A linear regression model was then used to model log-transformed cell type proportions, with cell background, data source, and genotype included as covariates.</p>

                <h2 id="scrna-seq-variance-decomposition" className={styles.titleM}>scRNA-seq Variance Decomposition</h2>


                <p>Strategy used by: Fred Hutch Cancer Center, view on <a href="https://github.com/morphic-bio/MSK_KO_village_analysis" target="_blank" >GitHub </a></p>

                <p>We quantified the proportion of variance explained by read depth, cell background (cell line), and genotype using a series of linear models fitted separately at each time point. For each time point, the models were applied to pseudobulk samples, with log-normalized expression of highly variable genes as the outcome. The genotype effect captures both its influence on cell type composition and on cell type-specific gene expression.</p>
                <StaticImage src="../images/msk-ko-village-analysis-strategy.png" alt="" loading="eager" placeholder="none"/>

                <h2 id="scrna-seq-differential-expression-analysis-pseudobulk-based" className={styles.titleM}>scRNA-seq Differential Expression Analysis - Pseudobulk-based approach</h2>


                <p>Strategy used by: Fred Hutch Cancer Center, view on <a href="https://github.com/morphic-bio/MSK_KO_village_analysis" target="_blank" >GitHub </a></p>

                <p>To identify differentially expressed genes (DEGs) between a KO genotype of interest and WT, pseudobulk samples were generated for each clone–cell type combination at each time point. Differential expression analysis was performed using the DESeq2 package in R, with read depth and cell background as covariates.</p>

                <h2 id="scrna-seq-differential-expression-analysis-cell-level" className={styles.titleM}>scRNA-seq Differential Expression Analysis - Cell-level approach</h2>


                <p>Strategy used by: Fred Hutch Cancer Center, view on <a href="https://github.com/morphic-bio/MSK_KO_village_analysis" target="_blank" >GitHub </a></p>

                <p>Alternatively, for each time point and cell type, cell-level differential expression analysis was performed using FindMarkers from the Seurat R package with default parameters.</p>

                <h2 id="gene-progam-evaluation" className={styles.titleM}>Gene program evaluation</h2>


                <p>Strategy used by: Stanford, view on <a href="https://github.com/EngreitzLab/gene_network_evaluation" target="_blank" >GitHub</a></p>

                <p>cNMF is a computational method that uncovers groups of genes called “gene programs” that work together inside cells. By repeating the analysis many times and focusing on the most consistent results, it filters out noise and highlights the most meaningful patterns. These gene programs are then tested against biological knowledge to see if they reflect known pathways, cell types, or cellular activities. This combination of discovery and evaluation helps researchers understand what makes cells unique, what activities they are carrying out, and how these processes vary across conditions, development, or disease.</p>
                <p>cNMF is a consensus-based matrix factorization approach that decomposes single-cell RNA-seq data into interpretable gene programs. It applies NMF repeatedly with different random initializations, clusters the resulting factors, and aggregates them into consensus programs. This reduces stochastic variability and increases reproducibility compared to single NMF runs. The output consists of a program usage matrix (cells × programs), which describes the activity of each program in each cell, and a gene loading matrix (programs × genes), which identifies the genes that define each program.</p>
                <p>To ensure both robustness and biological interpretability, cNMF results are systematically evaluated using multiple criteria:</p>
                <ul>
                  <li>Reconstruction error and stability, measuring how well the decomposition explains the data and how reproducible the programs are.</li>
                  <li>Co-regulation and coherence, testing whether program genes are functionally linked.</li>
                  <li>Biological enrichment, assessing whether programs correspond to known pathways, processes, or cell identities.</li>
                  <li>Cross-dataset reproducibility, ensuring that programs are consistent across experimental replicates and biological contexts.</li>
                  <li>Through this strategy, cNMF reliably identifies both identity programs (cell-type signatures) and activity programs (dynamic patterns such as cell cycle, stress responses, or signaling).</li>
                </ul>

                <h2 id="chrombpnet" className={styles.titleM}>ChromBPNet</h2>


                <p>Strategy used by: Stanford, view on <a href="https://github.com/kundajelab/chrombpnet" target="_blank" >GitHub</a></p>

                <p>ChromBPNet is a machine learning model that helps scientists read the “regulatory code” written in our DNA. It learns how DNA sequence shapes the way our genome is packaged and accessed inside cells, while carefully separating out technical artifacts from true biological signals. By doing so, ChromBPNet can pinpoint the short DNA patterns that control when and where genes turn on, and show how these patterns change across cell types and conditions. The model can also predict how small changes in DNA—such as genetic variants—might disrupt gene regulation, offering clues to the biological differences between individuals and insights into the genetic basis of health and disease.</p>
                <p>ChromBPNet is a base-resolution convolutional neural network built to decode the cis-regulatory code and predict how DNA sequence controls chromatin accessibility. Its bias-factorized architecture explicitly separates enzyme-specific cleavage bias from true regulatory signal: a “bias model” first learns the sequence preferences of DNase-I or Tn5, and a “TF model” then trains on bias-corrected profiles to capture sequence features that truly drive accessibility. This separation yields highly interpretable results, enabling recovery of transcription factor motif lexicons, cooperative motif syntax, and single-base footprints. ChromBPNet’s compact design matches or exceeds the performance of much larger models in predicting the impact of genetic variants on accessibility, pioneer factor binding, and reporter activity. By providing fine-grained, cell-type–specific insights, ChromBPNet offers a powerful framework for understanding how genomic regulation is encoded in DNA, how it varies across cell types, assays, sequencing depths, and populations, and how genetic variation may contribute to complex traits and disease.</p>


                <h1 id="dracc-uniform-and-scalable-data-processing-methods" className={styles.titleL}>Uniform and Scalable Data Processing Methods by the DRACC</h1>
                
                <h2 id="analytical-pipelines" className={styles.titleM}>Analytical pipelines</h2>


                <p>To facilitate reproducible analyses across diverse data types, graphical and interactive analytical pipelines are developed in the open-source <a href="https://github.com/BioDepot/BioDepot-workflow-builder" target="_blank" >Biodepot</a> platform with a training portal available at <a href="https://biodepot.github.io/training/" target="_blank">https://biodepot.github.io/training/</a>. These analytical pipelines are developed by the DRACC with feedback solicited from members in the MorPhiC consortium.  Pipelines currently supported include:</p>
                <ul>
                  <li>Bulk RNA-seq. GitHub <a href="https://github.com/morphic-bio/Bulk-RNA-seq" target="_blank" >https://github.com/morphic-bio/Bulk-RNA-seq</a></li>
                  <li>gRNA enrichment. GitHub <a href="https://github.com/morphic-bio/gRNA-Enrichment" target="_blank" >https://github.com/morphic-bio/gRNA-Enrichment</a>. A pre-configured instance is available at <a href="https://gitpod.io/#https://github.com/morphic-bio/gRNA-Enrichment" target="_blank" >https://gitpod.io/#https://github.com/morphic-bio/gRNA-Enrichment</a></li>
                  <li>Single cell/perturb-seq (GitHub <a href="https://github.com/morphic-bio/scRNA-seq" target="_blank" >https://github.com/morphic-bio/scRNA-seq</a>) with a novel open-source utility called <b>assignBarcodes</b>, designed for targeted sequencing analysis in single-cell experiments (GitHub <a href="https://github.com/morphic-bio/process_features" target="_blank" >https://github.com/morphic-bio/process_features</a>). <b>assignBarcodes</b> efficiently assigns feature barcodes from FASTQ files to a known set of sequence barcodes, serving as a powerful, open-source alternative to proprietary tools.</li>
                </ul>
                <p></p>

                <p>Due to consent restrictions for the KOLF2 cell line and derivatives that require data mapping to the Y chromosome to be removed, a filtering step has been added to our analytical pipelines for all data generated using these cell lines. Specifically, all reads in the BAM and FASTQ files that align to the Y-chromosome are removed, but the counts tables include the Y chromosome data.</p>

                <h2 id="scalable-data-processing" className={styles.titleM}>Scalable data processing</h2>


                <p>A scheduler based on the Temporal.io framework has been developed to enable optimizations of bioinformatics workflows. Specifically, users can transparently map workflow steps to diverse execution environments, including high-performance computing (HPC) resources managed by the SLURM resource manager through an easy-to-use graphical user interface. Asynchronous execution of workflows is supported to optimize resource utilization even when the scheduler cannot make use of a system’s full RAM and CPU resources. Pipelines are executed using a combination of UW compute resources and the NSF Bridges2 supercomputer.</p>
                <p>Pre-print: bioRxiv <a href="https://www.biorxiv.org/content/10.1101/2025.09.01.673517v1" target="_blank">2025.09.01.673517</a></p>

                <StaticImage src="../images/uw-scheduler-arch.png" alt="" loading="eager" placeholder="none"/>
            </div>
          </div>
        </div>
        <Footer />
      </section>
      
    </div>
  )
}

export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}