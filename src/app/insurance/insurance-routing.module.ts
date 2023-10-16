import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { AvailableCountriesComponent } from './flotravel-insurance-admin/available-countries/available-countries.component';
import { CreateInsuranceProductComponent } from './flotravel-insurance-admin/create-insurance-product/create-insurance-product.component';
import { EditInsuranceProductsComponent } from './flotravel-insurance-admin/edit-insurance-products/edit-insurance-products.component';
import { InsuranceProductsComponent } from './flotravel-insurance-admin/insurance-products/insurance-products.component';
import { InsuranceCartComponent } from './insurance-cart/insurance-cart.component';
import { InsuranceDetailComponent } from './insurance-detail/insurance-detail.component';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsurancePaymentResultComponent } from './insurance-payment-result/insurance-payment-result.component';
import { InsuranceComponent } from './insurance.component';
import { QuoteListComponent } from './quote-list/quote-list.component';


const routes: Routes = [
  {
    path: '', component: InsuranceComponent,
    children: [
      // { path: '', redirectTo: 'quoteList', pathMatch: 'full' },
      { path: '', redirectTo: 'insuranceList', pathMatch: 'full' },
      { path: 'insuranceList', component: InsuranceListComponent },
      { path: 'insuranceDetail/:packageId', component: InsuranceDetailComponent },
      { path: 'quoteList', component: QuoteListComponent },
      { path: 'cart', component: InsuranceCartComponent },
      { path: 'booking-result', component: InsurancePaymentResultComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'admin', component: InsuranceProductsComponent },
      { path: 'admin/:packageId', component: EditInsuranceProductsComponent },
      { path: 'create', component: CreateInsuranceProductComponent },
      { path: 'countries', component: AvailableCountriesComponent },
      //     { path: 'booking_result', component: HotelBookingResultComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
