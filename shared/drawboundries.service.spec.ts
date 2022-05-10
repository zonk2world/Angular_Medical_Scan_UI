import { TestBed } from '@angular/core/testing';

import { DrawboundriesService } from './drawboundries.service';

describe('DrawboundriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawboundriesService = TestBed.get(DrawboundriesService);
    expect(service).toBeTruthy();
  });
});
