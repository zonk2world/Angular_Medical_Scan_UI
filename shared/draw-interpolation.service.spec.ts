import { TestBed } from '@angular/core/testing';

import { DrawInterpolationService } from './draw-interpolation.service';

describe('DrawInterpolationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawInterpolationService = TestBed.get(DrawInterpolationService);
    expect(service).toBeTruthy();
  });
});
