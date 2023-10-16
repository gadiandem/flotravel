import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCancelBookingComponent } from './flight-cancel-booking.component';

describe('FlightCancelBookingComponent', () => {
  let component: FlightCancelBookingComponent;
  let fixture: ComponentFixture<FlightCancelBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightCancelBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCancelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
