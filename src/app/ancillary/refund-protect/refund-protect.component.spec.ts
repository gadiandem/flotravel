import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundProtectComponent } from './refund-protect.component';

describe('RefundProtectComponent', () => {
  let component: RefundProtectComponent;
  let fixture: ComponentFixture<RefundProtectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundProtectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundProtectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
