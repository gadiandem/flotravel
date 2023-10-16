import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawChooseCardComponent } from './withdraw-choose-card.component';

describe('WithdrawChooseCardComponent', () => {
  let component: WithdrawChooseCardComponent;
  let fixture: ComponentFixture<WithdrawChooseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawChooseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawChooseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
