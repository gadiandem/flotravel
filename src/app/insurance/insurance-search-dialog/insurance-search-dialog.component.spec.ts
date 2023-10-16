import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSearchDialogComponent } from './insurance-search-dialog.component';

describe('InsuranceSearchDialogComponent', () => {
  let component: InsuranceSearchDialogComponent;
  let fixture: ComponentFixture<InsuranceSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
