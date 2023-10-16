import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemeCartComponent } from './traceme-cart.component';

describe('TracemeCartComponent', () => {
  let component: TracemeCartComponent;
  let fixture: ComponentFixture<TracemeCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemeCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemeCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
