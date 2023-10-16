import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchBoxComponent } from './hotel-search-box.component';

describe('HotelSearchBoxComponent', () => {
  let component: HotelSearchBoxComponent;
  let fixture: ComponentFixture<HotelSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
