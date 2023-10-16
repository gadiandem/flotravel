import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerBankAccountComponent } from './manager-bank-account.component';

describe('ManagerBankAccountComponent', () => {
  let component: ManagerBankAccountComponent;
  let fixture: ComponentFixture<ManagerBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerBankAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
