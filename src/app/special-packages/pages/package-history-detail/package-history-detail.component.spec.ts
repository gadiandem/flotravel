import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHistoryDetailComponent } from './package-history-detail.component';

describe('PackageHistoryDetailComponent', () => {
  let component: PackageHistoryDetailComponent;
  let fixture: ComponentFixture<PackageHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
