import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/share.module';
import { SearchFormFlightComponent } from './search-form-flight/search-form-flight.component';
import { SearchFormHotelComponent } from './search-form-hotel/search-form-hotel.component';
import { SearchFormInsuranceComponent } from './search-form-insurance/search-form-insurance.component';
import { SearchFormThingToDoComponent } from './search-form-thing-to-do/search-form-thing-to-do.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SearchFormTracemeComponent } from './search-form-traceme/search-form-traceme.component';
import { SearchFormPackagesComponent } from './search-form-packages/search-form-packages.component';
import { SearchFormSpecialPackagesComponent } from './search-form-special-packages/search-form-special-packages.component';
import { SearchFormGcaComponent } from './search-form-gca/search-form-gca.component';
import { SearchFormHepstarComponent } from './search-form-hepstar/search-form-hepstar.component';
import { SearchFormCombineBookingComponent } from './search-form-combine-booking/search-form-combine-booking.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { FlightOneStepReturnComponent } from './flight-one-step-return/flight-one-step-return.component';
import { SearchFormReshopComponent } from './search-form-reshop/search-form-reshop.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchFormHotelComponent,
    SearchFormFlightComponent,
    SearchFormThingToDoComponent,
    SearchFormInsuranceComponent,
    SearchFormTracemeComponent,
    SearchFormPackagesComponent,
    SearchFormSpecialPackagesComponent,
    SearchFormGcaComponent,
    SearchFormHepstarComponent,
    SearchFormCombineBookingComponent,
    FlightOneStepReturnComponent,
    SearchFormReshopComponent
    ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    SharedModule,
    DashboardRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [  ]
})
export class DashboardModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
