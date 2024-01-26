import {Component} from '@angular/core';
import {CdkAccordionModule} from '@angular/cdk/accordion';

@Component({
  selector: 'cdk-accordion-overview-example',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  standalone: true,
  imports: [CdkAccordionModule],
})
export class CdkAccordionOverviewExample {
  items = ['Why was this gene list chosen?',
    'Which cell lines have been chosen for studies?',
    'Do you accept data on these genes from external contributors?',
    'What is a null allele?'
  ];
  content = ["The MorPhiC programme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community.", 
    "The MorPhiC programme aims to develop a consistent catalog of molecular and cellular phenotypes for null alleles for every human gene by using in-vitro multicellular systems. The catalog will be made available for broad use by the biomedical community.", 
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit.", 
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
  ];
  expandedIndex = 0;
}
