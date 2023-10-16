import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementCreateComponent } from './supplement-create.component';

describe('SupplementCreateComponent', () => {
  let component: SupplementCreateComponent;
  let fixture: ComponentFixture<SupplementCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
