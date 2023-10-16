import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSupperAdminComponent } from './profile-supper-admin.component';

describe('ProfileSupperAdminComponent', () => {
  let component: ProfileSupperAdminComponent;
  let fixture: ComponentFixture<ProfileSupperAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSupperAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSupperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
