import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectSpecialPackageComponent } from './redirect-special-package.component';

describe('RedirectSpecialPackageComponent', () => {
  let component: RedirectSpecialPackageComponent;
  let fixture: ComponentFixture<RedirectSpecialPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectSpecialPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectSpecialPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
