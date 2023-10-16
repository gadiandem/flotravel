import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageInfoEditComponent } from './package-info-edit.component';

describe('PackageInfoEditComponent', () => {
  let component: PackageInfoEditComponent;
  let fixture: ComponentFixture<PackageInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageInfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
