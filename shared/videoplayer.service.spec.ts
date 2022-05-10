import { TestBed } from '@angular/core/testing';

import { VideoplayerService } from './videoplayer.service';

describe('VideoplayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoplayerService = TestBed.get(VideoplayerService);
    expect(service).toBeTruthy();
  });
});
