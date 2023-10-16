import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { HotelSimulatorAdminRoutingModule } from './hotel-simulator-admin-routing.module';
import { SharedModule } from 'src/app/shared/share.module';
import { HotelInfoSimulatorComponent } from './hotel-info-simulator/hotel-info-simulator.component';
import { HotelInfoSimulatorCreateComponent } from './hotel-info-simulator-create/hotel-info-simulator-create.component';
import { HotelInfoSimulatorEditComponent } from './hotel-info-simulator-edit/hotel-info-simulator-edit.component';
import { HotelRoomSimulatorComponent } from './hotel-room-simulator/hotel-room-simulator.component';
import { HotelRoomSimulatorCreateComponent } from './hotel-room-simulator-create/hotel-room-simulator-create.component';
import { HotelRoomSimulatorEditComponent } from './hotel-room-simulator-edit/hotel-room-simulator-edit.component';
import { HotelSimulatorAdminComponent } from './hotel-simulator-admin.component';

@NgModule({
  declarations: [
    HotelSimulatorAdminComponent,
    HotelInfoSimulatorComponent,
    HotelInfoSimulatorCreateComponent,
    HotelInfoSimulatorEditComponent,
    HotelRoomSimulatorComponent,
    HotelRoomSimulatorCreateComponent,
    HotelRoomSimulatorEditComponent
  ],
  imports: [
    CommonModule,
    TagInputModule,
    FormsModule,
    HotelSimulatorAdminRoutingModule,
    SharedModule
  ],
  exports: [],
  providers: [],
})
export class HotelSimulatorAdminModule { }
