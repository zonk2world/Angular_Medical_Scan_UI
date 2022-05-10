import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropimageComponent } from './cropimage.component';

describe('CropimageComponent', () => {
  let component: CropimageComponent;
  let fixture: ComponentFixture<CropimageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropimageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
