import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnSmartDelayComponent } from './add-on-smart-delay.component';

describe('AddOnSmartDelayComponent', () => {
  let component: AddOnSmartDelayComponent;
  let fixture: ComponentFixture<AddOnSmartDelayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnSmartDelayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnSmartDelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
