import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoundariesComponent } from './add-boundaries.component';

describe('AddBoundariesComponent', () => {
  let component: AddBoundariesComponent;
  let fixture: ComponentFixture<AddBoundariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBoundariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBoundariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
