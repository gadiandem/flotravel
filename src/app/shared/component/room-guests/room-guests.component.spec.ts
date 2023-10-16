import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomGuestsComponent } from './room-guests.component';

describe('RoomGuestsComponent', () => {
  let component: RoomGuestsComponent;
  let fixture: ComponentFixture<RoomGuestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomGuestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
