import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialPackageRedirectComponent } from './special-package-redirect.component';

describe('SpecialPackageRedirectComponent', () => {
  let component: SpecialPackageRedirectComponent;
  let fixture: ComponentFixture<SpecialPackageRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialPackageRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialPackageRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
