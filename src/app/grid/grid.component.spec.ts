import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GridComponent} from './grid.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AgGridModule} from "ag-grid-angular";

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AgGridModule],
      declarations: [GridComponent]
    });
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
