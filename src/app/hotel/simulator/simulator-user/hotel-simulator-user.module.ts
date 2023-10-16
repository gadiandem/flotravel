import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from 'src/app/shared/share.module';
import { HotelSimulatorUserRoutingModule } from './hotel-simulator-user-routing.module';
import { HotelModule } from '../../hotel.module';
import { COMPONENTS } from './components';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HotelSummarySimulatorComponent } from './hotel-summary-simulator/hotel-summary-simulator.component';
import { HotelSimulatorUserComponent } from './hotel-simulator-user.component';
import { HotelListSimulatorComponent } from './hotel-list-simulator/hotel-list-simulator.component';
import { HotelCartSimulatorComponent } from './hotel-cart-simulator/hotel-cart-simulator.component';import { HotelResultSimulatorComponent } from './hotel-result-simulator/hotel-result-simulator.component';
import { HotelSearchSimulatorBoxComponent } from './components/hotel-search-box/hotel-search-box.component';

@NgModule({
  declarations: [
    ...COMPONENTS,
    HotelSummarySimulatorComponent,
    HotelSimulatorUserComponent,
    HotelListSimulatorComponent,
    HotelCartSimulatorComponent,
    HotelResultSimulatorComponent,
    HotelSearchSimulatorBoxComponent

  ],
  imports: [
    CommonModule,
    TagInputModule,
    FormsModule,
    HotelSimulatorUserRoutingModule,
    SharedModule,
    HotelModule,
    NgxIntlTelInputModule,
 
  ],
  exports: [],
  providers: [],
})
export class HotelSimulatorUserModule { }
