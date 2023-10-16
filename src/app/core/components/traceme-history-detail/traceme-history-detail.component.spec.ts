import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemeHistoryDetailComponent } from './traceme-history-detail.component';

describe('TracemeHistoryDetailComponent', () => {
  let component: TracemeHistoryDetailComponent;
  let fixture: ComponentFixture<TracemeHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemeHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemeHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
