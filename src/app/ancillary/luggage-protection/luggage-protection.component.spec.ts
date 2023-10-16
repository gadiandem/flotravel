import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuggageProtectionComponent } from './luggage-protection.component';

describe('LuggageProtectionComponent', () => {
  let component: LuggageProtectionComponent;
  let fixture: ComponentFixture<LuggageProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuggageProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuggageProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
