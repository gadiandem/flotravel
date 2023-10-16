import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageInfoCreateComponent } from './package-info-create.component';

describe('PackageInfoCreateComponent', () => {
  let component: PackageInfoCreateComponent;
  let fixture: ComponentFixture<PackageInfoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageInfoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageInfoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
