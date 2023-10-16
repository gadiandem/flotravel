import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCancelBookingComponent } from './hotel-cancel-booking.component';

describe('HotelCancelBookingComponent', () => {
  let component: HotelCancelBookingComponent;
  let fixture: ComponentFixture<HotelCancelBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCancelBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCancelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
