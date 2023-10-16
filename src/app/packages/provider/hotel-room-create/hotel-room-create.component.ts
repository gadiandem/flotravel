import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { HotelRoomPackage } from 'src/app/model/packages/provider/hotel-room-package';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import {providerPackagesConstant} from '../provider-packages.constant';

@Component({
  selector: 'app-hotel-room-create',
  templateUrl: './hotel-room-create.component.html',
  styleUrls: ['./hotel-room-create.component.css']
})
export class HotelRoomCreateComponent implements OnInit {
  hotelRoomForm: FormGroup;
  limit: number;
  searchHotel = "";
  hotelName: string;
  hotelId: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;

  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.hotelId = sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_ID);
    this.hotelName = sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_NAME);
    this.initForm();
  }

  private initForm() {
    this.hotelRoomForm = new FormGroup({
      // hotel: new FormControl("", [Validators.required]),
      roomType: new FormControl("", [Validators.required]),
      roomDescription: new FormControl("", [Validators.required]),
      adultCount: new FormControl(1, [Validators.required]),
      childCount: new FormControl(0, [Validators.required]),
    });
  }
  // selectHotel(des: any) {
  //   this.hotelName = des.name;
  //   this.hotelId = des.id;
  // }

  createRoom() {
    if (this.hotelRoomForm.valid) {
      const hotelRoom: HotelRoomPackage = new HotelRoomPackage();
      const d: any = this.hotelRoomForm.value;
      hotelRoom.hotelId = this.hotelId;
      hotelRoom.roomType = d.roomType;
      hotelRoom.roomDescription = d.roomDescription;
      hotelRoom.adultCount = +d.adultCount;
      hotelRoom.childCount = +d.childCount;
      this.store.dispatch(new ProviderPackagesActions.CreatePackageHotelRoomStart({packageHotelRoomCreateReq: hotelRoom}));
      this._location.back();
    } else {
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
