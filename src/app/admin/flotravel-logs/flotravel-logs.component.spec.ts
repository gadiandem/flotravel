import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotravelLogsComponent } from './flotravel-logs.component';

describe('FlotravelLogsComponent', () => {
  let component: FlotravelLogsComponent;
  let fixture: ComponentFixture<FlotravelLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlotravelLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotravelLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
