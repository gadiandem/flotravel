import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineHotelDetailComponent } from './combine-hotel-detail.component';

describe('CombineHotelDetailComponent', () => {
  let component: CombineHotelDetailComponent;
  let fixture: ComponentFixture<CombineHotelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineHotelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineHotelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
