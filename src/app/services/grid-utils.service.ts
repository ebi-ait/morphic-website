import {Injectable} from '@angular/core';
import {ColDef} from "ag-grid-community";
import {UrlCellRenderer} from "../url-cell-renderer.component";
import {FacetDef} from "../types/facet";
import {ColGroupDef} from "ag-grid-community/dist/lib/entities/colDef";

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

  // mix of colDef and groupColDef
  public static readonly COLUMN_DEFINITIONS1 = [
    {field: "cohort_name", hide: false, headerName: "Cohort Name", flex: 2},
    {field: "countries", hide: false, headerName: "Countries", tooltipField: "countries"},
    {
      headerName: 'Available Data Types',
      children: [
        {
          field: "available_data_types.surveillance",
          hide: false,
          headerComponentParams: {
            template: '' +
              '<div class="grid-col-header-icon" >' +
              '  <mat-icon aria-hidden="false" aria-label="Example home icon" fontIcon="home" style="font-family: \'Material Icons\' !important;"></mat-icon>' +
              '♛' +
              '</div>'
          },
          headerTooltip: "Surveillance"
        },
        {
          field: "available_data_types.clinical",
          hide: false,
          headerComponentParams: {
            template: '<div>♛</div>'
          },
          headerTooltip: "Clinical"},
        {
          field: "available_data_types.environmental",
          hide: false,
          headerComponentParams: {
            template: '<div>♛</div>'
          },
          headerTooltip: "Environmental"
        },
        {
          field: "available_data_types.climate_data",
          hide: false,
          headerComponentParams: {
            template: '<div>♛</div>'
          },
          headerTooltip: "Climate Data"
        },
        {
          field: "available_data_types.genomic_human",
          hide: false,
          headerComponentParams: {
            template: '<div>♛</div>'
          },
          headerTooltip: "Genomic Human"
        },
        {
          field: "available_data_types.genomic_pathogen",
          hide: false,
          headerComponentParams: {
            template: '<div>♛</div>'
          },
          headerTooltip: "Genomic Pathogen"
        },
        {
          field: "available_data_types.image_data",
          hide: false,
          headerComponentParams: {
            template: '<div>♛</div>'
          },
          headerTooltip: "Image Data"},
        {
          field: "available_data_types.other",
          hide: false,
          headerComponentParams: {
            template: '<div>♛</div>'
          },
          headerTooltip: "Other"}
      ]
    },
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
