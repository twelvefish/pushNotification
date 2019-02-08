import { TestBed, inject } from '@angular/core/testing';

import { CatalogApiService } from './catalog-api.service';

describe('CatalogApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogApiService]
    });
  });

  it('should be created', inject([CatalogApiService], (service: CatalogApiService) => {
    expect(service).toBeTruthy();
  }));
});
