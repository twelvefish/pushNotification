import { TestBed, inject } from '@angular/core/testing';

import { KendoService } from './kendo.service';

describe('KendoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KendoService]
    });
  });

  it('should be created', inject([KendoService], (service: KendoService) => {
    expect(service).toBeTruthy();
  }));
});
