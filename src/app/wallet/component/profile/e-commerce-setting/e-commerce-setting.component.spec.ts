import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ECommerceSettingComponent } from './e-commerce-setting.component';

describe('ECommerceSettingComponent', () => {
  let component: ECommerceSettingComponent;
  let fixture: ComponentFixture<ECommerceSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECommerceSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ECommerceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
