import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GcaComponent } from './gca.component';
import { GcaPaymentResultComponent } from './gca-payment-result/gca-payment-result.component';
import {SharedModule} from '../shared/share.module';
import {GcaRoutingModule} from './gca-routing.module';
import { GcaListDepartureComponent } from './gca-list-departure/gca-list-departure.component';
import { GcaListArrivalComponent } from './gca-list-arrival/gca-list-arrival.component';
import { GcaSidebarComponent } from './gca-sidebar/gca-sidebar.component';
import { GcaSummaryComponent } from './gca-summary/gca-summary.component';
import { GcaPaymentInfoComponent } from './gca-payment-info/gca-payment-info.component';
import {DatepickerModule, PopoverModule, TimepickerModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import { GcaRedirectComponent } from './gca-redirect/gca-redirect.component';


@NgModule({
  declarations: [
    GcaComponent,
    GcaPaymentResultComponent,
    GcaListDepartureComponent,
    GcaListArrivalComponent,
    GcaSidebarComponent,
    GcaSummaryComponent,
    GcaPaymentInfoComponent,
    GcaRedirectComponent
  ],
  imports: [
    CommonModule,
    GcaRoutingModule,
    SharedModule,
    TimepickerModule,
    PopoverModule,
    DatepickerModule,
    FormsModule
  ]
})
export class GcaModule { }
