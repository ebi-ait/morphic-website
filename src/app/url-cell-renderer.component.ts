import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: "url-renderer-component",
  template: `
    <a href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc={{ cellValue }}" target="_blank">{{cellValue}}</a>
  `,
})
export class UrlCellRenderer implements ICellRendererAngularComp {
  public cellValue!: string;

  agInit(params: ICellRendererParams) {
    this.cellValue = this.renderValue(params);
  }

  refresh(params: ICellRendererParams) {
    this.cellValue = this.renderValue(params);
    return true;
  }

  renderValue(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
