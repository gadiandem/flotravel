import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLoginComponent } from './wallet-login.component';

describe('WalletLoginComponent', () => {
  let component: WalletLoginComponent;
  let fixture: ComponentFixture<WalletLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
