import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundarypreviewComponent } from './boundarypreview.component';

describe('BoundarypreviewComponent', () => {
  let component: BoundarypreviewComponent;
  let fixture: ComponentFixture<BoundarypreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoundarypreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundarypreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
