import { TestBed, inject } from '@angular/core/testing';

import { MessageApiService } from './message-api.service';

describe('MessageApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageApiService]
    });
  });

  it('should be created', inject([MessageApiService], (service: MessageApiService) => {
    expect(service).toBeTruthy();
  }));
});
