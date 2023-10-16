import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawDetailModalComponent } from './withdraw-detail-modal.component';

describe('WithdrawDetailModalComponent', () => {
  let component: WithdrawDetailModalComponent;
  let fixture: ComponentFixture<WithdrawDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
