import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialProviderHeaderComponent } from './special-provider-header.component';

describe('ProviderHeaderComponent', () => {
  let component: SpecialProviderHeaderComponent;
  let fixture: ComponentFixture<SpecialProviderHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialProviderHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialProviderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
