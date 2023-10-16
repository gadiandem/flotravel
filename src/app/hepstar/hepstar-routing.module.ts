import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { BookingResultComponent } from './booking-result/booking-result.component';
import { HepstarComponent } from './hepstar.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { ProductListComponent } from './product-list/product-list.component';



const routes: Routes = [
  {
    path: '', component: HepstarComponent,
    children: [
      // { path: '', redirectTo: 'quoteList', pathMatch: 'full' },
      { path: '', redirectTo: 'productList', pathMatch: 'full' },
      { path: 'productList', component: ProductListComponent },
      { path: 'payment-info', component: PaymentInfoComponent },
      { path: 'booking-result', component: BookingResultComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      //     { path: 'booking_result', component: HotelBookingResultComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HepstarRoutingModule { }
