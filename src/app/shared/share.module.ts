import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { CardModule } from 'ngx-card/ngx-card';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxGalleryModule } from 'ngx-gallery';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image'; // <-- include ScrollHooks
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ButtonsModule, DatepickerModule, PopoverModule, TimepickerModule} from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import {NgbDatepickerModule, NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { environment } from '../../environments/environment';
import { NumberLoopPipe } from './pipe/number-loop.pipe';
import { AgencyBookingComponent } from './component/agency-booking/agency-booking.component';
import { AdminThingToDoComponent } from '../extras/admin-feature/admin-thing-to-do.component';
import { OtpUpdateComponent } from './component/otp-update/otp-update.component';
import { PaymentTypeComponent } from './component/payment-type/payment-type.component';
import { PaymentService } from '../service/payment/payment.service';
import { RetryInterceptorService } from './interceptor/retry-interceptor.service';
import { TruncateTextPipe } from './pipe/truncate-text.pipe';
import { FlotravelProviderComponent } from './component/flotravel-provider/flotravel-provider.component';
import { TermsAndConditionsComponent } from './component/terms-and-conditions/terms-and-conditions.component';
import { SplashScreenComponent } from './component/splash-screen/splash-screen.component';
import { UpdateWithdrawStatusComponent } from './component/update-withdraw-status/update-withdraw-status.component';
import { RedirectProcessComponent } from './component/redirect-process/redirect-process.component';
import { RedirectTracemeComponent } from './component/redirect-traceme/redirect-traceme.component';
import { RedirectGcaComponent } from './component/redirect-gca/redirect-gca.component';
import { RedirectPackageComponent } from './component/redirect-package/redirect-package.component';
import { RedirectSpecialPackageComponent } from './component/redirect-special-package/redirect-special-package.component';
import { SettingComponent } from './component/setting/setting.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelect2Module } from 'ng-select2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RoomGuestsComponent } from './component/room-guests/room-guests.component';
import { RoomGuestsFlightComponent } from './component/room-guests-flight/room-guests-flight.component';
import { COMPONENTS } from './component';
import { EmailTemplateComponent } from './component/email-template/email-template.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {DIRECTIVE, VarDirective} from './directive';
import { TagInputModule } from 'ngx-chips';
import { LAYOUT_COMPONENTS } from './layouts';
import { EditFlightProviderComponent } from './component/setting/edit-flight-provider/edit-flight-provider.component';
import { SettingSimulatorComponent } from './component/setting-simulator/setting-simulator.component';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';

// import { UpdateOtpService } from '../service/payment/update-otp.service';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        // minDate: new Date(),
        showWeekNumbers: false,
        orientation: 'bottom left',
  });
}
@NgModule({
  declarations: [
    NumberLoopPipe,
    TruncateTextPipe,
    AgencyBookingComponent,
    AdminThingToDoComponent,
    OtpUpdateComponent,
    PaymentTypeComponent,
    FlotravelProviderComponent,
    TermsAndConditionsComponent,
    SplashScreenComponent,
    UpdateWithdrawStatusComponent,
    RedirectProcessComponent,
    RedirectTracemeComponent,
    RedirectGcaComponent,
    RedirectPackageComponent,
    RedirectSpecialPackageComponent,
    SettingComponent,
    RoomGuestsComponent,
    RoomGuestsFlightComponent,
    EmailTemplateComponent,
    ...LAYOUT_COMPONENTS,
    ...COMPONENTS,
    ...DIRECTIVE,
    VarDirective,
    SettingSimulatorComponent,
    EditFlightProviderComponent
    // ...DIRECTIVE
  ],
  imports: [
    CommonModule,
    CardModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule.forRoot(),
    InputsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    FontAwesomeModule,
    DateInputsModule,
    NgxPaginationModule,
    NgxGalleryModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApi
    }),
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    AngularEditorModule,
    LazyLoadImageModule,
    NgxPageScrollCoreModule,
    NgxPageScrollModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    DatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgSelectModule,
    NgSelect2Module,
    NgxSkeletonLoaderModule,
    NgbModule,
    TagInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxIntlTelInputModule
  ],
  providers: [
    PaymentService,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: RetryInterceptorService,
    //   multi: true
    // },
    CookieService,
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig }
    // UpdateOtpService
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    LazyLoadImageModule,
    CardModule,
    AlertModule,
    InputsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    BsDropdownModule,
    FontAwesomeModule,
    TruncateTextPipe,
    NgxPageScrollCoreModule,
    NgxPageScrollModule,
    NgxSkeletonLoaderModule,
    BsDatepickerModule,
    DateInputsModule,
    ModalModule,
    TypeaheadModule,
    PaginationModule,
    NgxPaginationModule,
    NgxGalleryModule,
    AgmCoreModule,
    AccordionModule,
    AngularEditorModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    TabsModule,
    CollapseModule,
    TranslateModule,
    NumberLoopPipe,
    TagInputModule,
    AdminThingToDoComponent,
    OtpUpdateComponent,
    ButtonsModule,
    PaymentTypeComponent,
    FlotravelProviderComponent,
    TermsAndConditionsComponent,
    SplashScreenComponent,
    RoomGuestsComponent,
    RoomGuestsFlightComponent,
    EmailTemplateComponent,
    NgxIntlTelInputModule,
    ...COMPONENTS,
    ...LAYOUT_COMPONENTS,
    ...DIRECTIVE
  ],
  entryComponents: [
    TermsAndConditionsComponent
  ],
})

export class SharedModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
