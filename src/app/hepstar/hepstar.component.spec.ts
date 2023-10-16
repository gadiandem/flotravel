import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HepstarComponent } from './hepstar.component';

describe('HepstarComponent', () => {
  let component: HepstarComponent;
  let fixture: ComponentFixture<HepstarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HepstarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HepstarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
