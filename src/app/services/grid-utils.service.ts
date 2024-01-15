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
    minWidth: 20,
    sortable: true,
    filter: true,
    floatingFilter: false,
    resizable: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
    initialHide: true,
  };

  // mix of colDef and groupColDef
  public static readonly COLUMN_DEFINITIONS1 = [
    {field: "cohort_name", hide: false, headerName: "Cohort Name"},
    {field: "countries", hide: false, headerName: "Countries", tooltipField: "countries", flex: 2},
    {
      headerName: 'Available Data Types',
      children: [
        {
          field: "available_data_types.surveillance",
          hide: false,
          headerComponentParams: {
            template:
              '<div>' +
              '  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">' +
              '<!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->' +
              '    <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/>' +
              '  </svg>' +
              '</div>'
          },
          headerTooltip: "Surveillance",
          flex: 0,
          width: 50
        },
        {
          field: "available_data_types.clinical",
          hide: false,
          headerComponentParams: {
            template:
              '<div>' +
              '  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">' +
              '    <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96v32V480H384V128 96 56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM96 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H96V96zM416 480h32c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H416V480zM224 208c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v48h48c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H288v48c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V320H176c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h48V208z"/>' +
              '  </svg>' +
              '</div>'
          },
          headerTooltip: "Clinical",
          flex: 0,
          width: 50
        },
        {
          field: "available_data_types.environmental",
          hide: false,
          headerComponentParams: {
            template:
              '<div>' +
              '  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">' +
              '    <path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z"/>' +
              '  </svg>' +
              '</div>'
          },
          headerTooltip: "Environmental",
          flex: 0,
          width: 50
        },
        {
          field: "available_data_types.climate_data",
          hide: false,
          headerComponentParams: {
            template:
              '<div>' +
              '  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">' +
              '    <path d="M177.8 63.2l10 17.4c2.8 4.8 4.2 10.3 4.2 15.9v41.4c0 3.9 1.6 7.7 4.3 10.4c6.2 6.2 16.5 5.7 22-1.2l13.6-17c4.7-5.9 12.9-7.7 19.6-4.3l15.2 7.6c3.4 1.7 7.2 2.6 11 2.6c6.5 0 12.8-2.6 17.4-7.2l3.9-3.9c2.9-2.9 7.3-3.6 11-1.8l29.2 14.6c7.8 3.9 12.6 11.8 12.6 20.5c0 10.5-7.1 19.6-17.3 22.2l-35.4 8.8c-7.4 1.8-15.1 1.5-22.4-.9l-32-10.7c-3.3-1.1-6.7-1.7-10.2-1.7c-7 0-13.8 2.3-19.4 6.5L176 212c-10.1 7.6-16 19.4-16 32v28c0 26.5 21.5 48 48 48h32c8.8 0 16 7.2 16 16v48c0 17.7 14.3 32 32 32c10.1 0 19.6-4.7 25.6-12.8l25.6-34.1c8.3-11.1 12.8-24.6 12.8-38.4V318.6c0-3.9 2.6-7.3 6.4-8.2l5.3-1.3c11.9-3 20.3-13.7 20.3-26c0-7.1-2.8-13.9-7.8-18.9l-33.5-33.5c-3.7-3.7-3.7-9.7 0-13.4c5.7-5.7 14.1-7.7 21.8-5.1l14.1 4.7c12.3 4.1 25.7-1.5 31.5-13c3.5-7 11.2-10.8 18.9-9.2l27.4 5.5C432 112.4 351.5 48 256 48c-27.7 0-54 5.4-78.2 15.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>' +
              '  </svg>' +
              '</div>'
          },
          headerTooltip: "Climate Data",
          flex: 0,
          width: 50
        },
        {
          field: "available_data_types.genomic_human",
          hide: false,
          headerComponentParams: {
            template:
              '<div>' +
              '  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">' +
              '    <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z"/>' +
              '  </svg>' +
              '</div>'
          },
          headerTooltip: "Genomic Human",
          flex: 0,
          width: 50
        },
        {
          field: "available_data_types.genomic_pathogen",
          hide: false,
          headerComponentParams: {
            template:
              '<div>' +
              '  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">' +
              '    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V43.5c0 49.9-60.3 74.9-95.6 39.6L120.2 75C107.7 62.5 87.5 62.5 75 75s-12.5 32.8 0 45.3l8.2 8.2C118.4 163.7 93.4 224 43.5 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H43.5c49.9 0 74.9 60.3 39.6 95.6L75 391.8c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l8.2-8.2c35.3-35.3 95.6-10.3 95.6 39.6V480c0 17.7 14.3 32 32 32s32-14.3 32-32V468.5c0-49.9 60.3-74.9 95.6-39.6l8.2 8.2c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-8.2-8.2c-35.3-35.3-10.3-95.6 39.6-95.6H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H468.5c-49.9 0-74.9-60.3-39.6-95.6l8.2-8.2c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-8.2 8.2C348.3 118.4 288 93.4 288 43.5V32zM176 224a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm128 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>' +
              '  </svg>' +
              '</div>'
          },
          headerTooltip: "Genomic Pathogen",
          flex: 0,
          width: 50
        },
        {
          field: "available_data_types.image_data",
          hide: false,
          headerComponentParams: {
            template:
              '<div>' +
              '  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512">' +
              '    <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>' +
              '  </svg>' +
              '</div>'
          },
          headerTooltip: "Image Data",
          flex: 0,
          width: 50
        },
        {
          field: "available_data_types.other",
          hide: false,
          headerName: "Other",
          headerTooltip: "Other"
        }
      ]
    },
    {field: "license", hide: true, headerName: "License"},
    {field: "website", hide: false, headerName: "Website"}

  ];

  public static readonly FACET_DEFINITIONS: FacetDef[] = [
    {field: "cohort_name"},
    {field: "countries", processor: "array"},
    {field: "available_data_types", processor: "map"}
  ]

  constructor() {
  }

}
