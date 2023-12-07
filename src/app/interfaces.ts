export interface MorphicRecord {
      "id": number;
      "dpc": string;
      "short_study_label": string;
      "upload_status": string;
      "study_title": string;
      "cell_line": string;
      "readout_assay": string;
      "perturbation_type": string;
      "target_genes": string;
      "model_system": string;
      "pooled_perturbation": string;
      "longitudinal_study": string;
      "duo_code_for_data_sharing_restriction": string;
      "number_of_datasets": number | null;
      "expected_release": string;
      "available_datasets": string;
      "publication": string;
      "data_upload_contact_name": string;
      "data_upload_contact_email_address": string;
      "contact": string;
      "donor_ancestry": string;
      "gender": string;
      "protocols_io_link_cell_culture": string;
      "protocols_io_link_for_differentiation_and_maintenance": string;
      "general_comments": string;
      "sharing_mechanism_with_DRACC": string;
      "comments": string;
}
export interface SolrDocument {
  title: string;
  studyCount: number;
  id: string;
  reportedTrait: string[];
  resourcename: string;
  associationCount:number;
  description: string;
}

export interface SolrDocumentDetail {
  reportedTrait: string;
}
export interface SolrResponse {
  responseHeader: SolrResponseHeader;
  response: {
    numFound: number;
    start: number;
    docs: SolrDocument[];
  };
}

export interface SolrResponseHeader {
  status: number;
  QTime: number;
  params: {
    q: string;
    rows: number;
    start: number;
    // ... other parameters if needed
  };
}
