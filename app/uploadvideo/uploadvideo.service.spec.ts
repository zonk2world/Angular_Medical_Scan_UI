import { TestBed } from '@angular/core/testing';

import { UploadvideoService } from './uploadvideo.service';

describe('UploadvideoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadvideoService = TestBed.get(UploadvideoService);
    expect(service).toBeTruthy();
  });
});
