import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';

import { TracemeRoutingModule } from './traceme-routing.module';
import { TracemeComponent } from './traceme.component';
import { TracemeListComponent } from './traceme-list/traceme-list.component';
import { SharedModule } from '../shared/share.module';
import { TracemeCartComponent } from './traceme-cart/traceme-cart.component';
import { TracemePaymentResultComponent } from './traceme-payment-result/traceme-payment-result.component';
import { TracemeRedirectComponent } from './traceme-redirect/traceme-redirect.component';
import { COMPONENTS } from './components';
// import { TracemeHisotoryListComponent } from './traceme-hisotory-list/traceme-hisotory-list.component';
// import { TracemeHistoryDetailComponent } from './traceme-history-detail/traceme-history-detail.component';


@NgModule({
  declarations: [
    TracemeComponent,
    TracemeListComponent,
    TracemeCartComponent,
    TracemePaymentResultComponent,
    TracemeRedirectComponent,
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule,
    TracemeRoutingModule
  ],
  exports: [...COMPONENTS],
  providers: [],
})
export class TraceMeModule { }
