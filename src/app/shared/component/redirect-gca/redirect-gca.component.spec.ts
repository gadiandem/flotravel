import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectGcaComponent } from './redirect-gca.component';

describe('RedirectGcaComponent', () => {
  let component: RedirectGcaComponent;
  let fixture: ComponentFixture<RedirectGcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectGcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectGcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
