import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyBookingComponent } from './agency-booking.component';

describe('AgencyBookingComponent', () => {
  let component: AgencyBookingComponent;
  let fixture: ComponentFixture<AgencyBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
