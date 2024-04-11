import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode} from "ag-grid-community";
import {Facet, FacetDef, FacetField, Filter} from "../types/facet";
import {GridUtilsService} from "../services/grid-utils.service";
import {GridRecord} from "../types/GridRecord";
import {DataService} from "../services/data.service";
import {FormControl} from "@angular/forms";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss', '../header/header.component.scss'],
  animations: [
    trigger('smoothClose', [
      state('open', style({
        width: '*' // or you can use a specific width like '200px'
      })),
      state('closed', style({
        width: '0px', // or '0%' for full disappearance
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.3s ease-out')
      ]),
      transition('closed => open', [
        animate('0.3s ease-in')
      ])
    ])
  ]
})
export class GridComponent implements OnInit {
  public columnDefs: ColDef[] = this.gridUtilService.COLUMN_DEFINITIONS;
  public defaultColDef: ColDef = GridUtilsService.DEFAULT_COLUMN_DEFINITIONS;
  private facetDefs: FacetDef[] = GridUtilsService.FACET_DEFINITIONS;

  private gridApi!: GridApi<GridRecord>;
  public rowData!: GridRecord[];
  private filters: Map<string, Filter> = new Map<string, Filter>();
  facets: Facet[] = [];
  searchField: FormControl;
  showDemoData = true;
  isMainFilterVisible: boolean = true;

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
       window.dispatchEvent(new Event('resize'));
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
      facetFields.sort((a, b) => a.value.localeCompare(b.value, undefined, {sensitivity: 'base'}))
      this.facets.push({
        "title": field.field,
        "values": facetFields
      })
    });
  }

  addValueToMap(facetValueMap: Map<string, number>, value: string) {
    value = value.trim();
    if (value) {
      if (facetValueMap.has(value)) {
        facetValueMap.set(value, facetValueMap.get(value)! + 1);
      } else {
        facetValueMap.set(value, 1);
      }
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

    if (!this.showDemoData) {
      let record = node.data! as any;
      let rowValue = record['production'] as boolean;
      if (!rowValue) {
        filterPass = false;
      }
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

  toggleSideNavs() {
    this.isMainFilterVisible = !this.isMainFilterVisible;
  }

}
