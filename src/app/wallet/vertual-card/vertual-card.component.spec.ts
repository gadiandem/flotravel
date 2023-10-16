import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertualCardComponent } from './vertual-card.component';

describe('VertualCardComponent', () => {
  let component: VertualCardComponent;
  let fixture: ComponentFixture<VertualCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VertualCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VertualCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
