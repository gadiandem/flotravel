import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { SharedModule } from '../shared/share.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AgencyManagementComponent } from './agency-management/agency-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminComponent } from './admin.component';
import { UserDetailCreateComponent } from './user-management/user-detail-create/user-detail-create.component';
import { UserDetailEditComponent } from './user-management/user-detail-edit/user-detail-edit.component';
import { ProfileAgentComponent } from './profile-agent/profile-agent.component';
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
import { FlotravelLogsComponent } from './flotravel-logs/flotravel-logs.component';
import { FlotravelLogsListComponent } from './flotravel-logs/flotravel-logs-list/flotravel-logs-list.component';
import { FlotravelLogsDetailComponent } from './flotravel-logs/flotravel-logs-detail/flotravel-logs-detail.component';
import { SettingComponent } from './setting/setting.component';
import { COMPONENTS } from './combine-service-configure';
import { FlightAdminComponent } from './flight-admin/flight-admin.component';
import { FlightCreateComponent } from './flight-admin/flight-create/flight-create.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FlightEditComponent } from './flight-admin/flight-edit/flight-edit.component';
import {AgentSellingCurrencyCreateComponent }
  from './agency-management/agent-detail-edit/selling-currency/agent-selling-currency-create/agent-selling-currency-create.component';
import { AgentSellingCurrencyEditComponent }
  from './agency-management/agent-detail-edit/selling-currency/agent-selling-currency-edit/agent-selling-currency-edit.component';
import { PartialFlightAdminComponent } from './partial-flight-admin/partial-flight-admin.component';
import { EditPartialFlightAdminComponent } from './partial-flight-admin/edit-partial-flight-admin/edit-partial-flight-admin.component';
import { ReportComponent } from './report/report.component';
import {DIALOGS} from './dialogs';

@NgModule({
  declarations: [
    AgencyManagementComponent,
    UserManagementComponent,
    AdminComponent,
    UserDetailCreateComponent,
    UserDetailEditComponent,
    ProfileAgentComponent,
    ProfileUserComponent,
    ProfileSupperAdminComponent,
    UserGroupManagementComponent,
    UserGroupDetailEditComponent,
    UserGroupDetailCreateComponent,
    AgentDetailCreateComponent,
    AgentDetailEditComponent,
    MerchantComponent,
    MerchantCreateComponent,
    MerchantEditComponent,
    FlotravelLogsComponent,
    FlotravelLogsListComponent,
    FlotravelLogsDetailComponent,
    SettingComponent,
    ...COMPONENTS,
    ...DIALOGS,
    FlightAdminComponent,
    FlightCreateComponent,
    FlightEditComponent,
    AgentSellingCurrencyCreateComponent,
    AgentSellingCurrencyEditComponent,
    PartialFlightAdminComponent,
    EditPartialFlightAdminComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
    GridModule,
    TypeaheadModule.forRoot(),
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
  entryComponents: [...DIALOGS]
})
export class AdminModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
