import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotravelLogsDetailComponent } from './flotravel-logs-detail.component';

describe('FlotravelLogsDetailComponent', () => {
  let component: FlotravelLogsDetailComponent;
  let fixture: ComponentFixture<FlotravelLogsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlotravelLogsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotravelLogsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
