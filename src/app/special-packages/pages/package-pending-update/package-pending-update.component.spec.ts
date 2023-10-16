import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePendingUpdateComponent } from './package-pending-update.component';

describe('PackagePendingUpdateComponent', () => {
  let component: PackagePendingUpdateComponent;
  let fixture: ComponentFixture<PackagePendingUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagePendingUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagePendingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
