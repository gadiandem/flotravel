import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcaComponent } from './gca.component';

describe('GcaComponent', () => {
  let component: GcaComponent;
  let fixture: ComponentFixture<GcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
