import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCreateComponent } from './tax-create.component';

describe('TaxCreateComponent', () => {
  let component: TaxCreateComponent;
  let fixture: ComponentFixture<TaxCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
