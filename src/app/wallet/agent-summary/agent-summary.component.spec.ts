import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSummaryComponent } from './agent-summary.component';

describe('AgentSummaryComponent', () => {
  let component: AgentSummaryComponent;
  let fixture: ComponentFixture<AgentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
