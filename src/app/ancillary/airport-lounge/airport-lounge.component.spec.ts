import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportLoungeComponent } from './airport-lounge.component';

describe('AirportLoungeComponent', () => {
  let component: AirportLoungeComponent;
  let fixture: ComponentFixture<AirportLoungeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportLoungeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportLoungeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
