import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchFormFlightComponent } from './search-form-flight/search-form-flight.component';
import { SearchFormHotelComponent } from './search-form-hotel/search-form-hotel.component';
import { SearchFormInsuranceComponent } from './search-form-insurance/search-form-insurance.component';
import { SearchFormThingToDoComponent } from './search-form-thing-to-do/search-form-thing-to-do.component';
import { DashboardComponent } from './dashboard.component';
import { SearchFormTracemeComponent } from './search-form-traceme/search-form-traceme.component';
import { SearchFormPackagesComponent } from './search-form-packages/search-form-packages.component';
import { SearchFormSpecialPackagesComponent } from './search-form-special-packages/search-form-special-packages.component';
import {SearchFormGcaComponent} from './search-form-gca/search-form-gca.component';
import { SearchFormHepstarComponent } from './search-form-hepstar/search-form-hepstar.component';
import { SearchFormCombineBookingComponent } from './search-form-combine-booking/search-form-combine-booking.component';
import {FlightOneStepReturnComponent} from './flight-one-step-return/flight-one-step-return.component';
import { SearchFormReshopComponent } from './search-form-reshop/search-form-reshop.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'hotel', pathMatch: 'full' },
      { path: 'hotel', component: SearchFormHotelComponent },
      { path: 'flight-reshop', component: SearchFormReshopComponent },
      { path: 'flight', component: SearchFormFlightComponent },
      { path: 'one-step-return', component: FlightOneStepReturnComponent },
      { path: 'combine', component: SearchFormCombineBookingComponent },
      { path: 'extras', component: SearchFormThingToDoComponent },
      { path: 'insurance', component: SearchFormInsuranceComponent },
      { path: 'traceme', component: SearchFormTracemeComponent },
      { path: 'gca', component: SearchFormGcaComponent },
      { path: 'packages', component: SearchFormPackagesComponent },
      { path: 'specialPackages', component: SearchFormSpecialPackagesComponent },
      { path: 'hepstar', component: SearchFormHepstarComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
