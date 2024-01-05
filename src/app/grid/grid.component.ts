import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode} from "ag-grid-community";
import {Facet, FacetDef, FacetField, Filter} from "../types/facet";
import {GridUtilsService} from "../services/grid-utils.service";
import {GridRecord} from "../types/GridRecord";
import {DataService} from "../services/data.service";
import {Router} from "@angular/router";
import {  CellClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public columnDefs: ColDef[] = this.gridUtilService.COLUMN_DEFINITIONS;
  public defaultColDef: ColDef = GridUtilsService.DEFAULT_COLUMN_DEFINITIONS;
  private facetDefs: FacetDef[] = GridUtilsService.FACET_DEFINITIONS;

  private gridApi!: GridApi<GridRecord>;
  public rowData!: GridRecord[];
  private filters: Map<string, Filter> = new Map<string, Filter>();
  facets: Facet[] = [];

  public gridOptions: GridOptions = {
    doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
    isExternalFilterPresent: this.isExternalFilterPresent.bind(this)
  };

  constructor(private http: HttpClient, private dataService: DataService, private gridUtilService :GridUtilsService) {
  }

  ngOnInit(): void {
     this.dataService.loadJsonData().subscribe( jsonData => {
       this.rowData = jsonData;
       this.generateFacets(this.rowData);
     }
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
    this.facetDefs.forEach(field => {
      let facetValueMap = new Map<string, number>();
      data.forEach(node => {
        let value = node[field.field] as string;
        if (field.processor && field.processor === 'csv') {
          let values = value.split(",");
          this.addValuesToMap(facetValueMap, values);
        } else {
          this.addValueToMap(facetValueMap, value);
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
        "title": field.field,
        "values": facetFields
      })
    });
  }

  addValueToMap(facetValueMap: Map<string, number>, value: string) {
    if (facetValueMap.has(value)) {
      facetValueMap.set(value, facetValueMap.get(value)! + 1);
    } else {
      facetValueMap.set(value, 1);
    }
  }

  addValuesToMap(facetValueMap: Map<string, number>, values: string[]) {
    for (let value of values) {
      this.addValueToMap(facetValueMap, value.trim());
    }
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
        let facet = this.getFacetDefByTitle(filterTitle);
        if (facet && facet.processor && facet.processor === 'csv') {
          if (!rowValue.split(',').some(r => filter.values.includes(r.trim()))) {
            filterPass = false;
          }
        } else {
          if (!filter.values.includes(rowValue)) {
            filterPass = false;
          }
        }
      });
    }
    return filterPass;
  }

  getFacetDefByTitle(filterTitle: string): FacetDef | null {
    for (let facet of this.facetDefs) {
      if (facet.field === filterTitle) {
        return facet
      }
    }
    return null
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
