import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomGuestsFlightComponent } from './room-guests-flight.component';

describe('RoomGuestsFlightComponent', () => {
  let component: RoomGuestsFlightComponent;
  let fixture: ComponentFixture<RoomGuestsFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomGuestsFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomGuestsFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
