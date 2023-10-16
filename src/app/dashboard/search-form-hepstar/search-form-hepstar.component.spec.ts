import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormHepstarComponent } from './search-form-hepstar.component';

describe('SearchFormHepstarComponent', () => {
  let component: SearchFormHepstarComponent;
  let fixture: ComponentFixture<SearchFormHepstarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFormHepstarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormHepstarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
