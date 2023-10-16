import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';

import { HotelRoutingModule } from './hotel-routing.module';
import { SharedModule } from '../shared/share.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { COMPONENTS, HotelSelectSummaryComponent } from './components';
import { PAGES } from './pages';
import { DIALOGS } from './dialogs';
import { HotelSimulatorDetailsComponent } from './pages/hotel-detail/hotel-simulator-detail/hotel-detail-simulator.component';

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PAGES,
    ...DIALOGS,
    HotelSimulatorDetailsComponent,
    HotelSelectSummaryComponent,

  ],
    imports: [
        CommonModule,
        // ReactiveFormsModule,
        HotelRoutingModule,
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
  exports: [...COMPONENTS, ...PAGES, ],
  providers: [],
})
export class HotelModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
