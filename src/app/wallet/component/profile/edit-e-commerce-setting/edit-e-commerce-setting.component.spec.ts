import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditECommerceSettingComponent } from './edit-e-commerce-setting.component';

describe('EditECommerceSettingComponent', () => {
  let component: EditECommerceSettingComponent;
  let fixture: ComponentFixture<EditECommerceSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditECommerceSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditECommerceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
