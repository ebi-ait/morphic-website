import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FacetComponent} from './facet.component';
import {first} from "rxjs";
import {Filter} from "../../types/facet";

describe('FacetComponent', () => {
  let component: FacetComponent;
  let fixture: ComponentFixture<FacetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacetComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking on facet field should emit a filter', () => {
    const comp = new FacetComponent();
    comp.facet = {"title": "Diseases", "values": [{"value": "Diabetes", "count": 10}]}
    comp.facetControl.setValue(["Diabetes"] as unknown as string);

    comp.filterChanged("");
    let expectedFilter: Filter = {"title": "Diseases", "values": ["Diabetes"]}
    comp.filterChangedEvent.pipe(first()).subscribe((filter: Filter) => {
      expect(filter).toBe(expectedFilter);
    })
    expect(component).toBeTruthy();
  });
});
