import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoicingComponent } from './edit-invoicing.component';

describe('EditInvoicingComponent', () => {
  let component: EditInvoicingComponent;
  let fixture: ComponentFixture<EditInvoicingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInvoicingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInvoicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
