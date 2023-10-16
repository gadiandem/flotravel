import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDetailCreateComponent } from './agent-detail-create.component';

describe('AgentDetailCreateComponent', () => {
  let component: AgentDetailCreateComponent;
  let fixture: ComponentFixture<AgentDetailCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentDetailCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDetailCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
