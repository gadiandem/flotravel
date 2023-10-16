import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertTourComponent } from './insert-tour.component';

describe('InsertTourComponent', () => {
  let component: InsertTourComponent;
  let fixture: ComponentFixture<InsertTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
