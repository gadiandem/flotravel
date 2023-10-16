import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderLayoutComponent } from 'src/app/shared/layouts';
import { HotelCreateComponent } from './hotel-create/hotel-create.component';
import { HotelEditComponent } from './hotel-edit/hotel-edit.component';
import { HotelFacilityCreateComponent } from './hotel-facility-create/hotel-facility-create.component';
import { HotelFacilityEditComponent } from './hotel-facility-edit/hotel-facility-edit.component';
import { HotelFacilityComponent } from './hotel-facility/hotel-facility.component';
import { HotelRoomCreateComponent } from './hotel-room-create/hotel-room-create.component';
import { HotelRoomEditComponent } from './hotel-room-edit/hotel-room-edit.component';
import { HotelRoomComponent } from './hotel-room/hotel-room.component';
import { HotelComponent } from './hotel/hotel.component';
import { PackageAvailabilityComponent } from './package-availability/package-availability.component';
import { PackageInfoCreateComponent } from './package-info-create/package-info-create.component';
import { PackageInfoEditComponent } from './package-info-edit/package-info-edit.component';
import { PackageInfoComponent } from './package-info/package-info.component';
import { ProviderComponent } from './provider.component';
import { RegionCreateComponent } from './region-create/region-create.component';
import { RegionEditComponent } from './region-edit/region-edit.component';
import { RegionComponent } from './region/region.component';
import { SupplementCreateComponent } from './supplement-create/supplement-create.component';
import { SupplementEditComponent } from './supplement-edit/supplement-edit.component';
import { SupplementComponent } from './supplement/supplement.component';
import { TaxCreateComponent } from './tax-create/tax-create.component';
import { TaxEditComponent } from './tax-edit/tax-edit.component';
import { TaxComponent } from './tax/tax.component';
import { TourCreateComponent } from './tour-create/tour-create.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { TourComponent } from './tour/tour.component';
import { TransferCreateComponent } from './transfer-create/transfer-create.component';
import { TransferEditComponent } from './transfer-edit/transfer-edit.component';
import { TransferComponent } from './transfer/transfer.component';

// import { OtpUpdateComponent } from '../shared/component/otp-update/otp-update.component';
// import { PackagesComponent } from './packages.component';

const routes: Routes = [
  {
    path: '', component: ProviderLayoutComponent,
    children: [
      { path: '', redirectTo: 'packageList', pathMatch: 'full'},
      { path: 'packageList', component: PackageInfoComponent, },
      { path: 'package/create', component: PackageInfoCreateComponent, },
      { path: 'packageDetail/:packageId', component: PackageInfoEditComponent, },
      { path: 'packageAvailability', component: PackageAvailabilityComponent, },
      { path: 'hotel', component: HotelComponent },
      { path: 'hotel/create', component: HotelCreateComponent },
      { path: 'hotel/:hotelId', component: HotelEditComponent },
      { path: 'hotelRoom', component: HotelRoomComponent },
      { path: 'hotelRoom/create', component: HotelRoomCreateComponent },
      { path: 'hotelRoom/edit/:roomId', component: HotelRoomEditComponent },
      { path: 'supplement', component: SupplementComponent },
      { path: 'supplement/create', component: SupplementCreateComponent },
      { path: 'supplement/edit/:supplementId', component: SupplementEditComponent },
      { path: 'region', component: RegionComponent },
      { path: 'region/create', component: RegionCreateComponent },
      { path: 'region/edit/:regionId', component: RegionEditComponent },
      { path: 'tour', component: TourComponent },
      { path: 'tour/create', component: TourCreateComponent },
      { path: 'tour/edit/:tourId', component: TourEditComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'transfer/create', component: TransferCreateComponent },
      { path: 'transfer/edit/:transferId', component: TransferEditComponent },
      { path: 'tax', component: TaxComponent },
      { path: 'tax/create', component: TaxCreateComponent },
      { path: 'tax/edit/:taxId', component: TaxEditComponent },
      { path: 'hotelFacility', component: HotelFacilityComponent },
      { path: 'hotelFacility/create', component: HotelFacilityCreateComponent },
      { path: 'hotelFacility/edit/:facilityId', component: HotelFacilityEditComponent },
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesProviderRoutingModule { }
