import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialPackageHotelSkeletonComponent } from './special-package-hotel-skeleton.component';

describe('SpecialPackageHotelSkeletonComponent', () => {
  let component: SpecialPackageHotelSkeletonComponent;
  let fixture: ComponentFixture<SpecialPackageHotelSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialPackageHotelSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialPackageHotelSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
