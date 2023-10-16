import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWithdrawStatusComponent } from './update-withdraw-status.component';

describe('UpdateWithdrawStatusComponent', () => {
  let component: UpdateWithdrawStatusComponent;
  let fixture: ComponentFixture<UpdateWithdrawStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateWithdrawStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateWithdrawStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
