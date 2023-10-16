import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositStepThreeComponent } from './deposit-step-three.component';

describe('DepositStepThreeComponent', () => {
  let component: DepositStepThreeComponent;
  let fixture: ComponentFixture<DepositStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositStepThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
