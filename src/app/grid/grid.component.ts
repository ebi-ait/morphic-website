import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {ColDef, GridApi, GridOptions, GridReadyEvent, IRowNode} from "ag-grid-community";
import {Facet, FacetDef, Filter} from "../types/facet";
import {GridUtilsService} from "../services/grid-utils.service";
import {GridRecord} from "../types/GridRecord";
import {AbstractColDef} from "ag-grid-community/dist/lib/entities/colDef";
import {FacetUtilsService} from "../services/facet-utils.service";


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public columnDefs: AbstractColDef[] = GridUtilsService.COLUMN_DEFINITIONS;
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

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<GridRecord[]>("assets/data.json").subscribe(
      (data) => {
        this.rowData = data;
        this.generateFacets(data);
        window.dispatchEvent(new Event('resize')); //this is a workaround for side-nav opened overlap behaviour
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
    this.facetDefs.forEach(field => {
      let facetValueMap = new Map<string, number>();
      data.forEach(node => {
        let value = node[field.field] as unknown;
        FacetUtilsService.populateFacetMap(value, field, facetValueMap);
      });
      let facetFields = FacetUtilsService.convertFacetMapToList(facetValueMap);
      this.facets.push({
        "title": field.field,
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
        let cellValue = record[filterTitle] as unknown;
        let facet = this.getFacetDefByTitle(filterTitle);
        if (facet && facet.processor) {
          if (!FacetUtilsService.doesFilterPassForProcessor(cellValue, filter, facet)) {
            filterPass = false;
          }
        } else {
          if (!filter.values.includes(cellValue as string)) {
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
