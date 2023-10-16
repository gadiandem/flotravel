import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaHistoryDetailComponent } from './gca-history-detail.component';

describe('GcaHistoryDetailComponent', () => {
  let component: GcaHistoryDetailComponent;
  let fixture: ComponentFixture<GcaHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
