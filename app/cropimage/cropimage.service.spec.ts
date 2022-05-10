import { TestBed } from '@angular/core/testing';

import { CropimageService } from './cropimage.service';

describe('CropimageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CropimageService = TestBed.get(CropimageService);
    expect(service).toBeTruthy();
  });
});
