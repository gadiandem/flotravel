import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialProviderMenuSidebarComponent } from './special-provider-menu-sidebar.component';

describe('MenuSidebarComponent', () => {
  let component: SpecialProviderMenuSidebarComponent;
  let fixture: ComponentFixture<SpecialProviderMenuSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialProviderMenuSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialProviderMenuSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
