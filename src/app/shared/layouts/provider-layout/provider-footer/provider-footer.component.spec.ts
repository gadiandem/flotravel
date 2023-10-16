import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ProviderFooterComponent} from './provider-footer.component';

describe('AdminFooterComponent', () => {
  let component: ProviderFooterComponent;
  let fixture: ComponentFixture<ProviderFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderFooterComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
