import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCreateComponent } from './hotel-create.component';

describe('HotelCreateComponent', () => {
  let component: HotelCreateComponent;
  let fixture: ComponentFixture<HotelCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
