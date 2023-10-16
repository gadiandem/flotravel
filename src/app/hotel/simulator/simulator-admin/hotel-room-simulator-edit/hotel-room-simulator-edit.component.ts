import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { appConstant } from '../../../../app.constant';
import { UserDetail } from '../../../../model/auth/user/user-detail';
import { HotelSimulatorService } from 'src/app/service/hotel/simulator/hotel-simulator.service';
import { HotelRoomSimulator } from '../../../../model/hotel/simulator/hotel-room-simulator';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { adminHotelSimulatorConstant } from '../hotel-simulator-admin.constant';


@Component({
  selector: 'app-hotel-room-simulator-edit',
  templateUrl: './hotel-room-simulator-edit.component.html',
  styleUrls: ['./hotel-room-simulator-edit.component.css']
})
export class HotelRoomSimulatorEditComponent implements OnInit {
  isLoading = false;
  hotelRoomForm: FormGroup;
  hotelRoomId: string;
  hotelRoomDetail: HotelRoomSimulator;
  hotelSimulatorSelected: HotelInfoSimulator;
  limit: number;
  searchHotel = "";
  hotelName: string;
  hotelId: string;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  formSubmitError: boolean;
  user: UserDetail;
  priceMin: number;

  constructor(
    private providerService: PakageProviderService,
    protected router: Router,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private hotelSimulatorService: HotelSimulatorService
  ) { }

  ngOnInit() {
    this.initForm();
    this.formSubmitError = false;
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    this.activeRoute.params.subscribe((params: Params) => {
      this.hotelRoomId = params['hotelRoomId'];
    });
    if (this.user != null) {
      this.isLoading = true;
      this.hotelSimulatorService.getHotelRoomSimulatorById(this.hotelRoomId).subscribe(data => {
        this.hotelRoomDetail = data;
        if (this.hotelRoomDetail) {
          this.updateFormWithData();
        }
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      })
    }
    this.hotelId = sessionStorage.getItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_ID);
    this.hotelName = sessionStorage.getItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_NAME);
    this.hotelSimulatorSelected = JSON.parse(sessionStorage.getItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_SELECTED)) || null;
    this.priceMin = this.hotelSimulatorSelected.minPrice || 0;
  }

  updateFormWithData() {
    this.hotelRoomForm.patchValue({
      roomType: this.hotelRoomDetail.roomType,
      boardDescription: this.hotelRoomDetail.boardDescription,
      adultCount: this.hotelRoomDetail.adultCount,
      childCount: this.hotelRoomDetail.childCount,
      pricePerNight: this.hotelRoomDetail.pricePerNight,
      discount: this.hotelRoomDetail.discount
    });
  }

  initForm() {
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
      hotelRoom.hotelSimulatorId = this.hotelId || this.hotelRoomDetail.hotelSimulatorId;
      hotelRoom.roomType = d.roomType || this.hotelRoomDetail.roomType;
      hotelRoom.boardDescription = d.boardDescription || this.hotelRoomDetail.boardDescription;
      hotelRoom.adultCount = +d.adultCount || this.hotelRoomDetail.adultCount;
      hotelRoom.childCount = +d.childCount || this.hotelRoomDetail.childCount;
      hotelRoom.pricePerNight = +d.pricePerNight || this.hotelRoomDetail.pricePerNight;
      hotelRoom.discount = +d.discount || this.hotelRoomDetail.discount;
      hotelRoom.currency = this.hotelRoomDetail.currency || this.hotelSimulatorSelected.currency;

      this.hotelSimulatorService.updateHotelRoomSimulator(hotelRoom, this.hotelRoomId).subscribe(
        (res: HotelRoomSimulator) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update hotel room successful!`);
        },
        (e) => {
          this.alertify.error(`Update hotel room fail!. ${e}`);
        }
      );
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
