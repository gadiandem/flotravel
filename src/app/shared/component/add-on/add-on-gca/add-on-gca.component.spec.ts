import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnGcaComponent } from './add-on-gca.component';

describe('AddOnGcaComponent', () => {
  let component: AddOnGcaComponent;
  let fixture: ComponentFixture<AddOnGcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnGcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnGcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
