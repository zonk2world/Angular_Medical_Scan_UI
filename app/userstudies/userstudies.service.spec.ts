import { TestBed } from '@angular/core/testing';

import { MyoldstudiesService } from './myoldstudies.service';

describe('MyoldstudiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyoldstudiesService = TestBed.get(MyoldstudiesService);
    expect(service).toBeTruthy();
  });
});
