import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHistoryListComponent } from './package-history-list.component';

describe('PackageHistoryListComponent', () => {
  let component: PackageHistoryListComponent;
  let fixture: ComponentFixture<PackageHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
