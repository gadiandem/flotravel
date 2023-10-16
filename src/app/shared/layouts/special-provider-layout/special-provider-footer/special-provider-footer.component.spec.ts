import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {SpecialProviderFooterComponent} from './special-provider-footer.component';

describe('AdminFooterComponent', () => {
  let component: SpecialProviderFooterComponent;
  let fixture: ComponentFixture<SpecialProviderFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialProviderFooterComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialProviderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
