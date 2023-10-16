import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCancelDialogComponent } from './tour-cancel-dialog.component';

describe('TourCancelDialogComponent', () => {
  let component: TourCancelDialogComponent;
  let fixture: ComponentFixture<TourCancelDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourCancelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourCancelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
