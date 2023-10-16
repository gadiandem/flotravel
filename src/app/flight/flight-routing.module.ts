import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightComponent } from './flight.component';
import { FlightReturnComponent } from './flight-return/flight-return.component';
import { FlightPaymentResultComponent } from './flight-payment-result/flight-payment-result.component';
import { FlightPaymentInfoComponent } from './flight-payment-info/flight-payment-info.component';
import { FlightSummaryComponent } from './flight-summary/flight-summary.component';
import { FlightNextCityComponent } from './flight-next-city/flight-next-city.component';
import { FlightShoppingListComponent } from './flight-list/flight-shopping-list.component';
import { FlightHistoryListComponent } from '../core/components/flight-history-list/flight-history-list.component';
import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { FlightCancelBookingComponent } from './flight-cancel-booking/flight-cancel-booking.component';
import { FlightHoldBookingComponent } from './flight-hold-booking/flight-hold-booking.component';
import { ViewSavedFlightComponent } from './flight-hold-booking/view-saved-flight/view-saved-flight.component';
import { FlightOrderListComponent } from './pages';
import { FlightServicesComponent } from './flight-services/flight-services.component';
import { FlightModifyBookingComponent } from './flight-modify-booking/flight-modify-booking.component';
import { FlightOrderChangeComponent } from './flight-order-change/flight-order-change.component';
import { PartialFlownComponent } from './partial-flown/partial-flown.component';

const routes: Routes = [
  {
    path: '', component: FlightComponent,
    children: [
      { path: '', redirectTo: 'flightList', pathMatch: 'full' },
      { path: 'flight-order', component: FlightOrderListComponent },
      { path: 'flightList', component: FlightShoppingListComponent },
      { path: 'flightReturn', component: FlightReturnComponent },
      { path: 'flightNextCity', component: FlightNextCityComponent },
      { path: 'flightSummary', component: FlightSummaryComponent },
      { path: 'cart', component: FlightPaymentInfoComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'booking-result', component: FlightPaymentResultComponent },
      { path: 'flightDetail/:flightKey', component: FlightDetailComponent },
      { path: 'flightCancelBooking/:bookingId', component: FlightCancelBookingComponent },
      { path: 'hold-booking-result', component: FlightHoldBookingComponent },
      { path: 'hold-booking-result/:bookingId', component: ViewSavedFlightComponent},
      { path: 'flight-services', component: FlightServicesComponent},
      { path: 'flightModifyBooking/:bookingId', component: FlightModifyBookingComponent},
      { path: 'flight-change', component: FlightOrderChangeComponent},
      { path: 'partial-flight-change', component: PartialFlownComponent}
      // { path: 'historyList', component: FlightHistoryListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule { }
