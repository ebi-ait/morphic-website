import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode} from "ag-grid-community";
import {Facet, FacetField, Filter} from "../types/facet";
import {GridUtilsService} from "../services/grid-utils.service";
import {GridRecord} from "../types/GridRecord";


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public columnDefs: ColDef[] = GridUtilsService.COLUMN_DEFINITIONS;
  public defaultColDef: ColDef = GridUtilsService.DEFAULT_COLUMN_DEFINITIONS;
  private facetsFields: string[] = GridUtilsService.FACET_FIELDS;

  private gridApi!: GridApi<GridRecord>;
  public rowData!: GridRecord[];
  private filters: Map<string, Filter> = new Map<string, Filter>();
  facets: Facet[] = [];

  public gridOptions: GridOptions = {
    doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
    isExternalFilterPresent: this.isExternalFilterPresent.bind(this)
  };

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<GridRecord[]>("assets/data.json").subscribe(
      (data) => {
        this.rowData = data;
        this.generateFacets(data);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      },
    );
  }

  onGridReady(params: GridReadyEvent<GridRecord>) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }

  generateFacets(data: any[]) {
    this.facetsFields.forEach(field => {
      let facetValueMap = new Map<string, number>();
      data.forEach(node => {
        let value = node[field] as string;
        if (facetValueMap.has(value)) {
          facetValueMap.set(value, facetValueMap.get(value)! + 1);
        } else {
          facetValueMap.set(value, 1);
        }
      });
      let facetFields: FacetField[] = [];
      facetValueMap.forEach((value: number, key: string) => {
        facetFields.push({
          "value": key,
          "count": value
        })
      });
      this.facets.push({
        "title": field,
        "values": facetFields
      })
    });
  }

  isExternalFilterPresent(): boolean {
    return true;
  }

  doesExternalFilterPass(node: IRowNode<GridRecord>): boolean {
    let filterPass = true;
    if (node.data) {
      this.filters.forEach((filter, filterTitle) => {
        let record = node.data! as any;
        let rowValue = record[filterTitle] as string;
        if (!filter.values.includes(rowValue)) {
          filterPass = false;
        }
      });
    }
    return filterPass;
  }

  applyFilters(filter: Filter) {
    if (filter.values.length == 0) {
      this.filters.delete(filter.title);
    } else {
      this.filters.set(filter.title, filter);
    }
    this.gridApi.onFilterChanged();
  }

}
