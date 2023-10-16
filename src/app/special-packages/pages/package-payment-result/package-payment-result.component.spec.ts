import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePaymentResultComponent } from './package-payment-result.component';

describe('PackagePaymentResultComponent', () => {
  let component: PackagePaymentResultComponent;
  let fixture: ComponentFixture<PackagePaymentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagePaymentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagePaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
