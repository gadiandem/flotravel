import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatePannelComponent } from './user-create-pannel.component';

describe('UserCreatePannelComponent', () => {
  let component: UserCreatePannelComponent;
  let fixture: ComponentFixture<UserCreatePannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreatePannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreatePannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
