import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodownloadComponent } from './videodownload.component';

describe('VideodownloadComponent', () => {
  let component: VideodownloadComponent;
  let fixture: ComponentFixture<VideodownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideodownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideodownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
