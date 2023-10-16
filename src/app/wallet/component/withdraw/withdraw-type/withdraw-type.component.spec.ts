import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawTypeComponent } from './withdraw-type.component';

describe('WithdrawTypeComponent', () => {
  let component: WithdrawTypeComponent;
  let fixture: ComponentFixture<WithdrawTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
