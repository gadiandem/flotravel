import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormGcaComponent } from './search-form-gca.component';

describe('SearchFormGcaComponent', () => {
  let component: SearchFormGcaComponent;
  let fixture: ComponentFixture<SearchFormGcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFormGcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormGcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
