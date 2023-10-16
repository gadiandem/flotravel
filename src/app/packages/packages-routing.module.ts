import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { PackageHotelComponent } from './pages/package-hotel/package-hotel.component';
// import { PackageOptionalComponent } from './package-optional/package-optional.component';
import { PackagePaymentFormComponent } from './pages/package-payment-form/package-payment-form.component';
import { PackagePaymentResultComponent } from './pages/package-payment-result/package-payment-result.component';
import { PackageRedirectComponent } from './pages/package-redirect/package-redirect.component';
import { PackageShoppingComponent } from './pages/package-shopping/package-shopping.component';
import { PackageSummaryComponent } from './pages/package-summary/package-summary.component';
import { PackagesComponent } from './packages.component';
import { PackageShoppingImageComponent } from './pages/package-shopping-image/package-shopping-image.component';
import { PackageCancelBookingComponent } from './pages/package-cancel-booking/package-cancel-booking.component';

const routes: Routes = [
  {
    path: '', component: PackagesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full'},
      { path: 'list', component: PackageShoppingComponent },
      { path: 'listForImage', component: PackageShoppingImageComponent },
      { path: 'hotelRoom', component: PackageHotelComponent },
      // { path: 'optional', component: PackageOptionalComponent },
      { path: 'summary', component: PackageSummaryComponent },
      { path: 'cart', component: PackagePaymentFormComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'booking-result', component: PackagePaymentResultComponent },
      { path: 'redirect', component: PackageRedirectComponent },
      { path: 'packageCancelBooking/:orderId', component: PackageCancelBookingComponent }
      // { path: 'packagesProvider', loadChildren: () => import('./provider/packages-provider.module').then(m => m.PackagesProviderModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule { }
