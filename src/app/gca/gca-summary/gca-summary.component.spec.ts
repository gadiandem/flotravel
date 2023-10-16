import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaSummaryComponent } from './gca-summary.component';

describe('GcaSummaryComponent', () => {
  let component: GcaSummaryComponent;
  let fixture: ComponentFixture<GcaSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
