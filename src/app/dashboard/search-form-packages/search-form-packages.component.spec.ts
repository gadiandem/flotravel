import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormPackagesComponent } from './search-form-packages.component';

describe('SearchFormPackagesComponent', () => {
  let component: SearchFormPackagesComponent;
  let fixture: ComponentFixture<SearchFormPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFormPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
