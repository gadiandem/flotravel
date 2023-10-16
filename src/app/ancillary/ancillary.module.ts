import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/share.module';
import { AncillaryRoutingModule } from './ancillary-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';

import { AirportLoungeComponent } from './airport-lounge/airport-lounge.component';
import { LuggageProtectionComponent } from './luggage-protection/luggage-protection.component';
import { RefundProtectComponent } from './refund-protect/refund-protect.component';
import { TravelInsuranceComponent } from './travel-insurance/travel-insurance.component';
import { AncillaryComponent } from './ancillary.component';
import { FaqComponent } from './faq/faq.component';


@NgModule({
  declarations: [
    AncillaryComponent,
    AirportLoungeComponent,
    LuggageProtectionComponent,
    RefundProtectComponent,
    TravelInsuranceComponent,
    FaqComponent
    ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    SharedModule,
    AncillaryRoutingModule,
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
export class AncillaryModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}