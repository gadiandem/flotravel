/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlightPaymentInfoComponent } from './flight-payment-info.component';

describe('FlightPaymentInfoComponent', () => {
  let component: FlightPaymentInfoComponent;
  let fixture: ComponentFixture<FlightPaymentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPaymentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPaymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
