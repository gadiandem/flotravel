import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgentCreateComponent } from './user-agent-create.component';

describe('UserAgentCreateComponent', () => {
  let component: UserAgentCreateComponent;
  let fixture: ComponentFixture<UserAgentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
