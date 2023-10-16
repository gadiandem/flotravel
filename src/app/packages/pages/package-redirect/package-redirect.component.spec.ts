import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageRedirectComponent } from './package-redirect.component';

describe('PackageRedirectComponent', () => {
  let component: PackageRedirectComponent;
  let fixture: ComponentFixture<PackageRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
