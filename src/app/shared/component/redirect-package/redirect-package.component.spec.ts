import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectPackageComponent } from './redirect-package.component';

describe('RedirectPackageComponent', () => {
  let component: RedirectPackageComponent;
  let fixture: ComponentFixture<RedirectPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
