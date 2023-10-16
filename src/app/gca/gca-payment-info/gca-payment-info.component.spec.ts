import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaPaymentInfoComponent } from './gca-payment-info.component';

describe('GcaPaymentInfoComponent', () => {
  let component: GcaPaymentInfoComponent;
  let fixture: ComponentFixture<GcaPaymentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaPaymentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaPaymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
