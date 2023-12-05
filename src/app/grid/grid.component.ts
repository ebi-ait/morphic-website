import { HttpClient } from "@angular/common/http";
import {Component, OnChanges, OnInit} from "@angular/core";
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SideBarDef,
  IRowNode
} from "ag-grid-community";

// import "ag-grid-enterprise";

import { MorphicRecord } from "../interfaces";
import { UrlCellRenderer } from "../url-cell-renderer.component";
import {FormControl} from "@angular/forms";
import {filter} from "rxjs";


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit  {
  private gridApi!: GridApi<MorphicRecord>;

  readoutAssayFilter = new FormControl('');
  readoutAssayFilterValues: Set<String> = new Set();

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
    // onRowDataUpdated: this.generateFacets
    doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
    isExternalFilterPresent: this.isExternalFilterPresent.bind(this)
  };
  public rowData!: MorphicRecord[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<MorphicRecord[]>("assets/test-data.json").subscribe(
      (data) => {
        this.rowData = data;
        this.generateFacets(data);
      },
      (error) => {
        console.error("Error fetching data:", error);
      },
    );
  }

  onGridReady(params: GridReadyEvent<MorphicRecord>) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }

  generateFacets(data: any[]) {
    data.forEach(node => {
      this.readoutAssayFilterValues.add(node.readout_assay);
    })
  }

  isExternalFilterPresent(): boolean {
    return true;
  }

  doesExternalFilterPass(node: IRowNode<MorphicRecord>): boolean {
    if (node.data) {
      let filterValues = this.readoutAssayFilter.value;
      if (filterValues) {
        return filterValues.length == 0 || filterValues.includes(node.data.readout_assay);
      }
      return true;
    }
    return true;
  }

  externalFilterChanged(value: any) {
    console.log("Filter changes: " + value);
    let filterValues = this.readoutAssayFilter.value;
    console.log(filterValues);
    this.gridApi.onFilterChanged();
  }

}
