import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCreatePannelComponent } from './agent-create-pannel.component';

describe('AgentCreatePannelComponent', () => {
  let component: AgentCreatePannelComponent;
  let fixture: ComponentFixture<AgentCreatePannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCreatePannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCreatePannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
