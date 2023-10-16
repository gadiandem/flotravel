import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDetailComponent } from './insurance-detail.component';

describe('InsuranceDetailComponent', () => {
  let component: InsuranceDetailComponent;
  let fixture: ComponentFixture<InsuranceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
