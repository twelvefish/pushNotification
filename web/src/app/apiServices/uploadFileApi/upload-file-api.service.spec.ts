import { TestBed, inject } from '@angular/core/testing';

import { UploadFileApiService } from './upload-file-api.service';

describe('UploadFileApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadFileApiService]
    });
  });

  it('should be created', inject([UploadFileApiService], (service: UploadFileApiService) => {
    expect(service).toBeTruthy();
  }));
});
