import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
import { PackageHotelComponent } from './pages/package-hotel/package-hotel.component';
import { PackageOptionalComponent } from './pages/package-optional/package-optional.component';
import { PackagePaymentFormComponent } from './pages/package-payment-form/package-payment-form.component';
import { PackagePaymentResultComponent } from './pages/package-payment-result/package-payment-result.component';
import { PackageShoppingComponent } from './pages/package-shopping/package-shopping.component';
import { PackageSummaryComponent } from './pages/package-summary/package-summary.component';
import { SpecialPackageRedirectComponent } from './pages/special-package-redirect/special-package-redirect.component';
import { SpecialPackagesComponent } from './special-packages.component';

const routes: Routes = [
  {
    path: '', component: SpecialPackagesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full'},
      { path: 'list', component: PackageShoppingComponent },
      { path: 'hotelRoom', component: PackageHotelComponent },
      { path: 'optional', component: PackageOptionalComponent },
      { path: 'summary', component: PackageSummaryComponent },
      { path: 'cart', component: PackagePaymentFormComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      { path: 'booking-result', component: PackagePaymentResultComponent },
      { path: 'redirect', component: SpecialPackageRedirectComponent },
      // { path: 'packagesProvider', loadChildren: () => import('./provider/packages-provider.module').then(m => m.PackagesProviderModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialPackagesRoutingModule { }
