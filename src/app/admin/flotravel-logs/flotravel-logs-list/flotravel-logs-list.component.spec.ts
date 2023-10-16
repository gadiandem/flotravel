import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotravelLogsListComponent } from './flotravel-logs-list.component';

describe('FlotravelLogsListComponent', () => {
  let component: FlotravelLogsListComponent;
  let fixture: ComponentFixture<FlotravelLogsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlotravelLogsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotravelLogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
