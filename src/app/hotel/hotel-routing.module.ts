import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotelListComponent } from './pages/hotel-list/hotel-list.component';
import { HotelDetailComponent } from './pages/hotel-detail/hotel-detail.component';
import { HotelCartComponent } from './pages/hotel-cart/hotel-cart.component';
import { HotelBookingResultComponent } from './pages/hotel-booking-result/hotel-booking-result.component';
import { HotelComponent } from './hotel.component';
import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { HotelSummaryComponent } from './pages/hotel-summary/hotel-summary.component';
import { HotelCancelBookingComponent } from './pages/hotel-cancel-booking/hotel-cancel-booking.component';

const routes: Routes = [
  {
    path: '', component: HotelComponent,
    children: [
      { path: '', redirectTo: 'hotelList', pathMatch: 'full'},
      { path: 'hotelList', component: HotelListComponent },
      { path: 'hotelDetail/:hotelcode', component: HotelDetailComponent },
      { path: 'hotelSummary', component: HotelSummaryComponent},
      { path: 'cart', component: HotelCartComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'booking-result', component: HotelBookingResultComponent },
      { path: 'hotelCancelBooking/:orderId', component: HotelCancelBookingComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
