import {Injectable} from '@angular/core';
import {ColDef} from "ag-grid-community";
import {UrlCellRenderer} from "../url-cell-renderer.component";

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

  public static readonly COLUMN_DEFINITIONS: ColDef[] = [
    {field: "id"},
    {field: "study_title", hide: false, headerName: "Study Title"},
    {field: "target_genes", hide: false, headerName: "Target Genes"},
    {field: "cell_line", hide: false, headerName: "Cell Line"},
    {field: "readout_assay", hide: false, headerName: "Assay"},
    {field: "perturbation_type", hide: false, headerName: "Perturbation Type"},
    {field: "upload_status", hide: false, headerName: "Status"},
    {field: "dpc", hide: false, headerName: "Centre"},
    {field: "expected_release", hide: false, headerName: "Expected Release", cellDataType: "dateString"},
    {field: "available_datasets", hide: false, headerName: "Available Datasets", cellRenderer: UrlCellRenderer},
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
  ];

  public static readonly FACET_FIELDS: string[] = ["cell_line", "readout_assay", "perturbation_type"];

  constructor() {
  }

}
