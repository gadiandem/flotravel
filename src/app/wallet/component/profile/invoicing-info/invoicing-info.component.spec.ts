import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingInfoComponent } from './invoicing-info.component';

describe('InvoicingInfoComponent', () => {
  let component: InvoicingInfoComponent;
  let fixture: ComponentFixture<InvoicingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
