import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotravelProviderComponent } from './flotravel-provider.component';

describe('FlotravelProviderComponent', () => {
  let component: FlotravelProviderComponent;
  let fixture: ComponentFixture<FlotravelProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlotravelProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotravelProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
