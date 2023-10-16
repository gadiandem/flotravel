import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSummaryComponent } from './hotel-summary.component';

describe('HotelSummaryComponent', () => {
  let component: HotelSummaryComponent;
  let fixture: ComponentFixture<HotelSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
