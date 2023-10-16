import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpUpdateComponent } from './otp-update.component';

describe('OtpUpdateComponent', () => {
  let component: OtpUpdateComponent;
  let fixture: ComponentFixture<OtpUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
