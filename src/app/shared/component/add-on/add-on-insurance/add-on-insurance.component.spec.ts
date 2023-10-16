import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnInsuranceComponent } from './add-on-insurance.component';

describe('AddOnInsuranceComponent', () => {
  let component: AddOnInsuranceComponent;
  let fixture: ComponentFixture<AddOnInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
