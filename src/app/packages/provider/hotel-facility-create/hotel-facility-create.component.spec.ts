import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelFacilityCreateComponent } from './hotel-facility-create.component';

describe('HotelFacilityCreateComponent', () => {
  let component: HotelFacilityCreateComponent;
  let fixture: ComponentFixture<HotelFacilityCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelFacilityCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelFacilityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
