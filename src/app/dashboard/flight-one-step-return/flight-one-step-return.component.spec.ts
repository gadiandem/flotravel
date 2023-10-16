import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightOneStepReturnComponent } from './flight-one-step-return.component';

describe('FlightOneStepReturnComponent', () => {
  let component: FlightOneStepReturnComponent;
  let fixture: ComponentFixture<FlightOneStepReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightOneStepReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightOneStepReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
