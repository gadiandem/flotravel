import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineSummaryComponent } from './combine-summary.component';

describe('CombineSummaryComponent', () => {
  let component: CombineSummaryComponent;
  let fixture: ComponentFixture<CombineSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
