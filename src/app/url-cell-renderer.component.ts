import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "url-renderer-component",
  template: ` <a
    href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc={{ params.value }}"
    target="_blank"
  >

  </a>`,
})
export class UrlCellRenderer implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }
}
