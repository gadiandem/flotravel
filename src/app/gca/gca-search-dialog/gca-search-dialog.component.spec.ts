import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaSearchDialogComponent } from './gca-search-dialog.component';

describe('GcaSearchDialogComponent', () => {
  let component: GcaSearchDialogComponent;
  let fixture: ComponentFixture<GcaSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
