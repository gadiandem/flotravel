import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnTracemeComponent } from './add-on-traceme.component';

describe('AddOnTracemeComponent', () => {
  let component: AddOnTracemeComponent;
  let fixture: ComponentFixture<AddOnTracemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnTracemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnTracemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
