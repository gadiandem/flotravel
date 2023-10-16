import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirportLoungeComponent } from './airport-lounge/airport-lounge.component';
import { AncillaryComponent } from './ancillary.component';
import { LuggageProtectionComponent } from './luggage-protection/luggage-protection.component';
import { RefundProtectComponent } from './refund-protect/refund-protect.component';
import { TravelInsuranceComponent } from './travel-insurance/travel-insurance.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  {
    path: '', component: AncillaryComponent,
    children: [
      { path: '', redirectTo: 'ancillary', pathMatch: 'full' },
      { path: 'lounge', component: AirportLoungeComponent },
      { path: 'luggageProtection', component: LuggageProtectionComponent },
      { path: 'refundProtect', component: RefundProtectComponent },
      { path: 'travelInsurance', component: TravelInsuranceComponent },
      { path: 'faq', component: FaqComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AncillaryRoutingModule { }
