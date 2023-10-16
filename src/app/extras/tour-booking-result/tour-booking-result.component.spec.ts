/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TourBookingResultComponent } from './tour-booking-result.component';

describe('TourBookingResultComponent', () => {
  let component: TourBookingResultComponent;
  let fixture: ComponentFixture<TourBookingResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourBookingResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourBookingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
