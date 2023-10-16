import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/share.module';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceDetailComponent } from './insurance-detail/insurance-detail.component';
import { InsuranceCartComponent } from './insurance-cart/insurance-cart.component';
import { InsurancePaymentResultComponent } from './insurance-payment-result/insurance-payment-result.component';
import { InsuranceBookingHistoryListComponent } from '../core/components/insurance-booking-history-list/insurance-booking-history-list.component';
import { InsuranceBookingHistoryDetailComponent } from '../core/components/insurance-booking-history-detail/insurance-booking-history-detail.component';
import { InsuranceRoutingModule } from './insurance-routing.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InsuranceComponent } from './insurance.component';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { InsuranceProductsComponent } from './flotravel-insurance-admin/insurance-products/insurance-products.component';
import { EditInsuranceProductsComponent } from './flotravel-insurance-admin/edit-insurance-products/edit-insurance-products.component';
import { CreateInsuranceProductComponent } from './flotravel-insurance-admin/create-insurance-product/create-insurance-product.component';
import { AvailableCountriesComponent } from './flotravel-insurance-admin/available-countries/available-countries.component';


@NgModule({
  declarations: [
    InsuranceComponent,
    InsuranceListComponent,
    InsuranceDetailComponent,
    InsuranceCartComponent,
    InsurancePaymentResultComponent,
    // InsuranceSearchDialogComponent,
    // InsuranceBookingHistoryListComponent,
    // InsuranceBookingHistoryDetailComponent,
    QuoteListComponent,
    InsuranceProductsComponent,
    EditInsuranceProductsComponent,
    CreateInsuranceProductComponent,
    AvailableCountriesComponent,
    // InsuranceUpdateComponent
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    InsuranceRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule,

  ],
  exports: [],
  providers: [],
})
export class InsuranceModule { }
