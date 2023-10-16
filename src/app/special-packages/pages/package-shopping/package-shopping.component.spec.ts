import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageShoppingComponent } from './package-shopping.component';

describe('PackageShoppingComponent', () => {
  let component: PackageShoppingComponent;
  let fixture: ComponentFixture<PackageShoppingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageShoppingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
