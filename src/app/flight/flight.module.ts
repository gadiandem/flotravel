import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightRoutingModule } from './flight-routing.module';
import { FlightComponent } from './flight.component';
import { SharedModule } from '../shared/share.module';
import { FlightReturnComponent } from './flight-return/flight-return.component';
import { FlightPaymentResultComponent } from './flight-payment-result/flight-payment-result.component';
import { FlightPaymentInfoComponent } from './flight-payment-info/flight-payment-info.component';
import { FlightSummaryComponent } from './flight-summary/flight-summary.component';
import { FlightNextCityComponent } from './flight-next-city/flight-next-city.component';
import { FlightShoppingListComponent } from './flight-list/flight-shopping-list.component';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from "ng-select2";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { FlightCancelBookingComponent } from './flight-cancel-booking/flight-cancel-booking.component';
import { COMPONENTS } from './components';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TagInputModule } from 'ngx-chips';
import { FlightHoldBookingComponent } from './flight-hold-booking/flight-hold-booking.component';
import { ViewSavedFlightComponent } from './flight-hold-booking/view-saved-flight/view-saved-flight.component';
import { PAGES } from './pages';
import { FlightServicesComponent } from './flight-services/flight-services.component';
import { FlightModifyBookingComponent } from './flight-modify-booking/flight-modify-booking.component';
import { FlightOrderChangeComponent } from './flight-order-change/flight-order-change.component';
import { PartialFlownComponent } from './partial-flown/partial-flown.component';



@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PAGES,
    FlightComponent,
    FlightShoppingListComponent,
    FlightReturnComponent,
    FlightSummaryComponent,
    FlightPaymentResultComponent,
    FlightPaymentInfoComponent,
    FlightNextCityComponent,
    FlightDetailComponent,
    FlightCancelBookingComponent,
    FlightHoldBookingComponent,
    ViewSavedFlightComponent,
    FlightServicesComponent,
    FlightModifyBookingComponent,
    FlightOrderChangeComponent,
    PartialFlownComponent,
  ],
  imports: [
    CommonModule,
    FlightRoutingModule,
    SharedModule,
    NgSelect2Module,
    NgxSkeletonLoaderModule,
    NgxIntlTelInputModule,
    TagInputModule,
    FormsModule,
    // OneStepReturnModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    // CollapseModule.forRoot()
  ],
  exports: [
    ...COMPONENTS,
    FlightComponent,
    FlightShoppingListComponent,
    FlightReturnComponent,
    FlightSummaryComponent,
    FlightPaymentResultComponent,
    FlightPaymentInfoComponent,
    FlightNextCityComponent,
    FlightDetailComponent,
    FlightCancelBookingComponent,
    FlightHoldBookingComponent,
    ViewSavedFlightComponent
  ]
})
export class FlightModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
