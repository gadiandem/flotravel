import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightRoutingModule } from './comebine-routing.module';
import { SharedModule } from '../shared/share.module';
import { FlightModule } from '../flight/flight.module';
import { HotelModule } from '../hotel/hotel.module';
import { CombineCartComponent } from './pages/combine-cart/combine-cart.component';
import { BookingResultComponent } from './pages/booking-result/booking-result.component';
import { CombineHotelListComponent } from './pages/combine-hotel-list/combine-hotel-list.component';
import { CombineHotelDetailComponent } from './pages/combine-hotel-detail/combine-hotel-detail.component';
import { CombineFlightListComponent } from './pages/combine-flight-list/combine-flight-list.component';
import { CombineSummaryComponent } from './pages/combine-summary/combine-summary.component';
import { CombineBookingComponent } from './combine-booking.component';
import { PackageSummaryComponent } from './pages/package-summary/package-summary.component';
import { COMPONENTS } from './components';
import { CombineNctHotelDetailComponent } from './pages/combine-nct-hotel-detail/combine-nct-hotel-detail.component';
import {PackagesModule} from '../packages/packages.module';

@NgModule({
  declarations: [
    CombineCartComponent,
    BookingResultComponent,
    CombineHotelListComponent,
    CombineHotelDetailComponent,
    CombineFlightListComponent,
    CombineSummaryComponent,
    CombineBookingComponent,
    PackageSummaryComponent,
    ...COMPONENTS,
    CombineNctHotelDetailComponent,
  ],
  imports: [
    CommonModule,
    FlightRoutingModule,
    SharedModule,
    FlightModule,
    HotelModule,
    PackagesModule
  ],
})
export class CombineBookingModule {}
