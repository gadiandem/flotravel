/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlightReturnComponent } from './flight-return.component';

describe('FlightReturnComponent', () => {
  let component: FlightReturnComponent;
  let fixture: ComponentFixture<FlightReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
