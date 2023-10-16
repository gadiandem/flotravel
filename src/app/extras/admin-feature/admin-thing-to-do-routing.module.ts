import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminThingToDoComponent } from "./admin-thing-to-do.component";
import { ExtraDetailAvailabilityComponent } from "./extra-detail-availability/extra-detail-availability.component";
import { ExtraPackageAvailabilityComponent } from "./extra-package-availability/extra-package-availability.component";
import { InsertTourComponent } from "./insert-tour/insert-tour.component";
import { ListItemComponent } from "./list-item/list-item.component";
import { ScheduleDetailComponent } from "./schedule-detail/schedule-detail.component";
import { ScheduleListComponent } from "./schedule-list/schedule-list.component";

const routes: Routes = [
  {
    path: "",
    component: AdminThingToDoComponent,
    children: [
      { path: "", redirectTo: "list-item", pathMatch: "full" },
      { path: "list-item", component: ListItemComponent },
      { path: "insert", component: InsertTourComponent },
      { path: "scheduleList/:tourId", component: ScheduleListComponent },
      { path: "schedule", component: ScheduleDetailComponent },
      { path: "schedule/:scheduleId", component: ScheduleDetailComponent },
      { path: "insert/:tourId", component: InsertTourComponent },
      { path: "extraPackageAvailability/:extraPackageId", component: ExtraPackageAvailabilityComponent },
      { path: "extraDetailAvailability/:extraDetailId", component: ExtraDetailAvailabilityComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminThingToDoModuleRouting {}
