import { TestBed, inject } from '@angular/core/testing';

import { ReviewMessageApiService } from './review-message-api.service';

describe('ReviewMessageApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewMessageApiService]
    });
  });

  it('should be created', inject([ReviewMessageApiService], (service: ReviewMessageApiService) => {
    expect(service).toBeTruthy();
  }));
});
