import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightComponent } from '../flight/flight.component';

import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { BookingResultComponent } from './pages/booking-result/booking-result.component';
import { CombineBookingComponent } from './combine-booking.component';
import { CombineCartComponent } from './pages/combine-cart/combine-cart.component';
import { CombineFlightListComponent } from './pages/combine-flight-list/combine-flight-list.component';
import { CombineHotelDetailComponent } from './pages/combine-hotel-detail/combine-hotel-detail.component';
import { CombineHotelListComponent } from './pages/combine-hotel-list/combine-hotel-list.component';
import { CombineSummaryComponent } from './pages/combine-summary/combine-summary.component';
import { PackageSummaryComponent } from './pages/package-summary/package-summary.component';
import {CombineNctHotelDetailComponent} from './pages/combine-nct-hotel-detail/combine-nct-hotel-detail.component';

const routes: Routes = [
  {
    path: '', component: CombineBookingComponent,
    children: [
      { path: '', redirectTo: 'hotelList', pathMatch: 'full' },
      { path: 'hotelList', component: CombineHotelListComponent },
      { path: 'packageSummary', component: PackageSummaryComponent },
      { path: 'hotelDetail/:hotelcode', component: CombineHotelDetailComponent },
      // { path: 'nct-hotel/:hotelcode', component: CombineNctHotelDetailComponent },
      { path: 'flightList', component: CombineFlightListComponent },
      { path: 'combineSummary', component: CombineSummaryComponent },
      { path: 'cart', component: CombineCartComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'booking-result', component: BookingResultComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule { }
