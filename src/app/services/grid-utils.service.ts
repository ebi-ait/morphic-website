import {Injectable} from '@angular/core';
import {ColDef} from "ag-grid-community";
import {UrlCellRenderer} from "../url-cell-renderer.component";
import {FacetDef} from "../types/facet";

@Injectable({
  providedIn: 'root'
})
export class GridUtilsService {

  public static readonly DEFAULT_COLUMN_DEFINITIONS: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    floatingFilter: false,
    resizable: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
    initialHide: true,
  };

  // todo can use colGroupDef to group headers ex. available data types.
  //  https://www.ag-grid.com/javascript-data-grid/column-groups/
  public static readonly COLUMN_DEFINITIONS: ColDef[] = [
    {field: "cohort_name", hide: false, headerName: "Cohort Name", flex: 2},
    {field: "countries", hide: false, headerName: "Countries"},
    {field: "available_data_types.demographic", hide: false, headerName: "Demographic"},
    {field: "available_data_types.surveillance", hide: false, headerName: "Surveillance"},
    {field: "available_data_types.clinical", hide: false, headerName: "Clinical"},
    {field: "available_data_types.environmental", hide: false, headerName: "Environmental"},
    {field: "available_data_types.climate_data", hide: false, headerName: "Climate Data"},
    {field: "available_data_types.genomic_human", hide: false, headerName: "Genomic Human"},
    {field: "available_data_types.genomic_pathogen", hide: false, headerName: "Genomic Pathogen"},
    {field: "available_data_types.image_data", hide: false, headerName: "Image Data"},
    {field: "available_data_types.other", hide: false, headerName: "Other"},
    {field: "license", hide: true, headerName: "License"},
    {field: "website", hide: false, headerName: "Website", flex: 2}
  ];

  public static readonly FACET_DEFINITIONS: FacetDef[] = [
    {field: "cohort_name"},
    {field: "countries", processor: "array"},
    {field: "available_data_types", processor: "map"}
  ]

  constructor() {
  }

}
