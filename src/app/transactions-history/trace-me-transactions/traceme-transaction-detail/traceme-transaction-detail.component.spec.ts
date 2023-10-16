import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemeTransactionDetailComponent } from './traceme-transaction-detail.component';

describe('TracemeTransactionDetailComponent', () => {
  let component: TracemeTransactionDetailComponent;
  let fixture: ComponentFixture<TracemeTransactionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemeTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemeTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
