import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightHistoryListComponent } from './flight-history-list.component';

describe('FlightHistoryListComponent', () => {
  let component: FlightHistoryListComponent;
  let fixture: ComponentFixture<FlightHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
