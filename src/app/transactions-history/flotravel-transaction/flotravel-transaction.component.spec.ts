import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotravelTransactionComponent } from './flotravel-transaction.component';

describe('FlotravelTransactionComponent', () => {
  let component: FlotravelTransactionComponent;
  let fixture: ComponentFixture<FlotravelTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlotravelTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotravelTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
