import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/share.module";
import { AdminThingToDoModuleRouting } from "./admin-thing-to-do-routing.module";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';

import { InsertTourComponent } from "./insert-tour/insert-tour.component";
import { ListItemComponent } from "./list-item/list-item.component";
import { ScheduleDetailComponent } from "./schedule-detail/schedule-detail.component";
import { ScheduleListComponent } from "./schedule-list/schedule-list.component";
import { ExtraPackageAvailabilityComponent } from './extra-package-availability/extra-package-availability.component';
import { ExtraDetailAvailabilityComponent } from './extra-detail-availability/extra-detail-availability.component';

@NgModule({
    declarations: [    
        // AdminThingToDoComponent,
        InsertTourComponent,
        ListItemComponent,
        ScheduleListComponent,
        ScheduleDetailComponent,
        ExtraPackageAvailabilityComponent,
        ExtraDetailAvailabilityComponent],
    imports: [  
        CommonModule,
        // ReactiveFormsModule,
        AdminThingToDoModuleRouting,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: httpTranslateLoader,
              deps: [HttpClient]
            }
          }),
    ],
    exports: [
        // AdminThingToDoComponent
    ]
})
export class AdminThingToDoModule {}
export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }
  