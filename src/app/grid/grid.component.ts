import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SideBarDef,
} from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import "ag-grid-enterprise";

import { MorphicRecord } from "../interfaces";
import { UrlCellRenderer } from "../url-cell-renderer.component";
import {AgGridModule} from "ag-grid-angular";


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  // standalone: true,
  // imports: [AgGridModule],
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {private gridApi!: GridApi<MorphicRecord>;

  rowData1 = [
    { mission: "Voyager", company: "NASA", location: "Cape Canaveral", date: "1977-09-05", rocket: "Titan-Centaur ", price: 86580000, successful: true },
    { mission: "Apollo 13", company: "NASA", location: "Kennedy Space Center", date: "1970-04-11", rocket: "Saturn V", price: 3750000, successful: false },
    { mission: "Falcon 9", company: "SpaceX", location: "Cape Canaveral", date: "2015-12-22", rocket: "Falcon 9", price: 9750000, successful: true }
  ];

  // Column Definitions: Defines & controls grid columns.
  colDefs1: ColDef[] = [
    { field: "mission" },
    { field: "company" },
    { field: "location" },
    { field: "date" },
    { field: "price" },
    { field: "successful" },
    { field: "rocket" }
  ];

  public columnDefs: ColDef[] = [
    { field: "id" },
    { field: "dpc", hide: false },
    { field: "short_study_label" },
    { field: "upload_status" },
    { field: "study_title", hide: false },
    { field: "cell_line", hide: false },
    { field: "readout_assay", hide: false },
    { field: "perturbation_type", hide: false },
    { field: "target_genes", hide: false },
    { field: "model_system" },
    { field: "pooled_perturbation" },
    { field: "longitudinal_study" },
    { field: "duo_code_for_data_sharing_restriction" },
    { field: "number_of_datasets" },
    { field: "expected_release", cellDataType: "dateString", hide: false },
    {
      field: "available_datasets",
      hide: false,
      cellRenderer: UrlCellRenderer,
    },
    { field: "publication" },
    { field: "data_upload_contact_name" },
    { field: "data_upload_contact_email_address" },
    { field: "contact" },
    { field: "donor_ancestry" },
    { field: "gender" },
    { field: "protocols_io_link_cell_culture" },
    { field: "protocols_io_link_for_differentiation_and_maintenance" },
    { field: "general_comments" },
    { field: "sharing_mechanism_with_DRACC" },
    { field: "comments" },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    floatingFilter: false,
    resizable: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
    initialHide: true,
  };
  public autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  public groupDefaultExpanded = 0;
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ["filters", "columns"],
  };

  public gridOptions: GridOptions<any> = {
    // Define your grid options here
    // enableColResize: true, //isuru commented
    // enableColumnsToolPanel: true, //isuru commented
  };

  onGridReady(params: GridReadyEvent<MorphicRecord>) {
    this.gridApi = params.api;
    this.http.get<MorphicRecord[]>("assets/test-data.json").subscribe(
      (data) => {
        this.rowData = data;
      },
      (error) => {
        console.error("Error fetching data:", error);
      },
    );
  }
  public rowData!: MorphicRecord[];

  constructor(private http: HttpClient) {}

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }
}
