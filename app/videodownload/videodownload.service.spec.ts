import { TestBed } from '@angular/core/testing';

import { VideodownloadService } from './videodownload.service';

describe('VideodownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideodownloadService = TestBed.get(VideodownloadService);
    expect(service).toBeTruthy();
  });
});
