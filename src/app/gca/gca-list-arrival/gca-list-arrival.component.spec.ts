import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaListArrivalComponent } from './gca-list-arrival.component';

describe('GcaListArrivalComponent', () => {
  let component: GcaListArrivalComponent;
  let fixture: ComponentFixture<GcaListArrivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaListArrivalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaListArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
