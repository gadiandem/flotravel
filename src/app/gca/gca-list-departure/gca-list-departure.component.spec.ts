import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaListDepartureComponent } from './gca-list-departure.component';

describe('GcaListDepartureComponent', () => {
  let component: GcaListDepartureComponent;
  let fixture: ComponentFixture<GcaListDepartureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaListDepartureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaListDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
