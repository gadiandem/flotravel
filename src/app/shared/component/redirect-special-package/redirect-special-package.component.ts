import { Component, Input, OnInit } from '@angular/core';
import { HotelPackageDetailRes } from 'src/app/model/packages/consumer/hotel-package-detail-res';
import { OrderPackageCreateRes } from 'src/app/model/packages/consumer/order-package-create-res';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { SummaryPackageReq } from 'src/app/model/packages/consumer/summary-package-req';
import { SummaryPackageRes } from 'src/app/model/packages/consumer/summary-package-res';
import { SupplementPackageRes } from 'src/app/model/packages/consumer/supplement-package-res';
import { TourPackageRes } from 'src/app/model/packages/consumer/tour-package-res';
import { TransferPackageRes } from 'src/app/model/packages/consumer/transfer-pacakge-res';
import { packagesConstant } from 'src/app/packages/packages.constant';
import { specialPackagesConstant } from 'src/app/special-packages/special-packages.constant';

@Component({
  selector: 'app-redirect-special-package',
  templateUrl: './redirect-special-package.component.html',
  styleUrls: ['./redirect-special-package.component.css']
})
export class RedirectSpecialPackageComponent implements OnInit {
  @Input() fetching: boolean;
  @Input() fetchFailed: boolean;
  @Input() errorMes: string;
  @Input() currency: string;
  @Input() specialPackagePaymentRes: OrderPackageCreateRes;
  
  summaryReq: SummaryPackageReq;
  selectedPackage: PackageShoppingRes;
  selectedRoom: HotelPackageDetailRes;
  selectedSupplements: SupplementPackageRes[];
  selectedTours: TourPackageRes[];
  selectedTransfers: TransferPackageRes[];
  packageSummaryRes: SummaryPackageRes;
  constructor() { }

  ngOnInit() {
    this.selectedSupplements = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_SUPPLEMENT)) || [];
    this.selectedTours = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TOUR)) || [];
    this.selectedTransfers =  JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TRANSFER)) || [];
    this.selectedPackage = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_PACKAGE));
    this.selectedRoom =  JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_ROOM));
    this.packageSummaryRes =  JSON.parse(sessionStorage.getItem(specialPackagesConstant.SUMMARY_RESULT));
    this.summaryReq = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SUMMARY_REQ));
  }

}
