import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomEditComponent } from './hotel-room-edit.component';

describe('HotelRoomEditComponent', () => {
  let component: HotelRoomEditComponent;
  let fixture: ComponentFixture<HotelRoomEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRoomEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRoomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
