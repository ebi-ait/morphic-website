import {Injectable} from '@angular/core';
import {ColDef} from "ag-grid-community";
import {UrlCellRenderer} from "../url-cell-renderer.component";
import {FacetDef} from "../types/facet";
import {StatusCellRendererComponent} from "../extensions/status-cell-renderer/status-cell-renderer.component";

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

  // https://www.ag-grid.com/javascript-data-grid/value-getters/#example-getters-and-formatters
  // valueGetter for aggregating columns
  public static readonly COLUMN_DEFINITIONS: ColDef[] = [
    {field: "id"},
    {field: "study_title", hide: false, headerName: "Study Title", flex: 2},
    {field: "target_genes", hide: false, headerName: "Target Genes"},
    {field: "cell_line", hide: false, headerName: "Cell Line"},
    {field: "readout_assay", hide: false, headerName: "Assay"},
    {field: "perturbation_type", hide: false, headerName: "Perturbation Type"},
    {field: "upload_status", hide: true, headerName: "Status"},
    {field: "dpc", hide: false, headerName: "Centre"},
    {field: "expected_release", hide: true, headerName: "Expected Release", cellDataType: "dateString"},
    {field: "available_datasets", headerName: "Available Datasets", cellRenderer: UrlCellRenderer},
    {field: "short_study_label"},
    {field: "model_system"},
    {field: "pooled_perturbation"},
    {field: "longitudinal_study"},
    {field: "duo_code_for_data_sharing_restriction"},
    {field: "number_of_datasets"},
    {field: "publication"},
    {field: "data_upload_contact_name"},
    {field: "data_upload_contact_email_address"},
    {field: "contact"},
    {field: "donor_ancestry"},
    {field: "gender"},
    {field: "protocols_io_link_cell_culture"},
    {field: "protocols_io_link_for_differentiation_and_maintenance"},
    {field: "general_comments"},
    {field: "sharing_mechanism_with_DRACC"},
    {field: "comments"},
    {field: "status", hide: false, cellRenderer: StatusCellRendererComponent},
  ];

  public static readonly FACET_DEFINITIONS: FacetDef[] = [
    {field: "target_genes", processor: "csv"},
    {field: "cell_line", processor: "csv"},
    {field: "readout_assay"},
    {field: "perturbation_type"}
  ]

  constructor() {
  }

}
