import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaPaymentResultComponent } from './gca-payment-result.component';

describe('GcaPaymentResultComponent', () => {
  let component: GcaPaymentResultComponent;
  let fixture: ComponentFixture<GcaPaymentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaPaymentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaPaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
