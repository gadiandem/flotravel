import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositMoneyComponent } from './deposit-money.component';

describe('DepositMoneyComponent', () => {
  let component: DepositMoneyComponent;
  let fixture: ComponentFixture<DepositMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
