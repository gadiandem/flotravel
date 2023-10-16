import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { adminHotelSimulatorConstant } from '../hotel-simulator-admin.constant';
import { HotelSimulatorService } from 'src/app/service/hotel/simulator/hotel-simulator.service';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { HotelRoomSimulator } from '../../../../model/hotel/simulator/hotel-room-simulator';
import {appDefaultData} from '../../../../app.constant';

@Component({
  selector: 'app-hotel-room-simulator-create',
  templateUrl: './hotel-room-simulator-create.component.html',
  styleUrls: ['./hotel-room-simulator-create.component.css']
})
export class HotelRoomSimulatorCreateComponent implements OnInit {
  hotelRoomForm: FormGroup;
  hotelSimulatorSelected: HotelInfoSimulator;
  limit: number;
  searchHotel = "";
  hotelName: string;
  hotelId: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;
  priceMin: number;
  formSubmitError: boolean;

  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private hotelSimulatorService: HotelSimulatorService
  ) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.hotelId = sessionStorage.getItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_ID);
    this.hotelName = sessionStorage.getItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_NAME);
    this.hotelSimulatorSelected = JSON.parse(sessionStorage.getItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_SELECTED)) || null;
    if (this.hotelSimulatorSelected) {
      this.priceMin = this.hotelSimulatorSelected.minPrice || 0;
    }
    this.initForm();
  }

  private initForm() {
    this.hotelRoomForm = new FormGroup({
      roomType: new FormControl("SINGLE STANDARD", [Validators.required]),
      boardDescription: new FormControl("ROOM ONLY", [Validators.required]),
      adultCount: new FormControl(1, [Validators.required]),
      childCount: new FormControl(0, [Validators.required]),
      pricePerNight: new FormControl(this.priceMin || 0, [Validators.required, Validators.min(this.priceMin || 0)]),
      discount: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$"),Validators.min(0), Validators.max(100)])
    });
  }

  createRoom() {
    if (this.hotelRoomForm.valid) {
      const hotelRoom: HotelRoomSimulator = new HotelRoomSimulator();
      const d: any = this.hotelRoomForm.value;
      hotelRoom.hotelSimulatorId = this.hotelId;
      hotelRoom.roomType = d.roomType;
      hotelRoom.boardDescription = d.boardDescription;
      hotelRoom.adultCount = +d.adultCount;
      hotelRoom.childCount = +d.childCount;
      hotelRoom.currency = this.hotelSimulatorSelected.currency || appDefaultData.DEFAULT_CURRENCY;
      hotelRoom.pricePerNight = +d.pricePerNight;
      hotelRoom.discount = +d.discount;
      this.hotelSimulatorService.createHotelRoomSimulator(hotelRoom).subscribe(data => {
        console.log(JSON.stringify(data));
        this.alertify.success(`Create room successful!`);
      }, error => {
        console.log(error);
        this.alertify.error(`create room fail!`)
      })
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
