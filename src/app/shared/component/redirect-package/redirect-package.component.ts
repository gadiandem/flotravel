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

@Component({
  selector: 'app-redirect-package',
  templateUrl: './redirect-package.component.html',
  styleUrls: ['./redirect-package.component.css']
})
export class RedirectPackageComponent implements OnInit {
  @Input() fetching: boolean;
  @Input() fetchFailed: boolean;
  @Input() errorMes: string;
  @Input() currency: string;
  @Input() packagePaymentRes: OrderPackageCreateRes;
  
  summaryReq: SummaryPackageReq;
  selectedPackage: PackageShoppingRes;
  selectedRoom: HotelPackageDetailRes;
  selectedSupplements: SupplementPackageRes[];
  selectedTours: TourPackageRes[];
  selectedTransfers: TransferPackageRes[];
  packageSummaryRes: SummaryPackageRes;
  constructor() { }

  ngOnInit() {
    this.selectedSupplements = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_SUPPLEMENT)) || [];
    this.selectedTours = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_TOUR)) || [];
    this.selectedTransfers =  JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_TRANSFER)) || [];
    this.selectedPackage = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_PACKAGE));
    this.selectedRoom =  JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_ROOM));
    this.packageSummaryRes =  JSON.parse(sessionStorage.getItem(packagesConstant.SUMMARY_RESULT));
    this.summaryReq = JSON.parse(sessionStorage.getItem(packagesConstant.SUMMARY_REQ));
  }

}
