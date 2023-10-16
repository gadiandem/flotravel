import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPaymentResultSkeletonComponent } from './flight-payment-result-skeleton.component';

describe('FlightPaymentResultSkeletonComponent', () => {
  let component: FlightPaymentResultSkeletonComponent;
  let fixture: ComponentFixture<FlightPaymentResultSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPaymentResultSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPaymentResultSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
