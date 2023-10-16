import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/share.module';
import { ThingToDoComponent } from './thing-to-do.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { TourCartComponent } from './tour-cart/tour-cart.component';
import { TourBookingResultComponent } from './tour-booking-result/tour-booking-result.component';
import { ThingToDoRoutingModule } from './thing-to-do-routing.module';
import { TourListComponent } from './extras-package-list/tour-list.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { InsertTourComponent } from './admin-feature/insert-tour/insert-tour.component';
import { ListItemComponent } from './admin-feature/list-item/list-item.component';
import { ScheduleListComponent } from './admin-feature/schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from './admin-feature/schedule-detail/schedule-detail.component';

@NgModule({
  declarations: [
    ThingToDoComponent,
    TourListComponent,
    TourDetailComponent,
    TourCartComponent,
    TourBookingResultComponent,
    // InsertTourComponent,
    // ListItemComponent,
    // ScheduleListComponent,
    // ScheduleDetailComponent
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    ThingToDoRoutingModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [],
  providers: [],
})
export class ThingToDoModule { }
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
