import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectProcessComponent } from './redirect-process.component';

describe('RedirectProcessComponent', () => {
  let component: RedirectProcessComponent;
  let fixture: ComponentFixture<RedirectProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
