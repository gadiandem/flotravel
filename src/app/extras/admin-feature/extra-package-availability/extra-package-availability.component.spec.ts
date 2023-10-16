import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPackageAvailabilityComponent } from './extra-package-availability.component';

describe('ExtraPackageAvailabilityComponent', () => {
  let component: ExtraPackageAvailabilityComponent;
  let fixture: ComponentFixture<ExtraPackageAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraPackageAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPackageAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
