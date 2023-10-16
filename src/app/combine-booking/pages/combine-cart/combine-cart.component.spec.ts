import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineCartComponent } from './combine-cart.component';

describe('CombineCartComponent', () => {
  let component: CombineCartComponent;
  let fixture: ComponentFixture<CombineCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
