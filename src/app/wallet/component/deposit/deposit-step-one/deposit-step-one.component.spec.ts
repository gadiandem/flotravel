import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositStepOneComponent } from './deposit-step-one.component';

describe('DepositStepOneComponent', () => {
  let component: DepositStepOneComponent;
  let fixture: ComponentFixture<DepositStepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositStepOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
