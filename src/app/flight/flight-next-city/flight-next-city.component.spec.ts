/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlightNextCityComponent } from './flight-next-city.component';

describe('FlightNextCityComponent', () => {
  let component: FlightNextCityComponent;
  let fixture: ComponentFixture<FlightNextCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightNextCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightNextCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
