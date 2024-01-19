import {Injectable} from '@angular/core';
import {FacetDef, FacetField, Filter} from "../types/facet";

@Injectable({
  providedIn: 'root'
})
export class FacetUtilsService {

  constructor() {
  }

  public static populateFacetMap(value: unknown, field: FacetDef, facetValueMap: Map<string, number>) {
    if (field.processor && field.processor === 'csv') {
      let values = (value as string).split(",");
      FacetUtilsService.addFieldsToFacet(facetValueMap, values);
    } else if (field.processor && field.processor === 'array') {
      let values = value as string[];
      FacetUtilsService.addFieldsToFacet(facetValueMap, values);
    } else if (field.processor && field.processor === 'map') {
      let values = value as object;
      FacetUtilsService.addFieldsToFacet(facetValueMap, Object.keys(values));
    } else {
      FacetUtilsService.addFieldToFacet(facetValueMap, value as string);
    }
  }

  public static doesFilterPassForProcessor(cellValue: unknown, filter: Filter, facet: FacetDef) {
    let filterPass = true;
    if (!FacetUtilsService.doesFilterPassForCsvProcessor(cellValue, filter, facet)) {
      filterPass = false;
    } else if (!FacetUtilsService.doesFilterPassForArrayProcessor(cellValue, filter, facet)) {
      filterPass = false;
    } else if (!FacetUtilsService.doesFilterPassForMapProcessor(cellValue, filter, facet)) {
      filterPass = false;
    }
    return filterPass;
  }

  public static doesFilterPassForCsvProcessor(cellValue: unknown, filter: Filter, facet: FacetDef): boolean {
    if (facet.processor === 'csv') {
      let stringCellValue = cellValue as string;
      return stringCellValue.split(',').some(r => filter.values.includes(r.trim()));
    }
    return true;
  }

  public static doesFilterPassForArrayProcessor(cellValue: unknown, filter: Filter, facet: FacetDef): boolean {
    if (facet.processor === 'array') {
      let cellValueAsArray = cellValue as string[];
      return cellValueAsArray.some(r => filter.values.includes(r.trim()));
    }
    return true;
  }

  public static doesFilterPassForMapProcessor(cellValue: unknown, filter: Filter, facet: FacetDef): boolean {
    if (facet.processor === 'map') {
      let valueMap = cellValue as { [key: string]: number | string | boolean };
      for (let val of filter.values) {
        if (valueMap[val]) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  public static addFieldToFacet(facetValueMap: Map<string, number>, value: string) {
    value = value.trim();
    if (value) {
      if (facetValueMap.has(value)) {
        facetValueMap.set(value, facetValueMap.get(value)! + 1);
      } else {
        facetValueMap.set(value, 1);
      }
    }
  }

  public static addFieldsToFacet(facetValueMap: Map<string, number>, values: string[]) {
    for (let value of values) {
      this.addFieldToFacet(facetValueMap, value.trim());
    }
  }

  public static convertFacetMapToList(facetValueMap: Map<string, number>): FacetField[] {
    let facetFields: FacetField[] = [];
    facetValueMap.forEach((value: number, key: string) => {
      facetFields.push({
        "value": key,
        "count": value
      })
    });
    facetFields.sort((a, b) => a.value.localeCompare(b.value, undefined, {sensitivity: 'base'}))
    return facetFields;
  }

}
