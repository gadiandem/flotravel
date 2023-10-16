import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelInfoSimulatorComponent } from './hotel-info-simulator/hotel-info-simulator.component';
import { HotelInfoSimulatorCreateComponent } from './hotel-info-simulator-create/hotel-info-simulator-create.component';
import { HotelInfoSimulatorEditComponent } from './hotel-info-simulator-edit/hotel-info-simulator-edit.component';
import { HotelRoomSimulatorCreateComponent } from './hotel-room-simulator-create/hotel-room-simulator-create.component';
import { HotelRoomSimulatorComponent } from './hotel-room-simulator/hotel-room-simulator.component';
import { HotelRoomSimulatorEditComponent } from './hotel-room-simulator-edit/hotel-room-simulator-edit.component';
import { HotelSimulatorAdminLayoutComponent } from 'src/app/shared/layouts/hotel-simulator-admin-layout/hotel-simulator-admin-layout.component';

const routes: Routes = [
  {
    path: '', component: HotelSimulatorAdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'hotelInfoList', pathMatch: 'full'},
      { path: 'hotelInfoList', component: HotelInfoSimulatorComponent },
      { path: 'hotelInfo/create', component: HotelInfoSimulatorCreateComponent },
      { path: 'hotelInfo/edit/:hotelInfoId', component: HotelInfoSimulatorEditComponent },
      { path: 'hotelRoom', component: HotelRoomSimulatorComponent },
      { path: 'hotelRoom/create', component: HotelRoomSimulatorCreateComponent },
      { path: 'hotelRoom/edit/:hotelRoomId', component: HotelRoomSimulatorEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelSimulatorAdminRoutingModule { }
