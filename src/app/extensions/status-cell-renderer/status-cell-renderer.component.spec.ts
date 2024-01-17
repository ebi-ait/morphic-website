import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCellRendererComponent } from './status-cell-renderer.component';

describe('StatusColumnComponent', () => {
  let component: StatusCellRendererComponent;
  let fixture: ComponentFixture<StatusCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCellRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
