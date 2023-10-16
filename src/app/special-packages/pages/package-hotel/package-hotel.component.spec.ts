import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHotelComponent } from './package-hotel.component';

describe('PackageHotelComponent', () => {
  let component: PackageHotelComponent;
  let fixture: ComponentFixture<PackageHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
