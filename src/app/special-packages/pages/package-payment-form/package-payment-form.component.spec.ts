import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePaymentFormComponent } from './package-payment-form.component';

describe('PackagePaymentFormComponent', () => {
  let component: PackagePaymentFormComponent;
  let fixture: ComponentFixture<PackagePaymentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagePaymentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagePaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
