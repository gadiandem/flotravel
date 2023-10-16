import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineFlightListComponent } from './combine-flight-list.component';

describe('CombineFlightListComponent', () => {
  let component: CombineFlightListComponent;
  let fixture: ComponentFixture<CombineFlightListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineFlightListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineFlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
