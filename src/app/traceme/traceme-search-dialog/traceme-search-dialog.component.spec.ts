import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemeSearchDialogComponent } from './traceme-search-dialog.component';

describe('TracemeSearchDialogComponent', () => {
  let component: TracemeSearchDialogComponent;
  let fixture: ComponentFixture<TracemeSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemeSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemeSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
