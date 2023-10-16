import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupDetailCreateComponent } from './user-group-detail-create.component';

describe('UserGroupDetailCreateComponent', () => {
  let component: UserGroupDetailCreateComponent;
  let fixture: ComponentFixture<UserGroupDetailCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupDetailCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupDetailCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
