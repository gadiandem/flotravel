import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageOrderComponent } from './package-order.component';

describe('PackageOrderComponent', () => {
  let component: PackageOrderComponent;
  let fixture: ComponentFixture<PackageOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
