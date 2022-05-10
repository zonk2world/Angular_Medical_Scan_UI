import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideFrameComponent } from './guide-frame.component';

describe('GuideFrameComponent', () => {
  let component: GuideFrameComponent;
  let fixture: ComponentFixture<GuideFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
