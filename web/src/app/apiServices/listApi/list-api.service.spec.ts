import { TestBed, inject } from '@angular/core/testing';

import { ListApiService } from './list-api.service';

describe('ListApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListApiService]
    });
  });

  it('should be created', inject([ListApiService], (service: ListApiService) => {
    expect(service).toBeTruthy();
  }));
});
