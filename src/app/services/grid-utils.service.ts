import {Injectable} from '@angular/core';
import {ColDef} from "ag-grid-community";
import {UrlCellRenderer} from "../url-cell-renderer.component";

@Injectable({
  providedIn: 'root'
})
export class GridUtilsService {
  public static readonly COLUMN_DEFINITIONS: ColDef[] = [
    {field: "id"},
    {field: "dpc", hide: false},
    {field: "short_study_label"},
    {field: "upload_status"},
    {field: "study_title", hide: false},
    {field: "cell_line", hide: false},
    {field: "readout_assay", hide: false},
    {field: "perturbation_type", hide: false},
    {field: "target_genes", hide: false},
    {field: "model_system"},
    {field: "pooled_perturbation"},
    {field: "longitudinal_study"},
    {field: "duo_code_for_data_sharing_restriction"},
    {field: "number_of_datasets"},
    {field: "expected_release", cellDataType: "dateString", hide: false},
    {
      field: "available_datasets",
      hide: false,
      cellRenderer: UrlCellRenderer,
    },
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
  public static readonly FACET_FIELDS: string[] = ["readout_assay", "perturbation_type"];

  constructor() {
  }

}
