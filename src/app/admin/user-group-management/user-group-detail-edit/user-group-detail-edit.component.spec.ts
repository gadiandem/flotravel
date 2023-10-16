import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupDetailEditComponent } from './user-group-detail-edit.component';

describe('UserGroupDetailComponent', () => {
  let component: UserGroupDetailEditComponent;
  let fixture: ComponentFixture<UserGroupDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
