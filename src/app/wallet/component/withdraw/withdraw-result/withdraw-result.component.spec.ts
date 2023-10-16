import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawResultComponent } from './withdraw-result.component';

describe('WithdrawResultComponent', () => {
  let component: WithdrawResultComponent;
  let fixture: ComponentFixture<WithdrawResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
