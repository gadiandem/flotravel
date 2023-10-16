import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraDetailAvailabilityComponent } from './extra-detail-availability.component';

describe('ExtraDetailAvailabilityComponent', () => {
  let component: ExtraDetailAvailabilityComponent;
  let fixture: ComponentFixture<ExtraDetailAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraDetailAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraDetailAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
