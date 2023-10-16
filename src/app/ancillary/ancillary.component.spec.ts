import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AncillaryComponent } from './ancillary.component';

describe('AncillaryComponent', () => {
  let component: AncillaryComponent;
  let fixture: ComponentFixture<AncillaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AncillaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AncillaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
