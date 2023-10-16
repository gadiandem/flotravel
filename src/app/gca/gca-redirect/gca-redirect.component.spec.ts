import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaRedirectComponent } from './gca-redirect.component';

describe('GcaRedirectComponent', () => {
  let component: GcaRedirectComponent;
  let fixture: ComponentFixture<GcaRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
