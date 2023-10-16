import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemeComponent } from './traceme.component';

describe('TracemeComponent', () => {
  let component: TracemeComponent;
  let fixture: ComponentFixture<TracemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
