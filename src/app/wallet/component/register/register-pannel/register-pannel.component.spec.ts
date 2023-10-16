import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPannelComponent } from './register-pannel.component';

describe('RegisterPannelComponent', () => {
  let component: RegisterPannelComponent;
  let fixture: ComponentFixture<RegisterPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
