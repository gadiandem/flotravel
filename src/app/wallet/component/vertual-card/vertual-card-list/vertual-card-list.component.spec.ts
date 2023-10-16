import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertualCardListComponent } from './vertual-card-list.component';

describe('VertualCardListComponent', () => {
  let component: VertualCardListComponent;
  let fixture: ComponentFixture<VertualCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VertualCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VertualCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
