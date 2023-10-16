import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineSearchBoxComponent } from './combine-search-box.component';

describe('CombineSearchBoxComponent', () => {
  let component: CombineSearchBoxComponent;
  let fixture: ComponentFixture<CombineSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineSearchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
