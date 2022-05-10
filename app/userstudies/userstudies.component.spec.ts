import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyoldstudiesComponent } from './myoldstudies.component';

describe('MyoldstudiesComponent', () => {
  let component: MyoldstudiesComponent;
  let fixture: ComponentFixture<MyoldstudiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyoldstudiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyoldstudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
