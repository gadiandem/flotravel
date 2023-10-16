import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  DatePipe,
  DecimalPipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import {
  GridModule,
  ExcelModule,
  PDFModule,
} from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';import { SharedModule } from './shared/share.module';
import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { FlightListEffects } from './flight/store/flight-list.effects';
import { HotelEffects } from './hotel/store/hotel.effects';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ThingToDoEffects } from './extras/store/thing-to-do.effects';
import { URLNavigatorGuard } from './core/guard/url-navigator.guard';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { InsuranceEffects } from './insurance/store/insurance.effects';
import { TracemeEffects } from './traceme/store/traceme.effects';
import { PackagesEffects } from './packages/store/packages.effects';
import { WalletEffects } from './wallet/store/wallet.effects';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './service/customer-date-parser-formatter.service';
import { CustomAdapter } from './service/customer-adapter.service';
import { ProviderPackagesEffects } from './packages/provider/store/provider-packages.effects';
import { SpecialPackagesEffects } from './special-packages/store/special-packages.effects';
import { ProviderSpecialPackagesEffects } from './special-packages/provider/store/provider-special-packages.effects';import { GcaEffects } from './gca/store/gca.effects';
import { HepstarEffects } from './hepstar/store/hepstar.effects';
import { AuthInterceptor } from './auth.interceptor';
import { DIALOGS } from './core/dialogs';
import {RetryInterceptorService} from './shared/interceptor/retry-interceptor.service';
import { COMPONENTS } from './core/components';
import { SessionService } from './service/session.expire';
import { DestinationTypeheadSearchComponent } from './core/components/destination-typehead-search/destination-typehead-search.component';
// import {CoreModule} from './core/core.module';

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS,
    ...DIALOGS,
    DestinationTypeheadSearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    //CoreModule,
    NgxSkeletonLoaderModule,
    BrowserAnimationsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    ButtonsModule,
    DropDownsModule,
    DialogsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([
      AuthEffects,
      FlightListEffects,
      HotelEffects,
      ThingToDoEffects,
      InsuranceEffects,
      TracemeEffects,
      PackagesEffects,
      SpecialPackagesEffects,
      ProviderSpecialPackagesEffects,
      WalletEffects,
      ProviderPackagesEffects,
      GcaEffects,
      HepstarEffects,
    ]),
    // EffectsModule.forFeature([AuthEffects]),
    BsDropdownModule.forRoot(),
    ExcelExportModule,
  ],
  providers: [
    SessionService,
    DatePipe,
    DecimalPipe,
    URLNavigatorGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryInterceptorService,
      multi: true
    },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ...DIALOGS
  ],
})
export class AppModule {}
