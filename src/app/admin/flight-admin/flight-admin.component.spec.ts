import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAdminComponent } from './flight-admin.component';

describe('FlightAdminComponent', () => {
  let component: FlightAdminComponent;
  let fixture: ComponentFixture<FlightAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
