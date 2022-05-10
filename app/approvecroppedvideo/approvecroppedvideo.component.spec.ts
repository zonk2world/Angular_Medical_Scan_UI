import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovecroppedvideoComponent } from './approvecroppedvideo.component';

describe('ApprovecroppedvideoComponent', () => {
  let component: ApprovecroppedvideoComponent;
  let fixture: ComponentFixture<ApprovecroppedvideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovecroppedvideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovecroppedvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
