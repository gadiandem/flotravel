import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceBookingHistoryDetailComponent } from './insurance-booking-history-detail.component';

describe('InsuranceBookingHistoryDetailComponent', () => {
  let component: InsuranceBookingHistoryDetailComponent;
  let fixture: ComponentFixture<InsuranceBookingHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceBookingHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceBookingHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
