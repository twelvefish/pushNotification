import { TestBed, inject } from '@angular/core/testing';

import { PushMessageApiService } from './push-message-api.service';

describe('PushMessageApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PushMessageApiService]
    });
  });

  it('should be created', inject([PushMessageApiService], (service: PushMessageApiService) => {
    expect(service).toBeTruthy();
  }));
});
