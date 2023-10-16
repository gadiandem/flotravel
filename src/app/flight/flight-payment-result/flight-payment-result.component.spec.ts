/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlightPaymentResultComponent } from './flight-payment-result.component';

describe('FlightPaymentResultComponent', () => {
  let component: FlightPaymentResultComponent;
  let fixture: ComponentFixture<FlightPaymentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPaymentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
