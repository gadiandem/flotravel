import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/share.module';
import { HepstarRoutingModule } from './hepstar-routing.module';
import { HepstarComponent } from './hepstar.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { BookingResultComponent } from './booking-result/booking-result.component';
import { ProductListComponent } from './product-list/product-list.component';



@NgModule({
  declarations: [
    HepstarComponent,
    ProductListComponent,
    PaymentInfoComponent,
    BookingResultComponent
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    HepstarRoutingModule,
    SharedModule,
  ],
  exports: [],
  providers: [],
})
export class HepstarModule { }
