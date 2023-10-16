import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineHotelListComponent } from './combine-hotel-list.component';

describe('CombineHotelListComponent', () => {
  let component: CombineHotelListComponent;
  let fixture: ComponentFixture<CombineHotelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineHotelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineHotelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
