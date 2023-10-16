import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { HotelRoomPackage } from 'src/app/model/packages/provider/hotel-room-package';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';
import {providerPackagesConstant} from '../provider-packages.constant';

@Component({
  selector: 'app-hotel-room-edit',
  templateUrl: './hotel-room-edit.component.html',
  styleUrls: ['./hotel-room-edit.component.css']
})
export class HotelRoomEditComponent implements OnInit {
  hotelRoomForm: FormGroup;
  hotelRoomId: string;
  hotelRoomDetail: HotelRoomPackage;
  limit: number;
  searchHotel = "";
  hotelName: string;
  hotelId: string;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.initForm();
    this.store.select('providerSpecialPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;

      this.hotelRoomDetail = data.packageHotelRoomDetailRes;
      if (this.hotelRoomDetail) {
        this.updateFormWithData();
      }
    })
    this.hotelId = sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_ID);
    this.hotelName = sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_NAME);
    this.activeRoute.params.subscribe((params: Params) => {
      this.hotelRoomId = params["roomId"];
    });
  }

   updateFormWithData() {
    this.hotelRoomForm.patchValue({
      roomType: this.hotelRoomDetail.roomType,
      roomDescription: this.hotelRoomDetail.roomDescription,
      adultCount: this.hotelRoomDetail.adultCount,
      childCount: this.hotelRoomDetail.childCount,
    });
  }

  initForm() {
    this.hotelRoomForm = new FormGroup({
      roomType: new FormControl("", [Validators.required]),
      roomDescription: new FormControl("", [Validators.required]),
      adultCount: new FormControl(1, [Validators.required]),
      childCount: new FormControl(0, [Validators.required]),
    });
  }

  createRoom() {
    if (this.hotelRoomForm.valid) {
      const hotelRoom: HotelRoomPackage = new HotelRoomPackage();
      const d: any = this.hotelRoomForm.value;
      hotelRoom.hotelId = this.hotelId || this.hotelRoomDetail.hotelId;
      hotelRoom.roomType = d.roomType;
      hotelRoom.roomDescription = d.roomDescription;
      hotelRoom.adultCount = +d.adultCount;
      hotelRoom.childCount = +d.childCount;

      // this.providerService.updateHotelRoom(hotelRoom, this.hotelRoomId).subscribe(
      //   (res: HotelRoomPackage) => {
      //     console.log(JSON.stringify(res));
      //     this.alertify.success(`Create ${res.roomType} create succeeful!`);
      //     this._location.back();
      //   },
      //   (e) => {
      //     this.alertify.error(`Create ${hotelRoom.roomType} error!. ${e}`);
      //   }
      // );
      this.store.dispatch(new ProviderPackagesActions.UpdatePackageHotelRoomStart({packHotelRoomReq: hotelRoom, packageHotelRoomId: this.hotelRoomId}));
      this._location.back();
    } else {
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
