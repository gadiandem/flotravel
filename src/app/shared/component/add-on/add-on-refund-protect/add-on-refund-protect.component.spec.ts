import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnRefundProtectComponent } from './add-on-refund-protect.component';

describe('AddOnRefundProtectComponent', () => {
  let component: AddOnRefundProtectComponent;
  let fixture: ComponentFixture<AddOnRefundProtectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnRefundProtectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnRefundProtectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
