import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelFacilityComponent } from './hotel-facility.component';

describe('HotelFacilityComponent', () => {
  let component: HotelFacilityComponent;
  let fixture: ComponentFixture<HotelFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
