import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageOptionalComponent } from './package-optional.component';

describe('PackageOptionalComponent', () => {
  let component: PackageOptionalComponent;
  let fixture: ComponentFixture<PackageOptionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageOptionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageOptionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
