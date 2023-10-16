import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineNctHotelDetailComponent } from './combine-nct-hotel-detail.component';

describe('CombineNctHotelDetailComponent', () => {
  let component: CombineNctHotelDetailComponent;
  let fixture: ComponentFixture<CombineNctHotelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineNctHotelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineNctHotelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
