import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectTracemeComponent } from './redirect-traceme.component';

describe('RedirectTracemeComponent', () => {
  let component: RedirectTracemeComponent;
  let fixture: ComponentFixture<RedirectTracemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectTracemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectTracemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
