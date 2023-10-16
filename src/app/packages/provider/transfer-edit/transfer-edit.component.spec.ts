import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferEditComponent } from './transfer-edit.component';

describe('TransferEditComponent', () => {
  let component: TransferEditComponent;
  let fixture: ComponentFixture<TransferEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
