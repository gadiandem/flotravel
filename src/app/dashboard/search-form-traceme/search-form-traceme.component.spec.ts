import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormTracemeComponent } from './search-form-traceme.component';

describe('SearchFormTracemeComponent', () => {
  let component: SearchFormTracemeComponent;
  let fixture: ComponentFixture<SearchFormTracemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFormTracemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormTracemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
