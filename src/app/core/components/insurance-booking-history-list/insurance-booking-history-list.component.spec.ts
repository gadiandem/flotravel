import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceBookingHistoryListComponent } from './insurance-booking-history-list.component';

describe('InsuranceBookingHistoryListComponent', () => {
  let component: InsuranceBookingHistoryListComponent;
  let fixture: ComponentFixture<InsuranceBookingHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceBookingHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceBookingHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
