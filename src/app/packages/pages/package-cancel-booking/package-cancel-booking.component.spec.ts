import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCancelBookingComponent } from './package-cancel-booking.component';

describe('PackageCancelBookingComponent', () => {
  let component: PackageCancelBookingComponent;
  let fixture: ComponentFixture<PackageCancelBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageCancelBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCancelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
