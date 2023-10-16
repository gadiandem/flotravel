/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TourListComponent } from './tour-list.component';

describe('TourListComponent', () => {
  let component: TourListComponent;
  let fixture: ComponentFixture<TourListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
