import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageShoppingImageComponent } from './package-shopping-image.component';

describe('PackageShoppingImageComponent', () => {
  let component: PackageShoppingImageComponent;
  let fixture: ComponentFixture<PackageShoppingImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageShoppingImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageShoppingImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
