import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialPackageItemDetailComponent } from './special-package-item-detail.component';

describe('SpecialPackageItemDetailComponent', () => {
  let component: SpecialPackageItemDetailComponent;
  let fixture: ComponentFixture<SpecialPackageItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialPackageItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialPackageItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
