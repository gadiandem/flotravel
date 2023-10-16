import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelSimulatorUserComponent } from './hotel-simulator-user.component';
import { HotelListSimulatorComponent } from './hotel-list-simulator/hotel-list-simulator.component';
import { HotelCartSimulatorComponent } from './hotel-cart-simulator/hotel-cart-simulator.component';
import { HotelResultSimulatorComponent } from './hotel-result-simulator/hotel-result-simulator.component';

const routes: Routes = [
  {
    path: '', component: HotelSimulatorUserComponent,
    children: [
      { path: '', redirectTo: 'hotelList', pathMatch: 'full'},
      { path: 'hotelList', component: HotelListSimulatorComponent },
      { path: 'hotelDetail/:hotelcode', component: HotelListSimulatorComponent },
      { path: 'cart', component: HotelCartSimulatorComponent },
      { path: 'booking-result', component: HotelResultSimulatorComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelSimulatorUserRoutingModule { }
