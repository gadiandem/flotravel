import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

import { SpecialPackagesProviderRoutingModule } from './special-packages-provider-routing.module';
import { SharedModule } from 'src/app/shared/share.module';
import { ProviderComponent } from './provider.component';
import { HotelComponent } from './hotel/hotel.component';
import { TourComponent } from './tour/tour.component';
import { TaxComponent } from './tax/tax.component';
import { TransferComponent } from './transfer/transfer.component';
import { SupplementComponent } from './supplement/supplement.component';
import { PackageOrderComponent } from './package-order/package-order.component';
import { HotelRoomComponent } from './hotel-room/hotel-room.component';
import { PackageInfoComponent } from './package-info/package-info.component';
import { PackageInfoEditComponent } from './package-info-edit/package-info-edit.component';
import { RegionComponent } from './region/region.component';
import { PackageAvailabilityComponent } from './package-availability/package-availability.component';
import { HotelEditComponent } from './hotel-edit/hotel-edit.component';
import { PackageInfoCreateComponent } from './package-info-create/package-info-create.component';
import { HotelCreateComponent } from './hotel-create/hotel-create.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { TourCreateComponent } from './tour-create/tour-create.component';
import { SupplementEditComponent } from './supplement-edit/supplement-edit.component';
import { SupplementCreateComponent } from './supplement-create/supplement-create.component';
import { TransferEditComponent } from './transfer-edit/transfer-edit.component';
import { TransferCreateComponent } from './transfer-create/transfer-create.component';
import { TaxCreateComponent } from './tax-create/tax-create.component';
import { TaxEditComponent } from './tax-edit/tax-edit.component';
import { HotelRoomEditComponent } from './hotel-room-edit/hotel-room-edit.component';
import { HotelRoomCreateComponent } from './hotel-room-create/hotel-room-create.component';
import { RegionEditComponent } from './region-edit/region-edit.component';
import { RegionCreateComponent } from './region-create/region-create.component';
import { HotelFacilityComponent } from './hotel-facility/hotel-facility.component';
import { HotelFacilityEditComponent } from './hotel-facility-edit/hotel-facility-edit.component';
import { HotelFacilityCreateComponent } from './hotel-facility-create/hotel-facility-create.component';
import { PackageSideBarComponent } from './package-side-bar/package-side-bar.component';

@NgModule({
  declarations: [
    ProviderComponent,
    HotelComponent,
    TourComponent,
    TaxComponent,
    TransferComponent,
    SupplementComponent,
    PackageOrderComponent,
    HotelRoomComponent,
    PackageInfoComponent,
    PackageInfoEditComponent,
    RegionComponent,
    PackageAvailabilityComponent,
    HotelEditComponent,
    PackageInfoCreateComponent,
    HotelCreateComponent,
    TourEditComponent,
    TourCreateComponent,
    SupplementEditComponent,
    SupplementCreateComponent,
    TransferEditComponent,
    TransferCreateComponent,
    TaxCreateComponent,
    TaxEditComponent,
    HotelRoomEditComponent,
    HotelRoomCreateComponent,
    RegionEditComponent,
    RegionCreateComponent,
    HotelFacilityComponent,
    HotelFacilityEditComponent,
    HotelFacilityCreateComponent,
    PackageSideBarComponent,
  ],
  imports: [
    CommonModule,
    TagInputModule,
    FormsModule,
    SpecialPackagesProviderRoutingModule,
    SharedModule
  ],
  exports: [],
  providers: [],
})
export class SpecialPackagesProviderModule { }
