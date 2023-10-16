import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawChooseBankComponent } from './withdraw-choose-bank.component';

describe('WithdrawChooseBankComponent', () => {
  let component: WithdrawChooseBankComponent;
  let fixture: ComponentFixture<WithdrawChooseBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawChooseBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawChooseBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
