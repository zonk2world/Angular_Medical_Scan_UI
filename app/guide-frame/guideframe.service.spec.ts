import { TestBed } from '@angular/core/testing';

import { GuideframeService } from './guideframe.service';

describe('GuideframeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuideframeService = TestBed.get(GuideframeService);
    expect(service).toBeTruthy();
  });
});
