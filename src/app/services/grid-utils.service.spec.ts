import { TestBed } from '@angular/core/testing';

import { GridUtilsService } from './grid-utils.service';

describe('GridUtilsService', () => {
  let service: GridUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
