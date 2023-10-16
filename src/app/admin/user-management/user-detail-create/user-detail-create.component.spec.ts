/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserDetailCreateComponent } from './user-detail-create.component';

describe('UserDetailComponent', () => {
  let component: UserDetailCreateComponent;
  let fixture: ComponentFixture<UserDetailCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
