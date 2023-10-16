import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMenuSidebarComponent } from './provider-menu-sidebar.component';

describe('MenuSidebarComponent', () => {
  let component: ProviderMenuSidebarComponent;
  let fixture: ComponentFixture<ProviderMenuSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderMenuSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMenuSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
