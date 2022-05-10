import { TestBed } from '@angular/core/testing';

import { CroppedVideoPreviewService } from './cropped-video-preview.service';

describe('CroppedVideoPreviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CroppedVideoPreviewService = TestBed.get(CroppedVideoPreviewService);
    expect(service).toBeTruthy();
  });
});
