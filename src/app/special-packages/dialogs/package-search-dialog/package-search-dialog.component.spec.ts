import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialPackageSearchDialogComponent } from './package-search-dialog.component';

describe('PackageSearchDialogComponent', () => {
  let component: SpecialPackageSearchDialogComponent;
  let fixture: ComponentFixture<SpecialPackageSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialPackageSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialPackageSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
