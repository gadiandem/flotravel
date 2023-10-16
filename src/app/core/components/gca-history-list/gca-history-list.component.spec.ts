import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaHistoryListComponent } from './gca-history-list.component';

describe('GcaHistoryListComponent', () => {
  let component: GcaHistoryListComponent;
  let fixture: ComponentFixture<GcaHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
