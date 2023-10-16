import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemePaymentResultComponent } from './traceme-payment-result.component';

describe('TracemePaymentResultComponent', () => {
  let component: TracemePaymentResultComponent;
  let fixture: ComponentFixture<TracemePaymentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemePaymentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemePaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
