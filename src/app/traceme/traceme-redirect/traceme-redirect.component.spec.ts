import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracemeRedirectComponent } from './traceme-redirect.component';

describe('TracemeRedirectComponent', () => {
  let component: TracemeRedirectComponent;
  let fixture: ComponentFixture<TracemeRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracemeRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracemeRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
