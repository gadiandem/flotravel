import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCartComponent } from './insurance-cart.component';

describe('InsuranceCartComponent', () => {
  let component: InsuranceCartComponent;
  let fixture: ComponentFixture<InsuranceCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
