import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CroppedVideoPreviewComponent } from './cropped-video-preview.component';

describe('CroppedVideoPreviewComponent', () => {
  let component: CroppedVideoPreviewComponent;
  let fixture: ComponentFixture<CroppedVideoPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CroppedVideoPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CroppedVideoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
