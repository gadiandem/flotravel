import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemeListComponent } from './traceme-list.component';

describe('TracemeListComponent', () => {
  let component: TracemeListComponent;
  let fixture: ComponentFixture<TracemeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
