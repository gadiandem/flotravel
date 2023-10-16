import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GcaComponent} from './gca.component';
import {GcaListDepartureComponent} from './gca-list-departure/gca-list-departure.component';
import {GcaListArrivalComponent} from './gca-list-arrival/gca-list-arrival.component';
import {GcaSummaryComponent} from './gca-summary/gca-summary.component';
import {GcaPaymentInfoComponent} from './gca-payment-info/gca-payment-info.component';
import { GcaPaymentResultComponent } from './gca-payment-result/gca-payment-result.component';
import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { GcaRedirectComponent } from './gca-redirect/gca-redirect.component';

const routes: Routes = [
  {
    path: '', component: GcaComponent,
    children: [
      { path: '', redirectTo: 'gcaListDeparture', pathMatch: 'full'},
      { path: 'gcaListDeparture', component: GcaListDepartureComponent },
      { path: 'gcaListArrival', component: GcaListArrivalComponent },
      { path: 'gcaSummary', component: GcaSummaryComponent },
      { path: 'cart', component: GcaPaymentInfoComponent},
      { path: 'booking-result', component: GcaPaymentResultComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'redirect', component: GcaRedirectComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GcaRoutingModule { }
