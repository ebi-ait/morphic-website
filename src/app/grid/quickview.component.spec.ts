import { ComponentFixture, TestBed } from '@angular/core/testing';

import {QuickviewComponent} from "./quickview.component";

describe('QuickviewComponent', () => {
  let component: QuickviewComponent;
  let fixture: ComponentFixture<QuickviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickviewComponent]
    });
    fixture = TestBed.createComponent(QuickviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
