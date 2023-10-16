import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThingToDoComponent } from './thing-to-do.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { TourCartComponent } from './tour-cart/tour-cart.component';
import { TourBookingResultComponent } from './tour-booking-result/tour-booking-result.component';
import { TourListComponent } from './extras-package-list/tour-list.component';
import { InsertTourComponent } from './admin-feature/insert-tour/insert-tour.component';
import { ListItemComponent } from './admin-feature/list-item/list-item.component';
import { TourHistoryComponent } from '../core/components/tour-history/tour-history.component';
import { TourHistoryDetailComponent } from '../core/components/tour-history-detail/tour-history-detail.component';
import { ScheduleListComponent } from './admin-feature/schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from './admin-feature/schedule-detail/schedule-detail.component';
import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';

const routes: Routes = [
  {
    path: '', component: ThingToDoComponent,
    children: [
      { path: '', redirectTo: 'tourList', pathMatch: 'full'},
      { path: 'tourList', component: TourListComponent, },
      // { path: 'list-item', component: ListItemComponent },
      // { path: 'insert/:tourId', component: InsertTourComponent },
      // { path: 'insert', component: InsertTourComponent },
      { path: 'detail/:tourId', component: TourDetailComponent },
      { path: 'cart', component: TourCartComponent },
      { path: 'booking-result', component: TourBookingResultComponent },
      { path: 'updateOtp', component: OtpUpdateComponent },
      // { path: 'scheduleList', component: ScheduleListComponent },
      // { path: 'schedule/:scheduleId', component: ScheduleDetailComponent },
      { path: 'admin', loadChildren: () => import('./admin-feature/admin-thing-to-do.module').then(m => m.AdminThingToDoModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThingToDoRoutingModule { }
