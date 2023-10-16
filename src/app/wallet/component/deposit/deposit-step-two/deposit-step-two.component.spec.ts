import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositStepTwoComponent } from './deposit-step-two.component';

describe('DepositStepTwoComponent', () => {
  let component: DepositStepTwoComponent;
  let fixture: ComponentFixture<DepositStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
