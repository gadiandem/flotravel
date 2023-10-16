import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { appConstant, supplierSimulatorOption } from '../../../app.constant';
import {Router} from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';

@Component({
  selector: 'app-setting-simulator',
  templateUrl: './setting-simulator.component.html',
  styleUrls: ['./setting-simulator.component.css']
})
export class SettingSimulatorComponent implements OnInit {
  hotelSupplierSimulator: string;
  isHotelSimulatorChecked: boolean;

  constructor(
    private _location: Location,
    private router: Router,
    private alertify: AlertifyService,
  ){}

  ngOnInit() {
    this.hotelSupplierSimulator = localStorage.getItem(appConstant.HOTEL_SIMULATOR_SUPPLIER) || supplierSimulatorOption.DISABLE;
    this.isHotelSimulatorChecked  = this.hotelSupplierSimulator === supplierSimulatorOption.ENABLE;
  }

  updateStateHotelSupplierSimulator(isChecked: boolean) {
    this.isHotelSimulatorChecked = isChecked;
  }


  saveSetting() {
    if (this.isHotelSimulatorChecked === true) {
      localStorage.setItem(appConstant.HOTEL_SIMULATOR_SUPPLIER, supplierSimulatorOption.ENABLE);
      this.alertify.success("Simulator enabled successfully!");
    } else {
      localStorage.setItem(appConstant.HOTEL_SIMULATOR_SUPPLIER, supplierSimulatorOption.DISABLE)
      this.alertify.success("Simulator Disabled!");
    }
    this.router.navigate(['/dashboard/hotel']);
  }
}
