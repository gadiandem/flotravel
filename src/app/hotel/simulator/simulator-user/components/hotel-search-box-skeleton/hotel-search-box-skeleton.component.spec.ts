import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchBoxSkeletonComponent } from './hotel-search-box-skeleton.component';

describe('HotelSearchBoxSkeletonComponent', () => {
  let component: HotelSearchBoxSkeletonComponent;
  let fixture: ComponentFixture<HotelSearchBoxSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchBoxSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchBoxSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
