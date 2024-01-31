import { Component } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'cdk-accordion-overview-example',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  standalone: true,
  imports: [CdkAccordionModule],
})
export class CdkAccordionOverviewExample {
  faqs: { question: string, answer: SafeHtml }[];
  expandedIndex = 0;
  constructor(private sanitizer: DomSanitizer) {
    this.faqs = [
      {
        question: 'What is the goal of the MorPhiC project?',
        answer: this.sanitizer.bypassSecurityTrustHtml('MorPhiC stands for Molecular Phenotypes of Null Alleles in Cells. MorPhiC is a collaborative research project that aims to functionally characterize all protein-coding human genes. The project focuses on developing a catalog of molecular and cellular phenotypes for null alleles for every protein-coding human gene. The ultimate goal is to provide a comprehensive understanding of the biological function of each human gene, filling the knowledge gap for the majority of genes that are currently underrepresented in scientific literature.')
      },
      {
        question: 'How was the gene list for the MorPhic project chosen?',
        answer: this.sanitizer.bypassSecurityTrustHtml('To prioritize gene targets, the MorPhiC consortium considers a set of genes involved in critical cellular and organismal functions, including essential genes, transcription factors, developmental regulators, and disease-associated genes. <a href="https://morphic-genelist-app.shinyapps.io/shiny_genesetexplore/" target="_blank">Full list of genes to be studied under MorPhic.</a>')
      },
      {
        question: 'What is a null allele?',
        answer: this.sanitizer.bypassSecurityTrustHtml('Within the MorPhiC project, null alleles are defined as genes with less than 10% of the normal level of functional protein.')
      },
      {
        question: 'Who are the participants in the MorPhiC project?',
        answer: this.sanitizer.bypassSecurityTrustHtml('The MorPhiC consortium consists of four Data Production Centers (DPCs), one Data Resource and Administrative Coordinating Center (DRACC), and three Data Analysis and Validation Centers (DAVs). The four DPCs are: The Jackson Laboratory (JAX), Memorial Sloan Kettering Cancer Center (MSK), Northwestern University (NWU), and University of California San Francisco (UCSF). The DRACC is composed of members from University of Miami (UM), European Bioinformatic Institute (EBI), University of Washington (UW), and Queen Mary University of London (QMUL). The three DAVs are: Fred Hutchinson Cancer Center (Fred-Hutch), The Jackson Laboratory (JAX), and Stanford University.')
      }
    ];
  }
}
