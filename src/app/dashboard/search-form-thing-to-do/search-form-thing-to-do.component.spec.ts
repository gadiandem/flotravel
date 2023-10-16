/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SearchFormThingToDoComponent } from './search-form-thing-to-do.component';

describe('SearchFormThingToDoComponent', () => {
  let component: SearchFormThingToDoComponent;
  let fixture: ComponentFixture<SearchFormThingToDoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFormThingToDoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormThingToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
