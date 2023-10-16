import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageAvailabilityComponent } from './package-availability.component';

describe('PackageAvailabilityComponent', () => {
  let component: PackageAvailabilityComponent;
  let fixture: ComponentFixture<PackageAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
