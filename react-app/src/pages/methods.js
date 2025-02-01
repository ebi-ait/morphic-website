import React from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { StaticImage } from "gatsby-plugin-image"

import * as styles from "../styles/policies.module.css";

export default function Methods() {
  return (
    <div className={styles.policies}>
      <Navbar />
      <div className={styles.policiesTriangle}></div>

      <section className={styles.policiesContainer}>
        <div className={styles.policiesContentContainer}>
          <div className={styles.policiesContent}>
            <div className={styles.policiesInfo}>
                <h1 className={styles.titleL}>Experimental strategies for null allele generation</h1>
                <p>A proven strategy for understanding gene functions is to remove the gene or its protein product and perform a set of assays to study how its loss affects molecular and cellular phenotypes. The Data Production Centers have employed the following strategies for null allele generation:</p>


                <h2 className={styles.titleM}>1. Gene knock-out (KO)</h2>


                <h3 className={styles.titleS}>KO - Premature termination codon (PTC)</h3>

                <p>The PTC+1 strategy involves precise CRISPR-Cas9 engineering of a premature stop codon and the insertion of a degenerate base in an early common exon, thereby truncating all isoforms of the protein and introducing a frame-shift mutation to ensure the production of a non-functional protein, essentially "knocking out" the normal function of the gene. Depending on the position of the PTC+1 mutation with respect to the genomic structure of the gene, the mutant mRNA may or may not be subject to nonsense mediated decay (NMD). </p>
                <blockquote className={styles.textBody}>Strategy used by: The Jackson Laboratory</blockquote>

                <p>Frameshift indel mutations introduced by CRISPR-Cas9 typically result in the creation of a premature stop codon within the coding region, producing a truncated, nonfunctional protein and effectively "knocking out" the gene’s normal function. At MSK, they have generated knockout hPSC lines, and a small number of enhancer deletion lines. Then they individually barcoded these lines, and pooled them for differentiation experiments. Cells were collected at consecutive differentiation stages for scRNA-seq, followed by computational demultiplexing to analyze the transcriptomic phenotypes associated with each individual knockout condition. </p>
                <StaticImage
                    src="../images/msk-morphic-ko-strategy-ptc.png"
                    alt=""
                    loading="eager"
                    placeholder="none"
                />
                <blockquote className={styles.textBody}>Strategy used by: Memorial Sloan Kettering Cancer Center</blockquote>


                <h3 className={styles.titleS}>KO - Critical exon deletion</h3>
                
                <p>A critical exon deletion refers to a genetic knockout (KO) where an early common, frame-shifting exon within a gene has been deleted, leading to a truncated, nonfunctional protein being produced; essentially "knocking out" the normal function of the gene. Depending on the position of the premature termination codon with respect to the genomic structure of the gene, the mutant mRNA may or may not be subject to nonsense mediated decay (NMD).</p>
                <blockquote className={styles.textBody}>Strategy used by: The Jackson Laboratory</blockquote>


                <h3 className={styles.titleS}>KO - Gene deletion</h3>
                <p>Gene deletion means the complete removal of most or all protein coding exons of the gene, eliminating the possibility of the protein production entirely. The non-coding RNA transcript that remains is not subject to nonsense mediated decay and can potentially be identified by RNA-seq.</p>
                <blockquote className={styles.textBody}>Strategy used by: The Jackson Laboratory</blockquote>


                <h3 className={styles.titleS}>KO - Insertion of a cassette (a KI-KO approach)</h3>

                <p>A cassette is knocked into the target gene coding region. This insertion is expected to disrupt transcription due to the large insertion size, introduce frameshift mutations, and create a premature termination codon, thus effectively  "knocking out" the normal function of the gene.</p>
                <StaticImage
                    src="../images/msk-morphic-ko-strategy-ki-ko.png"
                    alt=""
                    loading="eager"
                    placeholder="none"
                />
                <blockquote className={styles.textBody}>Strategy used by: Memorial Sloan Kettering Cancer Center</blockquote>


                <h2 className={styles.titleM}>2. Protein degradation</h2>


                <h3 className={styles.titleS}>Auxin-inducible degron</h3>

                <p>Auxin-inducible degron (AID) is a chemical genetic tool that uses the plant hormone auxin to degrade specific proteins in mammalian cells, which allows researchers to study protein function in living tissues.</p>
                <p>At NWU, cells are engineered to express the TIR1 auxin receptor and Crispr-Cas9 technology is used to add the AID protein degron tag to specific endogenous gene loci. Cells express the tagged protein normally until treated with Auxin, which induces rapid, reversible protein degradation.</p>
                <blockquote className={styles.textBody}>Strategy used by: Northwestern University</blockquote>


                <h2 className={styles.titleM}>3. Gene knockdown</h2>


                <h3 className={styles.titleS}>CRISPR interference (CRISPRi)</h3>
                
                <p>CRISPRi (CRISPR interference) utilizes a catalytically dead Cas9 (dCas9) protein fused to a KRAB (Krüppel-associated box) domain, a transcriptional repressor. A guide RNA (gRNA) directs dCas9-KRAB to a specific DNA sequence, where it binds and blocks transcription by recruiting endogenous chromatin-modifying repressive complexes via the KRAB domain. This approach enables reversible, precise, and non-destructive repression of gene expression at the transcriptional level, making it ideal for functional genomics and studying essential genes.</p>
                <blockquote className={styles.textBody}>Strategy used by: University of California San Francisco</blockquote>

            </div>
          </div>
        </div>
        <Footer />
      </section>
      
    </div>
  )
}

export function Head() {
    return (
      <>
        <title>MorPhiC program: Molecular Phenotypes of Null Alleles in Cells</title>
        <link id="icon" rel="icon" href="favicon.svg" />
      </>
    )
  }