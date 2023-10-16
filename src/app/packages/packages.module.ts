import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/share.module';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages.component';
import { PackageShoppingComponent } from './pages/package-shopping/package-shopping.component';
import { PackageHotelComponent } from './pages/package-hotel/package-hotel.component';
import { PackageSummaryComponent } from './pages/package-summary/package-summary.component';
import { PackagePaymentFormComponent } from './pages/package-payment-form/package-payment-form.component';
import { PackagePaymentResultComponent } from './pages/package-payment-result/package-payment-result.component';
import { PackageOptionalComponent } from './pages/package-optional/package-optional.component';
import { PackageShoppingImageComponent } from './pages/package-shopping-image/package-shopping-image.component';
import { PackageRedirectComponent } from './pages/package-redirect/package-redirect.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { PackageCancelBookingComponent } from './pages/package-cancel-booking/package-cancel-booking.component';
import { COMPONENTS } from './components';
import { PAGES } from './pages';
// import { PackagePendingUpdateComponent } from './package-pending-update/package-pending-update.component';

@NgModule({
  declarations: [
    PackagesComponent,
    ...COMPONENTS,
    ...PAGES,
  ],
    imports: [
        CommonModule,
        // ReactiveFormsModule,
        PackagesRoutingModule,
        SharedModule,
        NgxSkeletonLoaderModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: httpTranslateLoader,
            deps: [HttpClient]
          }
        }),
    ],
  exports: [...COMPONENTS,...PAGES, PackageHotelComponent],
  providers: [],
})
export class PackagesModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
