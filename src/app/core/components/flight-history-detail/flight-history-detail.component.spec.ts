import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightHistoryDetailComponent } from './flight-history-detail.component';

describe('FlightHistoryDetailComponent', () => {
  let component: FlightHistoryDetailComponent;
  let fixture: ComponentFixture<FlightHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
