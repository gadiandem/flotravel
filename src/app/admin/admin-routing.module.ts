import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementComponent } from './user-management/user-management.component';
import { AgencyManagementComponent } from './agency-management/agency-management.component';
import { AdminComponent } from './admin.component';
import { UserDetailCreateComponent } from './user-management/user-detail-create/user-detail-create.component';
import { UserDetailEditComponent } from './user-management/user-detail-edit/user-detail-edit.component';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { ProfileSupperAdminComponent } from './profile-supper-admin/profile-supper-admin.component';
import { UserGroupManagementComponent } from './user-group-management/user-group-management.component';
import { UserGroupDetailEditComponent } from './user-group-management/user-group-detail-edit/user-group-detail-edit.component';
import { UserGroupDetailCreateComponent } from './user-group-management/user-group-detail-create/user-group-detail-create.component';
import { AgentDetailCreateComponent } from './agency-management/agent-detail-create/agent-detail-create.component';
import { AgentDetailEditComponent } from './agency-management/agent-detail-edit/agent-detail-edit.component';
import { MerchantComponent } from './merchant/merchant.component';
import { MerchantCreateComponent } from './merchant/merchant-create/merchant-create.component';
import { MerchantEditComponent } from './merchant/merchant-edit/merchant-edit.component';
import { FlotravelLogsListComponent} from './flotravel-logs/flotravel-logs-list/flotravel-logs-list.component';
import { FlotravelLogsDetailComponent } from './flotravel-logs/flotravel-logs-detail/flotravel-logs-detail.component';
import { FlightRuleCreateComponent,
   FlightRuleDetailComponent,
    FlightRuleEditComponent,
    HotelRuleCreateComponent,
    HotelRuleDetailComponent,
    HotelRuleEditComponent,
    ListConfigureComponent } from './combine-service-configure';
import { FlightCreateComponent } from './flight-admin/flight-create/flight-create.component';
import { FlightAdminComponent } from './flight-admin/flight-admin.component';
import { FlightEditComponent } from './flight-admin/flight-edit/flight-edit.component';
import {
  AgentSellingCurrencyCreateComponent
} from './agency-management/agent-detail-edit/selling-currency/agent-selling-currency-create/agent-selling-currency-create.component';
import {
  AgentSellingCurrencyEditComponent
} from './agency-management/agent-detail-edit/selling-currency/agent-selling-currency-edit/agent-selling-currency-edit.component';
import { PartialFlightAdminComponent } from './partial-flight-admin/partial-flight-admin.component';
import { EditPartialFlightAdminComponent } from './partial-flight-admin/edit-partial-flight-admin/edit-partial-flight-admin.component';
import {ReportComponent} from './report/report.component';
const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: UserManagementComponent },
      { path: 'agency', component: AgencyManagementComponent },
      { path: 'userGroup', component: UserGroupManagementComponent },
      { path: 'userGroup/edit/:userGroupId', component: UserGroupDetailEditComponent },
      { path: 'userGroup/create', component: UserGroupDetailCreateComponent },
      { path: 'agency/create', component: AgentDetailCreateComponent },
      { path: 'agency/edit/:agentId', component: AgentDetailEditComponent },
      { path: 'agency/selling-currency/create', component: AgentSellingCurrencyCreateComponent },
      { path: 'agency/selling-currency/edit', component: AgentSellingCurrencyEditComponent },
      { path: 'user/create', component: UserDetailCreateComponent },
      { path: 'user/edit/:userId', component: UserDetailEditComponent },
      { path: 'user/profile/:userId', component: ProfileUserComponent },
      { path: 'super/profile/:userId', component: ProfileSupperAdminComponent },
      { path: 'merchants', component: MerchantComponent },
      { path: 'merchants/create', component: MerchantCreateComponent },
      { path: 'merchants/edit/:merchantId', component: MerchantEditComponent },
      { path: 'flotravelLogs', component: FlotravelLogsListComponent },
      { path: 'flotravelLogs/details/:logId', component: FlotravelLogsDetailComponent },
      { path: 'combine-configure', component: ListConfigureComponent },
      { path: 'combine-configure/hotel/create', component: HotelRuleCreateComponent },
      { path: 'combine-configure/hotel/edit/:ruleId', component: HotelRuleEditComponent },
      { path: 'combine-configure/hotel/detail/:ruleId', component: HotelRuleDetailComponent },
      { path: 'combine-configure/flight/create', component: FlightRuleCreateComponent },
      { path: 'combine-configure/flight/edit/:ruleId', component: FlightRuleEditComponent },
      { path: 'combine-configure/flight/detail/:ruleId', component: FlightRuleDetailComponent },
      { path: 'flight/create', component: FlightCreateComponent },
      { path: 'flight/list', component: FlightAdminComponent },
      { path: 'flight/edit/:flightId', component: FlightEditComponent },
      { path: 'flight/partial-flight', component: PartialFlightAdminComponent },
      { path: 'flight/partial-flight/:flightId', component: EditPartialFlightAdminComponent },
      { path: 'report', component: ReportComponent },
      { path: 'report/:id', component: ReportComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
