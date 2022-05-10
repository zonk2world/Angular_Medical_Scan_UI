import { TestBed } from '@angular/core/testing';

import { MakingboundriesService } from './makingboundries.service';

describe('MakingboundriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MakingboundriesService = TestBed.get(MakingboundriesService);
    expect(service).toBeTruthy();
  });
});
