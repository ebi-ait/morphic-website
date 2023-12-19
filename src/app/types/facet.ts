export interface Facet {
  title: string;
  values: FacetField[];
}

export interface FacetField {
  value: string;
  count: number;
}

export interface Filter {
  title: string;
  values: string[];
}

export interface FacetDef {
  field: string;
  processor?: string;
}
