import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSummarySkeletonComponent } from './hotel-summary-skeleton.component';

describe('HotelSummarySkeletonComponent', () => {
  let component: HotelSummarySkeletonComponent;
  let fixture: ComponentFixture<HotelSummarySkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSummarySkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSummarySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
