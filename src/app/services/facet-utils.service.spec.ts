import { TestBed } from '@angular/core/testing';

import { FacetUtilsService } from './facet-utils.service';
import {FacetDef, Filter} from "../types/facet";

describe('FacetUtilsService', () => {
  let service: FacetUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacetUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('filters should work for CSV values', () => {
    let cellValue = 'Australia, Pakistan';
    let filter: Filter = {'title': 'regions', values: ['UK', 'South Africa', 'Australia', 'Brazil']};
    let facetDef: FacetDef = {'field': 'regions', 'processor': 'csv'};

    let filterPassed = FacetUtilsService.doesFilterPassForCsvProcessor(cellValue, filter, facetDef);
    expect(filterPassed).toBeTruthy();

    filter = {'title': 'regions', values: ['UK', 'South Africa', 'Brazil']};
    filterPassed = FacetUtilsService.doesFilterPassForCsvProcessor(cellValue, filter, facetDef);
    expect(filterPassed).toBeFalse();
  });

  it('filters should work for Array values', () => {
    let cellValue = ['Australia', 'Pakistan'];
    let filter: Filter = {'title': 'regions', values: ['UK', 'South Africa', 'Australia', 'Brazil']};
    let facetDef: FacetDef = {'field': 'regions', 'processor': 'array'};

    let filterPassed = FacetUtilsService.doesFilterPassForArrayProcessor(cellValue, filter, facetDef);
    expect(filterPassed).toBeTruthy();

    filter = {'title': 'regions', values: ['UK', 'South Africa', 'Brazil']};
    filterPassed = FacetUtilsService.doesFilterPassForArrayProcessor(cellValue, filter, facetDef);
    expect(filterPassed).toBeFalse();
  });

  it('filters should work for Map data type', () => {
    let cellValue = {'Australia': true, 'Pakistan': true};
    let filter: Filter = {'title': 'regions', values: ['UK', 'South Africa', 'Australia', 'Brazil']};
    let facetDef: FacetDef = {'field': 'regions', 'processor': 'map'};

    let filterPassed = FacetUtilsService.doesFilterPassForMapProcessor(cellValue, filter, facetDef);
    expect(filterPassed).toBeTruthy();

    filter = {'title': 'regions', values: ['UK', 'South Africa', 'Brazil']};
    filterPassed = FacetUtilsService.doesFilterPassForMapProcessor(cellValue, filter, facetDef);
    expect(filterPassed).toBeFalse();
  });

  it('correctly add fields to facet', () => {
    let facetValueMap = new Map<string, number>();
    let fields = ['Russia', 'Ukraine'];

    FacetUtilsService.addFieldsToFacet(facetValueMap, fields);
    expect(facetValueMap.size).toEqual(2);

    fields = ['Ukraine', 'Poland'];
    FacetUtilsService.addFieldsToFacet(facetValueMap, fields);
    expect(facetValueMap.size).toEqual(3);
    expect(facetValueMap.get('Ukraine')).toEqual(2);
  });

});
