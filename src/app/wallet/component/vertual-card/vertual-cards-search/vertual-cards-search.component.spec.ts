import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertualCardsSearchComponent } from './vertual-cards-search.component';

describe('VertualCardsSearchComponent', () => {
  let component: VertualCardsSearchComponent;
  let fixture: ComponentFixture<VertualCardsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VertualCardsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VertualCardsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
