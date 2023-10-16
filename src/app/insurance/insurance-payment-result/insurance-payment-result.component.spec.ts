import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePaymentResultComponent } from './insurance-payment-result.component';

describe('InsurancePaymentResultComponent', () => {
  let component: InsurancePaymentResultComponent;
  let fixture: ComponentFixture<InsurancePaymentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancePaymentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
