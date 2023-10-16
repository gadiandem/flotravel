import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsTransactionComponent } from './polls-transaction.component';

describe('PollsTransactionComponent', () => {
  let component: PollsTransactionComponent;
  let fixture: ComponentFixture<PollsTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollsTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
