import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionHistorySearchComponent } from './transaction-history-search.component';

describe('TransactionHistorySearchComponent', () => {
  let component: TransactionHistorySearchComponent;
  let fixture: ComponentFixture<TransactionHistorySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionHistorySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
