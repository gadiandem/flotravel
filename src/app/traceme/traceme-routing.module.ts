import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { TracemeCartComponent } from './traceme-cart/traceme-cart.component';
import { TracemeListComponent } from './traceme-list/traceme-list.component';
import { TracemePaymentResultComponent } from './traceme-payment-result/traceme-payment-result.component';
import { TracemeRedirectComponent } from './traceme-redirect/traceme-redirect.component';
import { TracemeComponent } from './traceme.component';

const routes: Routes = [
  {
    path: '', component: TracemeComponent,
    children: [
      { path: '', redirectTo: 'tracemeList', pathMatch: 'full'},
      { path: 'tracemeList', component: TracemeListComponent },
      { path: 'cart', component: TracemeCartComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'booking-result', component: TracemePaymentResultComponent },
      { path: 'redirect', component: TracemeRedirectComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracemeRoutingModule { }
