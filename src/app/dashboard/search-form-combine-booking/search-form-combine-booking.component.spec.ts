import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormCombineBookingComponent } from './search-form-combine-booking.component';

describe('SearchFormCombineBookingComponent', () => {
  let component: SearchFormCombineBookingComponent;
  let fixture: ComponentFixture<SearchFormCombineBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFormCombineBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormCombineBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
