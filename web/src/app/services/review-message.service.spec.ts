import { TestBed, inject } from '@angular/core/testing';

import { ReviewMessageService } from './review-message.service';

describe('ReviewMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewMessageService]
    });
  });

  it('should be created', inject([ReviewMessageService], (service: ReviewMessageService) => {
    expect(service).toBeTruthy();
  }));
});
