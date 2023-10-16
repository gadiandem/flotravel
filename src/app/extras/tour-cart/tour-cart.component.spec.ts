/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TourCartComponent } from './tour-cart.component';

describe('TourCartComponent', () => {
  let component: TourCartComponent;
  let fixture: ComponentFixture<TourCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
