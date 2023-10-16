import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCreditCardComponent } from './manager-credit-card.component';

describe('ManagerCreditCardComponent', () => {
  let component: ManagerCreditCardComponent;
  let fixture: ComponentFixture<ManagerCreditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerCreditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
