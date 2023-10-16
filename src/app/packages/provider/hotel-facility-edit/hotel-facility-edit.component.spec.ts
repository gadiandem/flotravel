import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelFacilityEditComponent } from './hotel-facility-edit.component';

describe('HotelFacilityEditComponent', () => {
  let component: HotelFacilityEditComponent;
  let fixture: ComponentFixture<HotelFacilityEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelFacilityEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelFacilityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
