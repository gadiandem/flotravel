import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSideBarComponent } from './package-side-bar.component';

describe('PackageSideBarComponent', () => {
  let component: PackageSideBarComponent;
  let fixture: ComponentFixture<PackageSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
