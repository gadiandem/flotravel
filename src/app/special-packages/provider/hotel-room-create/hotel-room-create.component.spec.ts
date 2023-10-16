import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomCreateComponent } from './hotel-room-create.component';

describe('HotelRoomCreateComponent', () => {
  let component: HotelRoomCreateComponent;
  let fixture: ComponentFixture<HotelRoomCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRoomCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRoomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
