import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgentManagerComponent } from './user-agent-manager.component';

describe('UserAgentManagerComponent', () => {
  let component: UserAgentManagerComponent;
  let fixture: ComponentFixture<UserAgentManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgentManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
